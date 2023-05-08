import { DataTypes, Model } from "sequelize";
import { SequelizeService } from "../config/db.js";
import { Chirias } from "./chirias.js";
import { Apartament } from "./apartament.js";
import { AgentImobiliar } from "./agentImobiliar.js";

export class Contract extends Model {
    idContract;
    idChirias;
    idApartament;
    idAgent;
    dataInceput;
    dataFinal;
    ziuaScandenta;
    pretInchiriere;
    valoareEstimata;
    incasari;
}

Contract.init(
  {
    idContract: {
      type: DataTypes.NUMBER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: true,
      field: "ID_CONTRACT",
    },
    // idChirias: {
    //   type: DataTypes.NUMBER,
    //   allowNull: false,
    //   field: "ID_CHIRIAS",
    // },
    // idApartament: {
    //   type: DataTypes.NUMBER,
    //   allowNull: false,
    //   field: "ID_APARTAMENT",
    // },
    // idAgent: {
    //   type: DataTypes.NUMBER,
    //   allowNull: false,
    //   field: "ID_AGENT",
    // },
    dataInceput: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "DATA_INCEPUT",
    },
    dataFinal: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "DATA_FINAL",
    },
    ziuaScandenta: {
      type: DataTypes.NUMBER,
      allowNull: true,
      field: "ZIUA_SCADENTA",
    },
    pretInchiriere: {
      type: DataTypes.NUMBER,
      allowNull: true,
      field: "PRET_INCHIRIERE",
    },
    valoareEstimata: {
      type: DataTypes.NUMBER,
      allowNull: true,
      field: "VALOARE_ESTIMATA",
    },
    incasari: {
      type: DataTypes.NUMBER,
      allowNull: true,
      field: "INCASARI",
    }
  },
  {
    sequelize: SequelizeService.getModbbdNationalInstance(),
    modelName: "Contract",
    tableName: "OLTP_CONTRACT",
    createdAt: false,
    updatedAt: false
  }
);

Contract.belongsTo(Chirias, { foreignKey: 'ID_CHIRIAS' })
Contract.belongsTo(Apartament, { foreignKey: 'ID_APARTAMENT' })
Contract.belongsTo(AgentImobiliar, { foreignKey: 'ID_AGENT' })