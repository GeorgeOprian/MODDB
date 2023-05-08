import { DataTypes, Model } from "sequelize";
import { SequelizeService } from "../../config/db.js";
import { ContractBucuresti } from "./contractBucuresti.js";

export class PlataChirieBucuresti extends Model {
    idPlata;
    idContract
    luna;
    an;
    suma;
    dataEfectuarii;
    nrZileIntarziere;
}

PlataChirieBucuresti.init(
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
    sequelize: SequelizeService.getModbdBucurestiInstance(),
    modelName: "PlataChirieBucuresti",
    tableName: "PLATA_CHIRIE_BUCURESTI",
    createdAt: false,
    updatedAt: false
  }
);

PlataChirieBucuresti.belongsTo(ContractBucuresti, { foreignKey: "ID_CONTRACT" })