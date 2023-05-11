import { Router } from "express";
import { Sequelize } from "sequelize";
import { LocalitateBucuresti } from "../../models/models-bucuresti/localitateBucuresti.js";
import { JudetBucuresti } from "../../models/models-bucuresti/judetBucuresti.js";

const router = Router();

router.get('/', async (req, res) => {
  LocalitateBucuresti.findAll({
    include: [JudetBucuresti]
  })
    .then(records => {
      res.json(records)
    })
    .catch(err => res.status(500).json({ error: err.message }));
});

router.get('/:id', async (req, res) => {
  LocalitateBucuresti.findAll({
    where: { idLocalitate: req.params.id }
  })
    .then(record => {
      res.json(record)
    })
    .catch(err => res.status(500).json({ error: err.message }));
});

router.post('/', async (req, res, next) => {
  LocalitateBucuresti.create(req.body)
    .then((item) => {
      const result = item.dataValues;
      result.idLocalitate = item.idLocalitate;
      res.status(201).json(result);
    })
    .catch(next);
});

router.put('/:id', async (req, res, next) => {
  const id = req.params.id;
  LocalitateBucuresti.update(
    req.body,
    { where: { idLocalitate: id } }
  ).then((result) => {
    if (result[0]) res.json({ message: 'Record modified' });
    else res.status(404).json({ error: 'Record not found' });
  })
    .catch(next);
});

router.delete('/:id', (req, res, next) => {
  LocalitateBucuresti.destroy({
    where: { idLocalitate: req.params.id },
  })
    .then(affectedCount => {
      if (affectedCount) res.json({ message: 'Record deleted' });
      else res.status(404).json({ error: 'Record not found' });
    })
    .catch(err => res.status(500).json({ error: err.message }));
});

export { router as localitateBucurestiRouter };