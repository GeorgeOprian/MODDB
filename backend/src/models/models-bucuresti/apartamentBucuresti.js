import { DataTypes, Model, Sequelize } from "sequelize";
import { SequelizeService } from "../../config/db.js";
import { AdresaBucuresti } from "./adresaBucuresti.js";

export class ApartamentBucuresti extends Model {
    idApartament;
    idAdresa;
    numarCamere;
    etaj;
    suprafata;
    centralaProprie;
    pretInchiriere;
    tipConfort;
}

ApartamentBucuresti.init(
  {
    idApartament: {
      type: DataTypes.NUMBER,
      primaryKey: true,
      allowNull: true,
      field: "ID_APARTAMENT",
      defaultValue: Sequelize.literal('BUCURESTI_APARTAMENT_SEQ.NEXTVAL')
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
    sequelize: SequelizeService.getModbdBucurestiInstance(),
    modelName: "ApartamentBucuresti",
    tableName: "APARTAMENT_BUCURESTI",
    createdAt: false,
    updatedAt: false
  }
);

ApartamentBucuresti.belongsTo(AdresaBucuresti, { foreignKey: 'ID_ADRESA' })