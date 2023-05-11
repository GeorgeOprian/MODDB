import { Router } from "express";
import { ChiriasBucuresti } from "../../models/models-bucuresti/chiriasBucuresti.js";

const router = Router();

router.get('/', async (req, res) => {
  ChiriasBucuresti.findAll({
  })
    .then(records => {
      res.json(records)
    })
    .catch(err => res.status(500).json({ error: err.message }));
});

router.get('/:id', async (req, res) => {
  ChiriasBucuresti.findAll({
    where: { idChirias: req.params.id },
  })
    .then(record => {
      res.json(record)
    })
    .catch(err => res.status(500).json({ error: err.message }));
});

router.post('/', async (req, res, next) => {
  ChiriasBucuresti.create(req.body)
    .then((item) => {
      const result = item.dataValues;
      result.idChirias = item.idChirias;
      res.status(201).json(result);
    })
    .catch(next);
});

router.put('/:id', async (req, res, next) => {
  const id = req.params.id;
  ChiriasBucuresti.update(
    req.body,
    { where: { idChirias: id } }
  ).then((result) => {
    if (result[0]) res.json({ message: 'Record modified' });
    else res.status(404).json({ error: 'Record not found' });
  })
    .catch(next);
});

router.delete('/:id', (req, res, next) => {
  ChiriasBucuresti.destroy({
    where: { idChirias: req.params.id },
  })
    .then(affectedCount => {
      if (affectedCount) res.json({ message: 'Record deleted' });
      else res.status(404).json({ error: 'Record not found' });
    })
    .catch(err => res.status(500).json({ error: err.message }));
});

export { router as chiriasBucurestiRouter };