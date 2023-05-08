import { DataTypes, Model } from "sequelize";
import { SequelizeService } from "../../config/db.js";
import { ChiriasProvincie } from "./chiriasProvincie.js";
import { ApartamentProvincie } from "./apartamentProvincie.js";
import { AgentImobiliarProvincie } from "./agentImobiliarProvincie.js";

export class ContractProvincie extends Model {
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

ContractProvincie.init(
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
    sequelize: SequelizeService.getModbdProvincieInstance(),
    modelName: "ContractProvincie",
    tableName: "CONTRACT_PROVINCIE",
    createdAt: false,
    updatedAt: false
  }
);

ContractProvincie.belongsTo(ChiriasProvincie, { foreignKey: 'ID_CHIRIAS' })
ContractProvincie.belongsTo(ApartamentProvincie, { foreignKey: 'ID_APARTAMENT' })
ContractProvincie.belongsTo(AgentImobiliarProvincie, { foreignKey: 'ID_AGENT' })