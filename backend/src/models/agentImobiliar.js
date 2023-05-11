import { DataTypes, Model, Sequelize } from "sequelize";
import { SequelizeService } from "../config/db.js";

export class AgentImobiliar extends Model {
    idAgent;
    prenume;
    nume;
    telefon;
    email;
    dataAngajare;
    salariu;
    comision;
}

AgentImobiliar.init(
  {
    idAgent: {
      type: DataTypes.NUMBER,
      primaryKey: true,
      allowNull: true,
      field: "ID_AGENT",
      defaultValue: Sequelize.literal('NATIONAL_AGENT_IMOBILIAR_SEQ.NEXTVAL')
    },
    prenume: {
      type: DataTypes.STRING(20),
      allowNull: true,
      field: "PRENUME",
    },
    nume: {
      type: DataTypes.STRING(20),
      allowNull: true,
      field: "NUME",
    },
    telefon: {
      type: DataTypes.STRING(20),
      allowNull: true,
      field: "TELEFON",
    },
    email: {
      type: DataTypes.STRING(30),
      allowNull: true,
      field: "EMAIL",
    },
    dataAngajare: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "DATA_ANGAJARE",
    },
    salariu: {
      type: DataTypes.NUMBER,
      allowNull: true,
      field: "SALARIU",
    },
    comision: {
      type: DataTypes.NUMBER,
      allowNull: true,
      field: "COMISION",
    }
  },
  {
    sequelize: SequelizeService.getModbbdNationalInstance(),
    modelName: "AgentImobiliar",
    tableName: "OLTP_AGENT_IMOBILIAR",
    createdAt: false,
    updatedAt: false
  }
);