import { DataTypes, Model } from "sequelize";
import { SequelizeService } from "../../config/db.js";
import { LocalitateBucuresti } from "./localitateBucuresti.js";

export class AdresaBucuresti extends Model {
    idAdresa;
    strada;
    numar;
    bloc;
    scara;
    numarApartament;
    idLocalitate;
}

AdresaBucuresti.init(
  {
    idAdresa: {
      type: DataTypes.NUMBER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: true,
      field: "ID_ADRESA",
    },
    // idLocalitate: {
    //   type: DataTypes.NUMBER,
    //   allowNull: false,
    //   field: "ID_LOCALITATE",
    // },
    strada: {
      type: DataTypes.STRING(40),
      allowNull: true,
      field: "STRADA",
    },
    numar: {
      type: DataTypes.NUMBER,
      allowNull: true,
      field: "NUMAR",
    },
    bloc: {
      type: DataTypes.STRING(10),
      allowNull: true,
      field: "BLOC",
    },
    scara: {
      type: DataTypes.STRING(5),
      allowNull: true,
      field: "SCARA",
    },
    numarApartament: {
      type: DataTypes.NUMBER,
      allowNull: true,
      field: "NUMAR_APARTAMENT",
    }
  },
  {
    sequelize: SequelizeService.getModbdBucurestiInstance(),
    modelName: "AdresaBucuresti",
    tableName: "ADRESA_BUCURESTI",
    createdAt: false,
    updatedAt: false
  }
);

AdresaBucuresti.belongsTo(LocalitateBucuresti, { foreignKey: "ID_LOCALITATE" })