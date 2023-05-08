import { DataTypes, Model } from "sequelize";
import { SequelizeService } from "../config/db.js";
import { Contract } from "./contract.js";

export class PlataChirie extends Model {
    idPlata;
    idContract
    luna;
    an;
    suma;
    dataEfectuarii;
    nrZileIntarziere;
}

PlataChirie.init(
  {
    idPlata: {
      type: DataTypes.NUMBER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: true,
      field: "ID_PLATA",
    },
    // idContract: {
    //   type: DataTypes.NUMBER,
    //   allowNull: false,
    //   field: "ID_CONTRACT",
    // },
    luna: {
      type: DataTypes.NUMBER,
      allowNull: true,
      field: "LUNA",
    },
    an: {
      type: DataTypes.NUMBER,
      allowNull: true,
      field: "AN",
    },
    suma: {
      type: DataTypes.NUMBER,
      allowNull: true,
      field: "SUMA",
    },
    dataEfectuarii: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "DATA_EFECTUARII",
    },
    nrZileIntarziere: {
      type: DataTypes.NUMBER,
      allowNull: true,
      field: "NR_ZILE_INTARZIERE",
    },
  },
  {
    sequelize: SequelizeService.getModbbdNationalInstance(),
    modelName: "PlataChirie",
    tableName: "OLTP_PLATA_CHIRIE",
    createdAt: false,
    updatedAt: false
  }
);

PlataChirie.belongsTo(Contract, { foreignKey: "ID_CONTRACT" })