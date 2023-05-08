import { DataTypes, Model } from "sequelize";
import { SequelizeService } from "../../config/db.js";

export class JudetProvincie extends Model {
    idJudet;
    nume;
}

JudetProvincie.init(
  {
    idJudet: {
      type: DataTypes.NUMBER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: true,
      field: "ID_JUDET",
    },
    nume: {
      type: DataTypes.STRING(25),
      allowNull: true,
      field: "NUME",
    }
  },
  {
    sequelize: SequelizeService.getModbdProvincieInstance(),
    modelName: "JudetProvincie",
    tableName: "JUDET_PROVINCIE",
    createdAt: false,
    updatedAt: false
  }
);