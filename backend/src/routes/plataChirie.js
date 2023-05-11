import { Router } from "express";
import { PlataChirie } from '../models/plataChirie.js'
import { Contract } from "../models/contract.js";
import { Apartament } from "../models/apartament.js";
import { Adresa } from "../models/adresa.js";
import { Localitate } from "../models/localitate.js";
import { Judet } from "../models/judet.js";
import { Chirias } from "../models/chirias.js";
import { SequelizeService } from "../config/db.js";

const router = Router();

let sequelize = SequelizeService.getModbbdNationalInstance();

router.get('/', async (req, res) => {
  PlataChirie.findAll({
    include: [
      {
        model: Contract,
        include: [
          {
            model: Apartament,
            include: [
              {
                model: Adresa,
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
              }
            ]
          },
          {
            model: Chirias
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
  PlataChirie.findAll({
    where: { idPlata: req.params.id },
  })
    .then(record => {
      res.json(record)
    })
    .catch(err => res.status(500).json({ error: err.message }));
});

router.post('/', async (req, res, next) => {
  let dataEfectuarii = `${new Date(req.body.dataEfectuarii).getFullYear()}-${new Date(req.body.dataEfectuarii).getMonth()}-${new Date(req.body.dataEfectuarii).getDate()}`;

  sequelize.query(`INSERT INTO oltp_plata_chirie (id_contract, luna, an, suma, data_efectuarii, nr_zile_intarziere) VALUES (${req.body.idContract}, ${req.body.luna}, ${req.body.an}, ${req.body.suma}, to_date('${dataEfectuarii}', 'YYYY-MM-DD'), ${req.body.nrZileIntarziere});`,
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
  PlataChirie.update(
    req.body,
    { where: { idPlata: id } }
  ).then((result) => {
    if (result[0]) res.json({ message: 'Record modified' });
    else res.status(404).json({ error: 'Record not found' });
  })
    .catch(next);
});

router.delete('/:id', (req, res, next) => {
  PlataChirie.destroy({
    where: { idPlata: req.params.id },
  })
    .then(affectedCount => {
      if (affectedCount) res.json({ message: 'Record deleted' });
      else res.status(404).json({ error: 'Record not found' });
    })
    .catch(err => res.status(500).json({ error: err.message }));
});

export { router as plataChirieRouter };