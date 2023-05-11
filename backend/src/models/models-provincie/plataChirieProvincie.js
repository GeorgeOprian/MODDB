import { DataTypes, Model, Sequelize } from "sequelize";
import { SequelizeService } from "../../config/db.js";
import { ContractProvincie } from "./contractProvincie.js";

export class PlataChirieProvincie extends Model {
    idPlata;
    idContract
    luna;
    an;
    suma;
    dataEfectuarii;
    nrZileIntarziere;
}

PlataChirieProvincie.init(
  {
    idPlata: {
      type: DataTypes.NUMBER,
      primaryKey: true,
      allowNull: true,
      field: "ID_PLATA",
      defaultValue: Sequelize.literal('PROVINCIE_PLATA_CHIRIE_SEQ.NEXTVAL')
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
    sequelize: SequelizeService.getModbdProvincieInstance(),
    modelName: "PlataChirieProvincie",
    tableName: "PLATA_CHIRIE_PROVINCIE",
    createdAt: false,
    updatedAt: false
  }
);

PlataChirieProvincie.belongsTo(ContractProvincie, { foreignKey: "ID_CONTRACT" })