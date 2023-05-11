import { Router } from "express";
import { Adresa } from '../models/adresa.js'
import { Localitate } from "../models/localitate.js";
import { Judet } from "../models/judet.js";
import { AdresaBucuresti } from "../models/models-bucuresti/adresaBucuresti.js";
import { Apartament } from "../models/apartament.js";
import { Op, Sequelize } from "sequelize";
import { SequelizeService } from "../config/db.js";
import { Contract } from "../models/contract.js";
import { PlataChirie } from "../models/plataChirie.js";

let sequelize = SequelizeService.getModbbdNationalInstance();

const router = Router();

router.get('/', async (req, res) => {
  Adresa.findAll({
    include: [
      {
        model: Localitate,
        include: [
          {
            model: Judet
          }
        ]
      }
    ]
  })
    .then(records => {
      res.json(records)
    })
    .catch(err => res.status(500).json({ error: err.message }));
});

router.get('/:id', async (req, res) => {
  Adresa.findAll({
    where: { idAdresa: req.params.id },
  })
    .then(record => {
      res.json(record)
    })
    .catch(err => res.status(500).json({ error: err.message }));
});

router.post('/', async (req, res, next) => {
  sequelize.query(`INSERT INTO OLTP_ADRESA (STRADA, NUMAR, BLOC, SCARA, NUMAR_APARTAMENT, ID_LOCALITATE) VALUES ('${req.body.strada}', ${req.body.numar}, '${req.body.bloc}', '${req.body.scara}', ${req.body.numarApartament}, ${req.body.ID_LOCALITATE});`,
  {
    type: sequelize.QueryTypes.INSERT,
    
  })
  .then((item) => {
      res.status(201).json(item);
    })
    .catch(next);
});

router.put('/:id', async (req, res, next) => {
  const id = req.params.id;
  Adresa.update(
    req.body,
    { where: { idAdresa: id } }
  ).then((result) => {
    if (result[0]) res.json({ message: 'Record modified' });
    else res.status(404).json({ error: 'Record not found' });
  })
    .catch(next);
});

router.delete('/:id', async (req, res, next) => {
  await sequelize.transaction(async (t) => {

    try {
      let apartament = await Apartament.findOne({ 
        where: {
          ID_ADRESA: req.params.id
        },
        transaction: t  
      })
  
      let contracts = await Contract.findAll({
        where: {
          ID_APARTAMENT: apartament.dataValues.idApartament
        },
        transaction: t  
      })
  
      let contractsIds = contracts.map(m => m.dataValues.idContract);
      
      await PlataChirie.destroy({
        where: {
          ID_CONTRACT: {
            [Op.in]: contractsIds
          }
        },
        transaction: t
      })
  
      await Contract.destroy({
        where: {
          ID_APARTAMENT: apartament.dataValues.idApartament
        },
        transaction: t
      })
  
      await Apartament.destroy({
        where: {
          ID_ADRESA: req.params.id
        },
        transaction: t
      });
    
      await Adresa.destroy({
        where: { idAdresa: req.params.id },
        transaction: t
      })
      
      res.json({ message: 'Record deleted' });

    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  });

});


export { router as adresaRouter };