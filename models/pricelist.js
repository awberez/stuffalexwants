module.exports = function(sequelize, DataTypes) {
  let PriceList = sequelize.define("PriceList", {
    id: {type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey:true
    },
    key: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true
    },
    name: {type: DataTypes.STRING,
        allowNull: false,
    },
    price: {type: DataTypes.FLOAT,
        allowNull: false,
    },
    no_price: {type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  });
  return PriceList;
};