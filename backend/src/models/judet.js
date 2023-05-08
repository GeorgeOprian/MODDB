import { DataTypes, Model } from "sequelize";
import { SequelizeService } from "../config/db.js";

export class Judet extends Model {
    idJudet;
    nume;
}

Judet.init(
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
    sequelize: SequelizeService.getModbbdNationalInstance(),
    modelName: "Judet",
    tableName: "OLTP_JUDET",
    createdAt: false,
    updatedAt: false
  }
);