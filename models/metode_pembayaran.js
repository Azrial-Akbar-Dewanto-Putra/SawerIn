import { sequelize, DataTypes } from "./model.js";
const metode_pembayaran = sequelize.define('metode_pembayaran', {
    id_mp: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    nama_mp: DataTypes.STRING,
    biaya_mp: DataTypes.STRING,
    penyesuaian_biaya: DataTypes.STRING,
    publish: DataTypes.STRING,
    status_mp: DataTypes.STRING,
});

export default metode_pembayaran