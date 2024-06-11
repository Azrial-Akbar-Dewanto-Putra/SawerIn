import { sequelize, DataTypes } from "./model.js";
const users = sequelize.define('users', {
    user_id: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    nama_user: DataTypes.STRING,
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    no_telp: DataTypes.STRING,
    password: DataTypes.STRING,
    status_user: DataTypes.STRING

});
export default users