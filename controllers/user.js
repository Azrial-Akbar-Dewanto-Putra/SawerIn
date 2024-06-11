import User from '../models/user.js';
import Dompet from '../models/dompet.js';
import mysql from '../models/model_mysql.js';

import Utils from '../controllers/utils.js';

const totalSaldo = (user_id) => {
    return new Promise((resolve, reject) => {
        let sqlSumSaldo = "SELECT sum(nominal) as totalSaldo FROM dompets where id_user='" + user_id + "'";
        mysql.conn.query(sqlSumSaldo, (err, sumSaldo) => {
            if (err) reject(err);
            if (sumSaldo) {
                resolve(sumSaldo[0]['totalSaldo'])
            } else {
                reject(null)
            }
        })
    });
}

const userProfile = async (req, res) => {
    try {
        if (req.session.user) {
            const id_user = req.session.user.user_id


            const Saldo = await totalSaldo(id_user);
            mysql.conn.query("SELECT * FROM users where user_id='" + id_user + "'", (err, dataUser) => {
                if (err) throw err;
                if (dataUser.length == 1) {
                    res.render('user/profile', { user: req.session.user, Saldo, dataUser })
                }
                else {
                    req.flash('info', 'Maaf, User tidak Terdaftar.')
                    res.redirect(303, '/user/dashboard')
                }
            })
        }
        else {
            req.flash('info', 'Maaf, Anda harus Login.')
            res.redirect(303, '/')
        }
    } catch (error) {
        console.error(error)
    }
}

const changeUserProfile = async (req, res) => {
    try {
        if (req.session.user) {
            const id_user = req.session.user.user_id


            const Saldo = await totalSaldo(id_user);
            mysql.conn.query("SELECT * FROM users where user_id='" + id_user + "'", (err, dataUser) => {
                if (err) throw err;
                if (dataUser.length == 1) {
                    res.render('user/change_profile', { user: req.session.user, Saldo, dataUser })
                }
                else {
                    req.flash('info', 'Maaf, User tidak Terdaftar.')
                    res.redirect(303, '/user/dashboard')
                }
            })
        }
        else {
            req.flash('info', 'Maaf, Anda harus Login.')
            res.redirect(303, '/')
        }
    } catch (error) {
        console.error(error)
    }
}


const doChangeProfile = (req, res) => {
    if (req.session.user) {
        const id_user = req.session.user.user_id

        const dataBodyCP = req.body.dataChangeProfile
        User.findOne({ where: { user_id: id_user } }).then((userProfile) => {
            if (userProfile) {

                if (userProfile.password == dataBodyCP.password_check_valid) {
                    if (userProfile.status_user == "Aktif") {
                        const dataChangeProfile = {
                            nama_user: dataBodyCP.nama_user,
                            password: dataBodyCP.password
                        }
                        User.update(dataChangeProfile, { where: { user_id: id_user } }).then((updateUser) => {
                            const statusChangeProfile = "OK"
                            res.json({ status: 200, error: null, statusChangeProfile, dataChangeProfile });
                        }).catch((err) => {
                            console.log(err)
                        })
                    }
                    else {
                        const statusChangeProfile = "Status User " + userProfile.status_user + "."
                        res.json({ status: 200, error: null, statusChangeProfile });
                    }
                }
                else {
                    const statusChangeProfile = "Konfirmasi Password tidak Benar."
                    res.json({ status: 200, error: null, statusChangeProfile });
                }

            }
            else {
                const statusChangeProfile = "User tidak Terdaftar."
                res.json({ status: 200, error: null, statusChangeProfile });
            }
        })
    }
    else {
        req.flash('info', 'Maaf, Anda harus Login.')
        res.redirect(303, '/')
    }
}
const dashboardUser = async (req, res) => {
    try {
        if (req.session.user) {
            const id_user = req.session.user.user_id
            const Saldo = await totalSaldo(id_user);
            res.render('user/dashboard_user', { user: req.session.user, Saldo })
        }
        else {
            req.flash('info', 'Maaf, Anda harus Login.')
            res.redirect(303, '/')
        }
    } catch (error) {
        console.error(error)
    }
}

const dashboardSaweran = (req, res) => {
    const kategori = req.params.kategori

    if (req.session.user) {
        const id_user = req.session.user.user_id
        if (kategori) {
            if (kategori == "masuk") {
                let sqlTNUser = "SELECT * FROM transaksi_nyawers tn INNER JOIN users u ON tn.user_id_penerima = u.user_id INNER JOIN metode_pembayarans mp ON tn.metode_pembayaran_id = mp.id_mp WHERE u.user_id='" + id_user + "'";
                mysql.conn.query(sqlTNUser, (err, saweranMasuk) => {
                    if (err) throw err;
                    if (saweranMasuk) {
                        res.render("user/saweran_masuk", { user: req.session.user, saweranMasuk })
                    }
                })
            }
            else if (kategori == "keluar") {
                let sqlTNUser = "SELECT * FROM transaksi_nyawers tn INNER JOIN users u ON tn.user_id_penerima = u.user_id INNER JOIN metode_pembayarans mp ON tn.metode_pembayaran_id = mp.id_mp WHERE tn.user_id_pengirim='" + id_user + "'";
                mysql.conn.query(sqlTNUser, (err, saweranKeluar) => {
                    if (err) throw err;
                    if (saweranKeluar) {
                        res.render("user/saweran_keluar", { user: req.session.user, saweranKeluar })
                    }
                })
            }
            else {
                req.flash('info', 'Parameter Kategori Saweran tidak Terdaftar / tidak Valid.')
                res.redirect(303, '/user/dashboard')
            }
        }
        else {
            req.flash('info', 'Parameter Kategori Saweran tidak Ada.')
            res.redirect(303, '/user/dashboard')
        }
    } else {
        req.flash('info', 'Maaf, Anda harus Login.')
        res.redirect(303, '/')
    }
}

const detailSaweran = (req, res) => {

    if (req.session.user) {
        const id_user = req.session.user.user_id
        const kat = req.params.kat
        const id_transaksi = req.params.id_transaksi
        if (kat == "masuk") {
            let sqlTNUser = "SELECT * FROM transaksi_nyawers tn INNER JOIN users u ON tn.user_id_penerima = u.user_id INNER JOIN metode_pembayarans mp ON tn.metode_pembayaran_id = mp.id_mp WHERE u.user_id='" + id_user + "' and tn.id_transaksi='" + id_transaksi + "'";
            mysql.conn.query(sqlTNUser, (err, detailSaweranByID) => {
                if (err) throw err;
                if (detailSaweranByID.length === 1) {
                    res.render("user/detail_saweran", { user: req.session.user, detailSaweranByID, kat: "masuk" })
                }
                else {
                    req.flash('info', 'Maaf, Transaksi Nyawer ini tidak Ada.')
                    res.redirect(303, '/user/saweran/masuk')
                }
            })
        }
        else if (kat == "keluar") {
            let sqlTNUser = "SELECT * FROM transaksi_nyawers tn INNER JOIN users u ON tn.user_id_penerima = u.user_id INNER JOIN metode_pembayarans mp ON tn.metode_pembayaran_id = mp.id_mp WHERE tn.user_id_pengirim='" + id_user + "' and tn.id_transaksi='" + id_transaksi + "'";
            mysql.conn.query(sqlTNUser, (err, detailSaweranByID) => {
                if (err) throw err;
                if (detailSaweranByID.length === 1) {
                    res.render("user/detail_saweran", { user: req.session.user, detailSaweranByID, kat: "keluar" })
                }
                else {
                    req.flash('info', 'Maaf, Transaksi Nyawer ini tidak Ada.')
                    res.redirect(303, '/user/saweran/keluar')
                }
            })
        }
        else {
            req.flash('info', 'Maaf, Parameter tidak Diketahui.')
            res.redirect(303, '/user/dashboard')
        }
    }
    else {
        req.flash('info', 'Maaf, Anda harus Login.')
        res.redirect(303, '/')
    }


}

const doTarikSaldoUser = async (req, res) => {
    try {
        if (req.session.user) {
            const id_user = req.session.user.user_id
            const total_saldo = await totalSaldo(id_user);
            const dataBodyTarikSaldoUser = req.body.dataTarikSaldo
            User.findOne({ where: { user_id: id_user } })
                .then((userWD) => {
                    if (userWD) {
                        if (userWD.status_user == "Aktif") {
                            if (dataBodyTarikSaldoUser.nominal >= 10000) {
                                if (parseInt(total_saldo) >= parseInt(dataBodyTarikSaldoUser.nominal)) {
                                    const dataTarikSaldoUser = {
                                        id_dompet: Utils.generateID("", 8),
                                        id_user: userWD.user_id,
                                        reff_transaksi: Utils.generateID("WD-", 10),
                                        nama_transaksi: "Penarikan saldo",
                                        penyesuaian: "Debit",
                                        nominal: "-" + dataBodyTarikSaldoUser.nominal,
                                        waktu_transaksi_dompet: new Date().toISOString(),
                                        status_transaksi_dompet: "Pending"
                                    }
                                    Dompet.create(dataTarikSaldoUser)
                                        .then((createPenarikan) => {
                                            if (createPenarikan) {
                                                const statusPenarikanSaldo = "OK"
                                                res.json({ status: 200, error: null, statusPenarikanSaldo });
                                            }
                                        })
                                }
                                else {
                                    const statusPenarikanSaldo = "Saldo tidak Cukup."
                                    res.json({ status: 200, error: null, statusPenarikanSaldo });
                                }
                            }
                            else {
                                const statusPenarikanSaldo = "Minimal Penarikan Saldo Rp 10.000."
                                res.json({ status: 200, error: null, statusPenarikanSaldo });
                            }
                        }
                        else {
                            const statusPenarikanSaldo = "User tidak Aktif."
                            res.json({ status: 200, error: null, statusPenarikanSaldo });
                        }
                    }
                    else {
                        const statusPenarikanSaldo = "User tidak Terdaftar."
                        res.json({ status: 200, error: null, statusPenarikanSaldo });
                    }
                });

        }
        else {
            const statusPenarikanSaldo = "Anda harus Login dahulu."
            res.json({ status: 200, error: null, statusPenarikanSaldo });
        }
    }
    catch (error) {
        console.error(error)
    }
}


const dashboardDompet = async (req, res) => {

    try {
        if (req.session.user) {
            const id_user = req.session.user.user_id

            const Saldo = await totalSaldo(id_user);

            let sqlDompetUser = "SELECT * FROM dompets d INNER JOIN users u ON d.id_user = u.user_id  WHERE d.id_user='" + id_user + "'";
            mysql.conn.query(sqlDompetUser, (err, dompetUser) => {
                if (err) throw err;
                if (dompetUser) {
                    res.render("user/dompet", { user: req.session.user, dompetUser, Saldo })
                }
            })
        }
        else {
            req.flash('info', 'Maaf, Anda harus Login.')
            res.redirect(303, '/')
        }
    } catch (error) {
        console.error(error)
    }
}


const doLoginUser = (req, res) => {
    const dataBodyLogin = req.body.dataLogin
    // do Login User 1
    User.findOne({ where: { username: dataBodyLogin.username } }).then(user => {
        if (user) {

            // do Login User 2
            if (user.password == dataBodyLogin.password) {

                // do Login User 3 - Cek Status User
                if (user.status_user == "Aktif") {
                    // Login Sukses

                    req.session.user = user
                    const statusLogin = "OK"
                    // res.redirect('/');
                    res.json({ status: 200, error: null, user, statusLogin });
                }
                else {
                    // User tidak Aktif
                    const statusLogin = "User tidak Aktif"
                    res.json({ status: 200, error: null, statusLogin });
                }
            }
            else {
                // Password tidak Benar
                const statusLogin = "Username / Password tidak Benar"
                res.json({ status: 200, error: null, statusLogin });
            }
        }
        else {
            // Username tidak Terdaftar
            const statusLogin = "Username / Password tidak Benar"
            res.json({ status: 200, error: null, statusLogin });
        }
    })
}

const checkAndaUpdateNoTelp = (noTelp) => {
    if (noTelp.substring(0, 2) === "08") {
        noTelp = "628" + noTelp.substring(2);
        console.log("Nomor telepon baru: ", noTelp);
    } else {
        console.log("Nomor telepon tidak perlu diubah: ", noTelp);
    }

    return noTelp;

}
const doRegisterUser = (req, res) => {
    const dataBodyRegister = req.body.dataRegister

    console.log(checkAndaUpdateNoTelp(dataBodyRegister.no_telp));
    // do Register User 1
    User.findOne({ where: { username: dataBodyRegister.username } }).then(user => {
        if (!user) {

            User.findOne({ where: { email: dataBodyRegister.email } }).then(emailUser => {
                if (!emailUser) {
                    User.findOne({ where: { no_telp: checkAndaUpdateNoTelp(dataBodyRegister.no_telp) } }).then(noTelpUser => {
                        if (!noTelpUser) {
                            const dataRegister = {
                                user_id: Utils.generateID("", 4),
                                nama_user: dataBodyRegister.nama_user,
                                username: dataBodyRegister.username,
                                email: dataBodyRegister.email,
                                no_telp: checkAndaUpdateNoTelp(dataBodyRegister.no_telp),
                                password: dataBodyRegister.password,
                                status_user: "Aktif"
                            }

                            User.create(dataRegister).then((result) => {
                                if (result) {
                                    const statusRegister = "OK"
                                    res.json({ status: 200, error: null, dataRegister, statusRegister });
                                }
                            })
                        } else {
                            // No. Telp tidak Terdaftar
                            const statusRegister = "No. Telp sudah Terdaftar"
                            res.json({ status: 200, error: null, statusRegister });
                        }
                    })
                }
                else {
                    // Email tidak Terdaftar
                    const statusRegister = "Email sudah Terdaftar"
                    res.json({ status: 200, error: null, statusRegister });
                }
            })

        }
        else {
            // Username tidak Terdaftar
            const statusRegister = "Username sudah Terdaftar"
            res.json({ status: 200, error: null, statusRegister });
        }
    })
}

const logoutUser = (req, res) => {
    req.session.destroy(function (err) {
        if (err) {
            console.log(err);
            const statusLogoutUser = "Gagal"
            res.json({ status: 200, error: null, statusLogoutUser });
        } else {
            const statusLogoutUser = "OK"
            res.json({ status: 200, error: null, statusLogoutUser });
        }
    });
}

export default { userProfile, changeUserProfile, doChangeProfile, doLoginUser, doRegisterUser, logoutUser, dashboardUser, dashboardSaweran, dashboardDompet, doTarikSaldoUser, detailSaweran }
