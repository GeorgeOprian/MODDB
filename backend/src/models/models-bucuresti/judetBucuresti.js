import { DataTypes, Model } from "sequelize";
import { SequelizeService } from "../../config/db.js";

export class JudetBucuresti extends Model {
    idJudet;
    nume;
}

JudetBucuresti.init(
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
    sequelize: SequelizeService.getModbdBucurestiInstance(),
    modelName: "JudetBucuresti",
    tableName: "JUDET_BUCURESTI",
    createdAt: false,
    updatedAt: false
  }
);