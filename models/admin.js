import { sequelize, DataTypes } from "./model.js";
const admin = sequelize.define('admin', {
    id_admin: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    username_admin: DataTypes.STRING,
    nama_admin: DataTypes.STRING,
    email_admin: DataTypes.STRING,
    password_admin: DataTypes.STRING,
    status_admin: DataTypes.STRING
});

export default admin