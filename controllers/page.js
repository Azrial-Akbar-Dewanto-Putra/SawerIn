import Users from '../models/user.js';

import Utils from '../controllers/utils.js';


import connMysql from '../models/model_mysql.js';
const penerima = (req, res) => {
    if (req.session.user) {
        var sqlGetPenerima = "SELECT * FROM users WHERE user_id != 'tamu' and user_id != '" + req.session.user.user_id + "'";
    } else {
        var sqlGetPenerima = "SELECT * FROM users WHERE user_id != 'tamu' "
    }
    connMysql.conn.query(sqlGetPenerima, (err, dataPenerima) => {
        if (dataPenerima) {
            res.render("page/penerima", { user: req.session.user, dataPenerima })
        }
    })
}

export default { penerima }