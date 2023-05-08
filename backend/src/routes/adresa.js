import { Router } from "express";
import { Adresa } from '../models/adresa.js'
import { Localitate } from "../models/localitate.js";
import { Judet } from "../models/judet.js";
import { AdresaBucuresti } from "../models/models-bucuresti/adresaBucuresti.js";

const router = Router();

router.get('/', async (req, res) => {
  Adresa.findAll({
    raw: true,
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
    raw: true
  })
    .then(record => {
      res.json(record)
    })
    .catch(err => res.status(500).json({ error: err.message }));
});

router.post('/', async (req, res, next) => {
  Adresa.create(req.body)
    .then((item) => {
      const result = item.dataValues;
      result.idAdresa = item.idAdresa;
      res.status(201).json(result);
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

router.delete('/:id', (req, res, next) => {
  Adresa.destroy({
    where: { idAdresa: req.params.id },
  })
    .then(affectedCount => {
      if (affectedCount) res.json({ message: 'Record deleted' });
      else res.status(404).json({ error: 'Record not found' });
    })
    .catch(err => res.status(500).json({ error: err.message }));
});


export { router as adresaRouter };