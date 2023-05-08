import { DataTypes, Model } from "sequelize";
import { SequelizeService } from "../config/db.js";

export class Chirias extends Model {
    idChirias;
    prenume;
    nume;
    telefon;
    email;
    sex;
    dataNastere;
    stareaCivila;
}

Chirias.init(
  {
    idChirias: {
      type: DataTypes.NUMBER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: true,
      field: "ID_CHIRIAS",
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
    sex: {
      type: DataTypes.STRING(1),
      allowNull: true,
      field: "SEX",
    },
    dataNastere: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "DATA_NASTERE",
    },
    stareaCivila: {
      type: DataTypes.STRING(20),
      allowNull: true,
      field: "STAREA_CIVILA",
    }
  },
  {
    sequelize: SequelizeService.getModbbdNationalInstance(),
    modelName: "Chirias",
    tableName: "OLTP_CHIRIAS",
    createdAt: false,
    updatedAt: false
  }
);