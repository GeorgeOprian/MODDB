import { DataTypes, Model } from "sequelize";
import { SequelizeService } from "../config/db.js";
import { Adresa } from "./adresa.js";

export class Apartament extends Model {
    idApartament;
    idAdresa;
    numarCamere;
    etaj;
    suprafata;
    centralaProprie;
    pretInchiriere;
    tipConfort;
}

Apartament.init(
  {
    idApartament: {
      type: DataTypes.NUMBER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: true,
      field: "ID_APARTAMENT",
    },
    // idAdresa: {
    //   type: DataTypes.NUMBER,
    //   allowNull: false,
    //   field: "ID_ADRESA",
    // },
    numarCamere: {
      type: DataTypes.NUMBER,
      allowNull: true,
      field: "NUMAR_CAMERE",
    },
    etaj: {
      type: DataTypes.STRING(1),
      allowNull: false,
      field: "ETAJ",
    },
    suprafata: {
      type: DataTypes.NUMBER,
      allowNull: true,
      field: "SUPRAFATA",
    },
    centralaProprie: {
      type: DataTypes.STRING(1),
      allowNull: false,
      field: "CENTRALA_PROPRIE",
    },
    pretInchiriere: {
      type: DataTypes.NUMBER,
      allowNull: true,
      field: "PRET_INCHIRIERE",
    },
    tipConfort: {
      type: DataTypes.NUMBER,
      allowNull: true,
      field: "TIP_CONFORT",
    }
  },
  {
    sequelize: SequelizeService.getModbbdNationalInstance(),
    modelName: "Apartament",
    tableName: "OLTP_APARTAMENT",
    createdAt: false,
    updatedAt: false
  }
);

Apartament.belongsTo(Adresa, { foreignKey: 'ID_ADRESA' })