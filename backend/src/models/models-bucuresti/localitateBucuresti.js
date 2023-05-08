import { DataTypes, Model } from "sequelize";
import { SequelizeService } from "../../config/db.js";
import { JudetBucuresti } from "./judetBucuresti.js";

export class LocalitateBucuresti extends Model {
    idLocalitate;
    idJudet;
    nume;
}

LocalitateBucuresti.init(
  {
    idLocalitate: {
      type: DataTypes.NUMBER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: true,
      field: "ID_LOCALITATE",
    },
    // idJudet: {
    //   type: DataTypes.NUMBER,
    //   allowNull: false,
    //   references: {
    //     model: "Judet",
    //     key: "ID_JUDET"
    //   },
    // },
    nume: {
      type: DataTypes.STRING(25),
      allowNull: false,
      field: "NUME",
    }
  },
  {
    sequelize: SequelizeService.getModbdBucurestiInstance(),
    modelName: "LocalitateBucuresti",
    tableName: "LOCALITATE_BUCURESTI",
    createdAt: false,
    updatedAt: false
  }
);

LocalitateBucuresti.belongsTo(JudetBucuresti, { foreignKey: "ID_JUDET" });