import { DataTypes, Model, Sequelize } from "sequelize";
import { SequelizeService } from "../../config/db.js";
import { ChiriasBucuresti } from "./chiriasBucuresti.js";
import { ApartamentBucuresti } from "./apartamentBucuresti.js";
import { AgentImobiliarBucuresti } from "./agentImobiliarBucuresti.js";

export class ContractBucuresti extends Model {
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

ContractBucuresti.init(
  {
    idContract: {
      type: DataTypes.NUMBER,
      primaryKey: true,
      allowNull: true,
      field: "ID_CONTRACT",
      defaultValue: Sequelize.literal('BUCURESTI_CONTRACT_SEQ.NEXTVAL')
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
    sequelize: SequelizeService.getModbdBucurestiInstance(),
    modelName: "ContractBucuresti",
    tableName: "CONTRACT_BUCURESTI",
    createdAt: false,
    updatedAt: false
  }
);

ContractBucuresti.belongsTo(ChiriasBucuresti, { foreignKey: 'ID_CHIRIAS' })
ContractBucuresti.belongsTo(ApartamentBucuresti, { foreignKey: 'ID_APARTAMENT' })
ContractBucuresti.belongsTo(AgentImobiliarBucuresti, { foreignKey: 'ID_AGENT' })