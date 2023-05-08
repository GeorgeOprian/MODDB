import { Router } from "express";
import { Localitate } from '../models/localitate.js'
import { Judet } from "../models/judet.js";
import { Sequelize } from "sequelize";

const router = Router();

router.get('/', async (req, res) => {
  Localitate.findAll({
    raw: true,
    include: [Judet]
  })
    .then(records => {
      res.json(records)
    })
    .catch(err => res.status(500).json({ error: err.message }));
});

router.get('/:id', async (req, res) => {
  Localitate.findAll({
    where: { idLocalitate: req.params.id },
    raw: true
  })
    .then(record => {
      res.json(record)
    })
    .catch(err => res.status(500).json({ error: err.message }));
});

router.post('/', async (req, res, next) => {
  Localitate.create(req.body)
    .then((item) => {
      const result = item.dataValues;
      result.idLocalitate = item.idLocalitate;
      res.status(201).json(result);
    })
    .catch(next);
});

router.put('/:id', async (req, res, next) => {
  const id = req.params.id;
  Localitate.update(
    req.body,
    { where: { idLocalitate: id } }
  ).then((result) => {
    if (result[0]) res.json({ message: 'Record modified' });
    else res.status(404).json({ error: 'Record not found' });
  })
    .catch(next);
});

router.delete('/:id', (req, res, next) => {
  Localitate.destroy({
    where: { idLocalitate: req.params.id },
  })
    .then(affectedCount => {
      if (affectedCount) res.json({ message: 'Record deleted' });
      else res.status(404).json({ error: 'Record not found' });
    })
    .catch(err => res.status(500).json({ error: err.message }));
});

export { router as localitateRouter };