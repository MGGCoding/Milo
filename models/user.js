const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'database.sqlite'
});

const User = sequelize.define('User', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    bench: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    deadlift: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    squat: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    imagePath: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'logo.png'
    },
    clicks: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
});

sequelize.sync();

module.exports = User;
