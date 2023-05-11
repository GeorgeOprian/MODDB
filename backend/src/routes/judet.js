import { Router } from "express";
import { Judet } from '../models/judet.js'

const router = Router();

router.get('/', async (req, res) => {
  Judet.findAll({
    
  })
    .then(records => {
      res.json(records)
    })
    .catch(err => res.status(500).json({ error: err.message }));
});

router.get('/:id', async (req, res) => {
  Judet.findAll({
    where: { idJudet: req.params.id },
    
  })
    .then(record => {
      res.json(record)
    })
    .catch(err => res.status(500).json({ error: err.message }));
});

router.post('/', async (req, res, next) => {
  Judet.create(req.body)
    .then((item) => {
      const result = item.dataValues;
      result.idJudet = item.idJudet;
      res.status(201).json(result);
    })
    .catch(next);
});

router.put('/:id', async (req, res, next) => {
  const id = req.params.id;
  Judet.update(
    req.body,
    { where: { idJudet: id } }
  ).then((result) => {
    if (result[0]) res.json({ message: 'Record modified' });
    else res.status(404).json({ error: 'Record not found' });
  })
    .catch(next);
});

router.delete('/:id', (req, res, next) => {
  Judet.destroy({
    where: { idJudet: req.params.id },
  })
    .then(affectedCount => {
      if (affectedCount) res.json({ message: 'Record deleted' });
      else res.status(404).json({ error: 'Record not found' });
    })
    .catch(err => res.status(500).json({ error: err.message }));
});

export { router as judetRouter };