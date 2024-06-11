import express from "express";
import bodyParser from "body-parser";

import session from "express-session";
import flash from "connect-flash";

const app = express();
const hostname = "127.0.0.1";
const port = 3030;

// Contollers
import user from './controllers/user.js'
import transaksi_nyawer from './controllers/transaksi_nyawer.js'
import payment_gateway from './controllers/payment_gateway.js'

import admin from './controllers/admin.js'


import page from './controllers/page.js'

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: 'ini adalah kode secret###',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60 * 60 * 1000 }, // 1 hour
  })
);

app.use(flash())


app.use((req, res, next) => {
  res.locals.message = req.flash();
  next();
});

app.use(express.static("public"));

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render('index', { user: req.session.user });
});

app.get('/penerima', page.penerima);

app.get('/:uname', transaksi_nyawer.nyawerUser);

app.post('/doNyaweruser', transaksi_nyawer.doNyawerUser);

app.get('/bayar/:id_transaksi', transaksi_nyawer.bayarNyawerUser);

app.post('/cekTransaksiNyawer', transaksi_nyawer.cekTransaksiNyawer);


// Dashboard User
// Dashboard
app.get('/user/dashboard', user.dashboardUser)
app.get('/user/saweran/:kategori', user.dashboardSaweran)

app.get('/user/saweran/:kat/:id_transaksi', user.detailSaweran)


app.get('/user/dompet', user.dashboardDompet)
app.post('/user/doTarikSaldoUser', user.doTarikSaldoUser)

app.get('/user/profile', user.userProfile)
app.get('/user/profile/change', user.changeUserProfile)
app.post('/user/profile/doChangeProfile', user.doChangeProfile)




// Auth 
// Login User
app.post('/auth/doLoginUser', user.doLoginUser);

// Regsiter User
app.post('/auth/doRegisterUser', user.doRegisterUser);

// Logout User
app.post('/auth/logoutUser', user.logoutUser);


// Payment Gateway
// Redirect
app.get('/rd/:id_transaksi', payment_gateway.redirect);


// Admin
// Dashboard Admin
app.get("/admin/dashboard", admin.dashboardAdmin)

app.get("/admin/transaksi_nyawer", admin.transaksi_nyawer)
app.get("/admin/transaksi_nyawer/:id_transaksi", admin.transaksi_nyawer_by_id)
app.post("/admin/transaksi_nyawer/cek_transaksi_nyawer", admin.cek_transaksi_nyawer)

app.get("/admin/user", admin.data_user)
app.get("/admin/user/:username", admin.data_user_by_uname)

app.post("/admin/user/doUpdateUser", admin.doUpdateUser)

// Dompet
app.get("/admin/dompet", admin.dompet)
app.get("/admin/dompet/:id_dompet", admin.dompet_by_id)

// app.post("/admin/dompet/doUpdateMP", admin.doUpdateDompet)

// Penarikan
app.get("/admin/penarikan", admin.penarikan)
app.get("/admin/penarikan/:id_penarikan", admin.penarikan_by_id)
app.post("/admin/penarikan/doUpdatePenarikan", admin.doUpdatePenarikan)


// Metode Pembayaran
app.get("/admin/metode_pembayaran", admin.metode_pembayaran)
app.get("/admin/metode_pembayaran/:id_metode_pembayaran", admin.metode_pembayaran_by_id)

app.post("/admin/metode_pembayaran/doUpdateMP", admin.doUpdateMP)


// Login Admin
app.get("/auth/admin/login", admin.loginAdmin)
app.post("/auth/admin/doLoginAdmin", admin.doLoginAdmin)
app.get("/auth/admin/logout", admin.dologout)

app.listen(port, () => {
  console.log(`Server running at ${hostname}:${port}`);
});
