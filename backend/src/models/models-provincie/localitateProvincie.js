import { DataTypes, Model } from "sequelize";
import { SequelizeService } from "../../config/db.js";
import { JudetProvincie } from "./judetProvincie.js";

export class LocalitateProvincie extends Model {
    idLocalitate;
    idJudet;
    nume;
}

LocalitateProvincie.init(
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
    sequelize: SequelizeService.getModbdProvincieInstance(),
    modelName: "LocalitateProvincie",
    tableName: "LOCALITATE_PROVINCIE",
    createdAt: false,
    updatedAt: false
  }
);

LocalitateProvincie.belongsTo(JudetProvincie, { foreignKey: "ID_JUDET" });