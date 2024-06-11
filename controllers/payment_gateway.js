import Transaksi_Nyawer from "../models/Transaksi_Nyawer.js"
import Dompet from "../models/dompet.js"


import Utils from "../controllers/utils.js"
import axios from "axios";
import md5 from "md5";

const redirect = (req, res) => {
    const id_transaksi = req.params.id_transaksi
    if (id_transaksi) {
        Transaksi_Nyawer.findOne({ where: { id_transaksi: id_transaksi } }).then(transaksiNyawerByID => {
            if (transaksiNyawerByID) {
                if (transaksiNyawerByID.status_transaksi == "Pending - Menunggu Pembayaran") {
                    // console.log(req.params);
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
                                res.redirect(303, '/bayar/' + id_transaksi)
                            }
                            else if (responsePG.data.statusCode == "00") {
                                Transaksi_Nyawer.update({ status_transaksi: "Sukses" }, { where: { id_transaksi: transaksiNyawerByID.id_transaksi } }).then(updateTransaksi => {
                                    if (updateTransaksi) {

                                        Dompet.findOne({ where: { reff_transaksi: transaksiNyawerByID.id_transaksi } }).then(cekTransaksiDompet => {
                                            if (!cekTransaksiDompet) {
                                                console.log(1);
                                                const dataDompet = {
                                                    id_dompet: Utils.generateID("", 8),
                                                    id_user: transaksiNyawerByID.user_id_penerima,
                                                    reff_transaksi: transaksiNyawerByID.id_transaksi,
                                                    nama_transaksi: "Penambahan saldo dari " + transaksiNyawerByID.nama_pengirim,
                                                    penyesuaian: "Credit",
                                                    nominal: transaksiNyawerByID.total_terima,
                                                    waktu_transaksi_dompet: new Date().toISOString(),
                                                    status_transaksi_dompet: "Sukses"
                                                }
                                                Dompet.create(dataDompet).then(createTRXDompet => {
                                                    if (createTRXDompet) {
                                                        req.flash('info', 'Transaksi Nyawer telah Sukses.')
                                                        res.redirect(303, '/bayar/' + id_transaksi)
                                                    }
                                                })
                                            }
                                        })
                                    }
                                })
                            }

                            else if (responsePG.data.statusCode == "02") {
                                Transaksi_Nyawer.update({ status_transaksi: "Gagal - Dibatalkan System" }, { where: { id_transaksi: transaksiNyawerByID.id_transaksi } }).then(updateTransaksi => {
                                    if (updateTransaksi) {
                                        const statusNyawer = "Gagal - Dibatalkan System"
                                        req.flash('info', 'Transaksi Nyawer telah Gagal - Dibatalkan System.')
                                        res.redirect(303, '/bayar/' + id_transaksi)
                                    }
                                })
                            }
                        })
                        .catch(error => {
                            console.error(error);
                        });
                } else {
                    req.flash('info', 'Transaksi Nyawer telah ' + transaksiNyawerByID.status_transaksi + ".")
                    res.redirect(303, '/bayar/' + id_transaksi)
                }
            }
            else {
                // Transaksi tidak Terdaftar
                req.flash('info', 'Transaksi Nyawer tidak Ditemukan.')
                res.redirect(303, '/')
            }
        })
    }
    else {
        // Parameter ID Transaksi tidak Ada
        req.flash('info', 'Parameter ID Transaksi Nyawer tidak Ada.')
        res.redirect(303, '/')
    }
}



export default { redirect }