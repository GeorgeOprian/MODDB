import { DataTypes, Model } from "sequelize";
import { SequelizeService } from "../config/db.js";
import { Judet } from "./judet.js";

export class Localitate extends Model {
    idLocalitate;
    idJudet;
    nume;
}

Localitate.init(
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
    sequelize: SequelizeService.getModbbdNationalInstance(),
    modelName: "Localitate",
    tableName: "OLTP_LOCALITATE",
    createdAt: false,
    updatedAt: false
  }
);

Localitate.belongsTo(Judet, { foreignKey: "ID_JUDET" });