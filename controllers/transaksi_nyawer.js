import Transaksi_Nyawer from '../models/transaksi_nyawer.js';
import Users from '../models/user.js';
import Metode_Pembayaran from '../models/metode_pembayaran.js';
import mysql from '../models/model_mysql.js';
import dompet from '../models/dompet.js';

import Utils from '../controllers/utils.js';
import axios from "axios";
import md5 from "md5";

const nyawerUser = (req, res) => {
    const uname = req.params.uname;
    if (uname) {
        if (uname != "bayar") {
            if (uname != "tamu") {
                Users.findOne({ where: { username: uname } }).then((penerima) => {
                    if (penerima) {
                        if (penerima.status_user == "Aktif") {

                            if (req.session.user) {
                                if (req.session.user.username == uname) {
                                    // User Penerima tidak boleh diri sendiri
                                    req.flash('info', 'Penerima tidak boleh diri sendiri ya.')
                                    res.redirect(303, '/')
                                }
                            }
                            let sqlGetMetodePembayaran = "SELECT * FROM metode_pembayarans where publish='Yes' ";
                            mysql.conn.query(sqlGetMetodePembayaran, (err, dataMP) => {
                                if (err) throw err;
                                res.render('nyawer_user', { user: req.session.user, penerima: penerima, dataMP })
                            })
                        } else {
                            // User Penerima tidak Aktif
                            req.flash('info', 'User Penerima sedang tidak Aktif.')
                            res.redirect(303, '/')
                        }
                    }
                    else {
                        req.flash('info', 'User Penerima tidak Terdaftar.')
                        res.redirect(303, '/')
                    }
                })
            }
            else {
                req.flash('info', 'Penerima tidak boleh tamu ya.')
                res.redirect(303, '/')
            }
        } else {
            req.flash('info', 'Penerima tidak boleh bayar ya.')
            res.redirect(303, '/')
        }
    }
}

const doNyawerUser = (req, res) => {
    const dataBodyNyawer = req.body.dataNyawer

    if (req.session.user) {
        var userIDPengirim = req.session.user.user_id
        var namaPengirim = req.session.user.nama_user
        var emailPengirim = req.session.user.email
        var noTelpPengirim = req.session.user.no_telp
    } else {
        var userIDPengirim = "tamu";
        var namaPengirim = dataBodyNyawer.nama_pengirim
        var emailPengirim = dataBodyNyawer.email_pengirim
        var noTelpPengirim = "08998804880"
    }


    // do Nyawer 1 - Cek Penerima
    if (dataBodyNyawer.user_id_penerima) {
        if (dataBodyNyawer.user_id_penerima != "bayar") {
            if (dataBodyNyawer.user_id_penerima != "tamu") {
                Users.findOne({ where: { username: dataBodyNyawer.user_id_penerima } }).then((penerima) => {
                    if (penerima) {
                        if (penerima.status_user == "Aktif") {

                            // Do Nyawer 2 - Cek Metode Pembayaran
                            Metode_Pembayaran.findOne({ where: { id_mp: dataBodyNyawer.metode_pembayaran_id } }).then((metode_pembayaran) => {
                                if (metode_pembayaran) {
                                    if (metode_pembayaran.status_mp == "Aktif") {

                                        let biayaAdmin = 0
                                        if (metode_pembayaran.penyesuaian_biaya == "Persentase") {
                                            biayaAdmin = dataBodyNyawer.nominal * metode_pembayaran.biaya_mp
                                        }
                                        else if (metode_pembayaran.penyesuaian_biaya == "Fixed") {
                                            biayaAdmin = metode_pembayaran.biaya_mp
                                        }
                                        else if (metode_pembayaran.penyesuaian_biaya == "Persentase + Fixed") {
                                            const arrBiayaPF = metode_pembayaran.biaya_mp.split("+")
                                            biayaAdmin = parseInt(dataBodyNyawer.nominal * arrBiayaPF[0]) + parseInt(arrBiayaPF[1])
                                        }

                                        const id_transaksi = Utils.generateID("", 10)
                                        const nominal = parseInt(dataBodyNyawer.nominal)
                                        const data = {
                                            "merchantCode": "DS14804",
                                            "paymentAmount": nominal,
                                            "paymentMethod": metode_pembayaran.id_mp,
                                            "merchantOrderId": id_transaksi,
                                            "productDetails": "Pembayaran untuk Saweran - " + penerima.nama_user,
                                            "customerVaName": namaPengirim,
                                            "email": emailPengirim,
                                            "phoneNumber": noTelpPengirim,
                                            "callbackUrl": "http://127.0.0.1:3030/cb/" + id_transaksi,
                                            "returnUrl": "http://127.0.0.1:3030/rd/" + id_transaksi,
                                            "signature": md5("DS14804" + id_transaksi + nominal + "4feb989c8424feacd7f4f09b0068230b"),
                                            "expiryPeriod": 10
                                        };

                                        axios.post('https://sandbox.duitku.com/webapi/api/merchant/v2/inquiry', data, {
                                            headers: {
                                                'Content-Type': 'application/json'
                                            }
                                        })
                                            .then(responsePG => {
                                                if (responsePG.data.statusCode == "00") {
                                                    const dataNyawer = {
                                                        id_transaksi: id_transaksi,
                                                        reff_pg: responsePG.data.reference,
                                                        nama_pengirim: namaPengirim,
                                                        user_id_pengirim: userIDPengirim,
                                                        email_pengirim: emailPengirim,
                                                        user_id_penerima: penerima.user_id,
                                                        nominal: nominal,
                                                        pesan_pengirim: dataBodyNyawer.pesan_pengirim,
                                                        metode_pembayaran_id: dataBodyNyawer.metode_pembayaran_id,
                                                        biaya_admin: parseInt(biayaAdmin),
                                                        total_terima: nominal - parseInt(biayaAdmin),
                                                        link_bayar: responsePG.data.paymentUrl,
                                                        waktu_transaksi: new Date().toISOString(),
                                                        status_transaksi: "Pending - Menunggu Pembayaran"
                                                    }
                                                    // Do Nyawer 3
                                                    Transaksi_Nyawer.create(dataNyawer).then((results) => {
                                                        if (results) {
                                                            const statusNyawer = "OK"
                                                            res.json({ status: 200, error: null, dataNyawer, statusNyawer });
                                                        }
                                                    })
                                                } else {
                                                    console.log(responsePG);
                                                }
                                            })
                                            .catch(error => {
                                                console.log(error);
                                            });
                                    }
                                    else {
                                        // Metode Pembayaran tidak Aktif
                                        const statusNyawer = "Metode Pembayaran tidak Aktif"
                                        res.json({ status: 200, error: null, statusNyawer });
                                    }
                                }
                                else {
                                    // Metode Pembayaran tidak Terdaftar
                                    const statusNyawer = "Metode Pembayaran tidak Terdaftar"
                                    res.json({ status: 200, error: null, statusNyawer });
                                }
                            })
                        } else {
                            // User Penerima tidak Aktif  
                            const statusNyawer = "User Penerima tidak Aktif"
                            res.json({ status: 200, error: null, statusNyawer });
                        }
                    }
                    else {
                        // User Penerima tidak Terdaftar
                        const statusNyawer = "User Penerima tidak Aktif"
                        res.json({ status: 200, error: null, statusNyawer });
                    }
                })
            } else {
                // User Penerima tidak boleh ke tamu
                const statusNyawer = "User Penerima tidak boleh ke tamu"
                res.json({ status: 200, error: null, statusNyawer });
            }
        }
        else {
            // User Penerima tidak boleh ke bayar
            const statusNyawer = "User Penerima tidak boleh ke bayar"
            res.json({ status: 200, error: null, statusNyawer });
        }
    }
    else {
        // Parameter User Penerima tidak Ada
        const statusNyawer = "Parameter User Penerima tidak Ada"
        res.json({ status: 200, error: null, statusNyawer });
    }
}

const cekTransaksiNyawer = (req, res) => {
    const dataBodyNyawer = req.body.dataNyawer
    Transaksi_Nyawer.findOne({ where: { id_transaksi: dataBodyNyawer.id_transaksi } }).then(transaksiNyawerByID => {
        if (transaksiNyawerByID) {
            if (transaksiNyawerByID.status_transaksi == "Pending - Menunggu Pembayaran") {
                const data = {
                    merchantcode: "DS14804",
                    merchantOrderId: transaksiNyawerByID.id_transaksi,
                    signature: md5("DS14804" + transaksiNyawerByID.id_transaksi + "4feb989c8424feacd7f4f09b0068230b")
                };

                axios
                    .post("https://sandbox.duitku.com/webapi/api/merchant/transactionStatus", data, {
                        headers: {
                            "Content-Type": "application/json"
                        }
                    })
                    .then(responsePG => {
                        if (responsePG.data.statusCode == "01") {
                            const statusNyawer = "Pending - Menunggu Pembayaran"
                            res.json({ status: 200, error: null, transaksiNyawerByID, statusNyawer });
                        }
                        else if (responsePG.data.statusCode == "00") {
                            transaksi_nyawer.update({ status_transaksi: "Sukses" }, { where: { id_transaksi: transaksiNyawerByID.id_transaksi } }).then(updateTransaksi => {
                                if (updateTransaksi) {

                                    dompet.findOne({ where: { reff_transaksi: transaksiNyawerByID.id_transaksi } }).then(cekTransaksiDompet => {
                                        if (!cekTransaksiDompet) {
                                            const dataDompet = {
                                                id_dompet: Utils.generateID("", 8),
                                                id_user: transaksiNyawerByID.user_id_penerima,
                                                reff_transaksi: transaksiNyawerByID.id_transaksi,
                                                nama_transaksi: "Penambahan saldo dari " + transaksiNyawerByID.nama_pengirim,
                                                penyesuaian: "Credit",
                                                nominal: transaksiNyawerByID.total_terima,
                                                status_transaksi_dompet: "Sukses"
                                            }
                                            dompet.create(dataDompet).then(createTRXDompet => {
                                                if (createTRXDompet) {
                                                    const statusNyawer = "Sukses"
                                                    res.json({ status: 200, error: null, transaksiNyawerByID, statusNyawer });
                                                }
                                            })
                                        }
                                    })
                                }
                            })
                        }

                        else if (responsePG.data.statusCode == "02") {
                            transaksi_nyawer.update({ status_transaksi: "Gagal - Dibatalkan System" }, { where: { id_transaksi: transaksiNyawerByID.id_transaksi } }).then(updateTransaksi => {
                                if (updateTransaksi) {
                                    const statusNyawer = "Gagal - Dibatalkan System"
                                    res.json({ status: 200, error: null, transaksiNyawerByID, statusNyawer });
                                }
                            })
                        }
                    })
                    .catch(error => {
                        console.error(error);
                    });

                // res.json({ status: 200, error: null, transaksiNyawerByID, statusNyawer });
            }
            else {
                const statusNyawer = transaksiNyawerByID.status_transaksi
                res.json({ status: 200, error: null, transaksiNyawerByID, statusNyawer });
            }
        }
        else {
            // Transaksi tidak Ditemukan
            const statusNyawer = "Transaksi Nyawer tidak Ditemukan"
            res.json({ status: 200, error: null, statusNyawer });
        }
    })
}

const bayarNyawerUser = (req, res) => {
    const id_transaksi = req.params.id_transaksi

    if (id_transaksi) {
        let sqlTransaksiByID = "SELECT * FROM transaksi_nyawers tn INNER JOIN users u ON tn.user_id_penerima = u.user_id INNER JOIN metode_pembayarans mp ON tn.metode_pembayaran_id = mp.id_mp WHERE tn.id_transaksi='" + id_transaksi + "'";
        mysql.conn.query(sqlTransaksiByID, (err, transaksiNyawerByID) => {
            if (err) throw err;
            if (transaksiNyawerByID.length === 1) {
                res.render('bayar_nyawer', { user: req.session.user, transaksiNyawerByID })
            } else {
                // Transaksi Nyawer tidak Ditemukan
                req.flash('info', 'Transaksi Nyawer tidak Ditemukan.')
                res.redirect(303, '/')
            }
        })
    }
    else {
        // Parameter ID Transaksi tidak Ada
        req.flash('info', 'Parameter ID Transaksi tidak Ada.')
        res.redirect(303, '/')
    }
}

export default { nyawerUser, doNyawerUser, bayarNyawerUser, cekTransaksiNyawer };
