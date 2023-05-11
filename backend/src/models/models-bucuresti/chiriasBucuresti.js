import { DataTypes, Model, Sequelize } from "sequelize";
import { SequelizeService } from "../../config/db.js";

export class ChiriasBucuresti extends Model {
    idChirias;
    prenume;
    nume;
    telefon;
    email;
    sex;
    dataNastere;
    stareaCivila;
}

ChiriasBucuresti.init(
  {
    idChirias: {
      type: DataTypes.NUMBER,
      primaryKey: true,
      allowNull: true,
      field: "ID_CHIRIAS",
      defaultValue: Sequelize.literal('BUCURESTI_CHIRIAS_SEQ.NEXTVAL')
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
    sequelize: SequelizeService.getModbdBucurestiInstance(),
    modelName: "ChiriasBucuresti",
    tableName: "CHIRIAS",
    createdAt: false,
    updatedAt: false
  }
);