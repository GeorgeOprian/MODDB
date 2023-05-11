import { Router } from "express";
import { LocalitateProvincie } from "../../models/models-provincie/localitateProvincie.js";
import { JudetProvincie } from "../../models/models-provincie/judetProvincie.js";

const router = Router();

router.get('/', async (req, res) => {
  LocalitateProvincie.findAll({
    include: [JudetProvincie]
  })
    .then(records => {
      res.json(records)
    })
    .catch(err => res.status(500).json({ error: err.message }));
});

router.get('/:id', async (req, res) => {
  LocalitateProvincie.findAll({
    where: { idLocalitate: req.params.id },
  })
    .then(record => {
      res.json(record)
    })
    .catch(err => res.status(500).json({ error: err.message }));
});

router.post('/', async (req, res, next) => {
  LocalitateProvincie.create(req.body)
    .then((item) => {
      const result = item.dataValues;
      result.idLocalitate = item.idLocalitate;
      res.status(201).json(result);
    })
    .catch(next);
});

router.put('/:id', async (req, res, next) => {
  const id = req.params.id;
  LocalitateProvincie.update(
    req.body,
    { where: { idLocalitate: id } }
  ).then((result) => {
    if (result[0]) res.json({ message: 'Record modified' });
    else res.status(404).json({ error: 'Record not found' });
  })
    .catch(next);
});

router.delete('/:id', (req, res, next) => {
  LocalitateProvincie.destroy({
    where: { idLocalitate: req.params.id },
  })
    .then(affectedCount => {
      if (affectedCount) res.json({ message: 'Record deleted' });
      else res.status(404).json({ error: 'Record not found' });
    })
    .catch(err => res.status(500).json({ error: err.message }));
});

export { router as localitateProvincieRouter };