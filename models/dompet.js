import { sequelize, DataTypes } from "./model.js";
const dompet = sequelize.define('dompet', {
    id_dompet: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    id_user: DataTypes.STRING,
    reff_transaksi: DataTypes.STRING,
    nama_transaksi: DataTypes.STRING,
    penyesuaian: DataTypes.STRING,
    nominal: DataTypes.STRING,
    waktu_transaksi_dompet: DataTypes.STRING,
    status_transaksi_dompet: DataTypes.STRING,
});

export default dompet