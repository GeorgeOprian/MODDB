import { Router } from "express";
import { AgentImobiliarProvincie } from "../../models/models-provincie/agentImobiliarProvincie.js";

const router = Router();

router.get('/', async (req, res) => {
  AgentImobiliarProvincie.findAll({
  })
    .then(records => {
      res.json(records)
    })
    .catch(err => res.status(500).json({ error: err.message }));
});

router.get('/:id', async (req, res) => {
  AgentImobiliarProvincie.findAll({
    where: { idAgent: req.params.id }
  })
    .then(record => {
      res.json(record)
    })
    .catch(err => res.status(500).json({ error: err.message }));
});

router.post('/', async (req, res, next) => {
  AgentImobiliarProvincie.create(req.body)
    .then((item) => {
      const result = item.dataValues;
      result.idAgent = item.idAgent;
      res.status(201).json(result);
    })
    .catch(next);
});

router.put('/:id', async (req, res, next) => {
  const id = req.params.id;
  AgentImobiliarProvincie.update(
    req.body,
    { where: { idAgent: id } }
  ).then((result) => {
    if (result[0]) res.json({ message: 'Record modified' });
    else res.status(404).json({ error: 'Record not found' });
  })
    .catch(next);
});

router.delete('/:id', (req, res, next) => {
  AgentImobiliarProvincie.destroy({
    where: { idAgent: req.params.id },
  })
    .then(affectedCount => {
      if (affectedCount) res.json({ message: 'Record deleted' });
      else res.status(404).json({ error: 'Record not found' });
    })
    .catch(err => res.status(500).json({ error: err.message }));
});

export { router as agentImobiliarProvincieRouter };