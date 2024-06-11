import { sequelize, DataTypes } from "./model.js";
const transaksi_nyawer = sequelize.define('transaksi_nyawer', {
    id_transaksi: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    reff_pg: DataTypes.STRING,
    nama_pengirim: DataTypes.STRING,
    user_id_pengirim: DataTypes.STRING,
    email_pengirim: DataTypes.STRING,
    user_id_penerima: DataTypes.STRING,
    nominal: DataTypes.INTEGER,
    pesan_pengirim: DataTypes.STRING,
    biaya_admin: DataTypes.INTEGER,
    total_terima: DataTypes.INTEGER,
    metode_pembayaran_id: DataTypes.STRING,
    link_bayar: DataTypes.STRING,
    waktu_transaksi: DataTypes.STRING,
    status_transaksi: DataTypes.STRING
});
export default transaksi_nyawer