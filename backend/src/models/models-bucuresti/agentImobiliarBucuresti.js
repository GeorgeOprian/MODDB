import { DataTypes, Model } from "sequelize";
import { SequelizeService } from "../../config/db.js";

export class AgentImobiliarBucuresti extends Model {
    idAgent;
    prenume;
    nume;
    telefon;
    email;
    dataAngajare;
    salariu;
    comision;
}

AgentImobiliarBucuresti.init(
  {
    idAgent: {
      type: DataTypes.NUMBER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: true,
      field: "ID_AGENT",
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
    }
  },
  {
    sequelize: SequelizeService.getModbdBucurestiInstance(),
    modelName: "AgentImobiliarBucuresti",
    tableName: "AGENT_IMOBILIAR_BUCURESTI",
    createdAt: false,
    updatedAt: false
  }
);