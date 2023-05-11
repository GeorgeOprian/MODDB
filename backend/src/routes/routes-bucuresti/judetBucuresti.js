import { Router } from "express";
import { Judet } from '../../models/judet.js'
import { JudetBucuresti } from "../../models/models-bucuresti/judetBucuresti.js";

const router = Router();

router.get('/', async (req, res) => {
  JudetBucuresti.findAll({
  })
    .then(records => {
      res.json(records)
    })
    .catch(err => res.status(500).json({ error: err.message }));
});

router.get('/:id', async (req, res) => {
  JudetBucuresti.findAll({
    where: { idJudet: req.params.id },
  })
    .then(record => {
      res.json(record)
    })
    .catch(err => res.status(500).json({ error: err.message }));
});

router.post('/', async (req, res, next) => {
  JudetBucuresti.create(req.body)
    .then((item) => {
      const result = item.dataValues;
      result.idJudet = item.idJudet;
      res.status(201).json(result);
    })
    .catch(next);
});

router.put('/:id', async (req, res, next) => {
  const id = req.params.id;
  JudetBucuresti.update(
    req.body,
    { where: { idJudet: id } }
  ).then((result) => {
    if (result[0]) res.json({ message: 'Record modified' });
    else res.status(404).json({ error: 'Record not found' });
  })
    .catch(next);
});

router.delete('/:id', (req, res, next) => {
  JudetBucuresti.destroy({
    where: { idJudet: req.params.id },
  })
    .then(affectedCount => {
      if (affectedCount) res.json({ message: 'Record deleted' });
      else res.status(404).json({ error: 'Record not found' });
    })
    .catch(err => res.status(500).json({ error: err.message }));
});

export { router as judetBucurestiRouter };