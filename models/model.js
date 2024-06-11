import { Sequelize, DataTypes } from 'sequelize';
const sequelize = new Sequelize("nyawer_onlen", "root", "", {
    host: 'localhost',
    dialect: 'mysql'
});
export { sequelize, DataTypes };