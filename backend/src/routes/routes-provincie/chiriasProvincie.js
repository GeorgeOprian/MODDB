import { Router } from "express";
import { ChiriasProvincie } from "../../models/models-provincie/chiriasProvincie.js";

const router = Router();

router.get('/', async (req, res) => {
  ChiriasProvincie.findAll({
  })
    .then(records => {
      res.json(records)
    })
    .catch(err => res.status(500).json({ error: err.message }));
});

router.get('/:id', async (req, res) => {
  ChiriasProvincie.findAll({
    where: { idChirias: req.params.id },
  })
    .then(record => {
      res.json(record)
    })
    .catch(err => res.status(500).json({ error: err.message }));
});

router.post('/', async (req, res, next) => {
  ChiriasProvincie.create(req.body)
    .then((item) => {
      const result = item.dataValues;
      result.idChirias = item.idChirias;
      res.status(201).json(result);
    })
    .catch(next);
});

router.put('/:id', async (req, res, next) => {
  const id = req.params.id;
  ChiriasProvincie.update(
    req.body,
    { where: { idChirias: id } }
  ).then((result) => {
    if (result[0]) res.json({ message: 'Record modified' });
    else res.status(404).json({ error: 'Record not found' });
  })
    .catch(next);
});

router.delete('/:id', (req, res, next) => {
  ChiriasProvincie.destroy({
    where: { idChirias: req.params.id },
  })
    .then(affectedCount => {
      if (affectedCount) res.json({ message: 'Record deleted' });
      else res.status(404).json({ error: 'Record not found' });
    })
    .catch(err => res.status(500).json({ error: err.message }));
});

export { router as chiriasProvincieRouter };