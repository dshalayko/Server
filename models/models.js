const sequelize = require("../db");
const { DataTypes } = require("sequelize");

const User = sequelize.define("user", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  telephone_number: {
    type: DataTypes.STRING,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
  },
  telegram_user_id: {
    type: DataTypes.STRING,
    unique: false,
  },
  verification: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  file_name: {
    type: DataTypes.STRING,
    unique: false,
  },
  src: {
    type: DataTypes.STRING(1234),
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING,
    defaultValue: "USER",
  },
});

const Catalog = sequelize.define("catalog", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    unique: false,
  },
  img: {
    type: DataTypes.STRING(1234),
    allowNull: false,
  },
  src: {
    type: DataTypes.STRING(1234),
    allowNull: false,
  },
  fileName: {
    type: DataTypes.STRING(1234),
    allowNull: false,
  },
  thumbnail: {
    type: DataTypes.STRING(1234),
    allowNull: false,
  },
});

const Goods = sequelize.define("goods", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  addTime: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  catalog_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
  },

  price: {
    type: DataTypes.STRING(1234567),
    defaultValue: "[]",
    unique: false,
    get: function () {
      return JSON.parse(JSON.parse(this.getDataValue("price")));
    },
    set: function (val) {
      return this.setDataValue("price", JSON.stringify(val));
    },
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  src: {
    type: DataTypes.STRING(1234),
    allowNull: false,
  },
  fileName: {
    type: DataTypes.STRING(1234),
    allowNull: false,
  },
  thumbnail: {
    type: DataTypes.STRING(1234),
    allowNull: false,
  },
});

const Orders = sequelize.define("orders", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  add_time: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  user_ID: {
    type: DataTypes.STRING,
    unique: false,
    allowNull: false,
  },
  manager_ID: {
    type: DataTypes.STRING,
    unique: false,
    allowNull: false,
  },
  manager_Telegramm_ID: {
    type: DataTypes.STRING,
    unique: false,
    allowNull: false,
  },
  product_list: {
    type: DataTypes.STRING(1234567),
    defaultValue: "[]",
    unique: false,
    get: function () {
      return JSON.parse(this.getDataValue("product_list"));
    },
    set: function (val) {
      return this.setDataValue("product_list", JSON.stringify(val));
    },
  },
  order_status: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: true,
    unique: false,
  },
});

const Managers = sequelize.define("managers", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  telephone_number: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  telegram_user_id: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  order_list: {
    defaultValue: "[]",
    allowNull: false,
    type: DataTypes.STRING(1234567),
    get: function () {
      return JSON.parse(this.getDataValue("order_list"));
    },
    set: function (val) {
      return this.setDataValue("order_list", JSON.stringify(val));
    },
  },
  order_queue: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false,
  },
});

module.exports = {
  User,
  Catalog,
  Goods,
  Orders,
  Managers,
};
