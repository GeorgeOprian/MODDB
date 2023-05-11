import { Router } from "express";
import { AgentImobiliarBucuresti } from "../../models/models-bucuresti/agentImobiliarBucuresti.js";

const router = Router();

router.get('/', async (req, res) => {
  AgentImobiliarBucuresti.findAll({
    
  })
    .then(records => {
      res.json(records)
    })
    .catch(err => res.status(500).json({ error: err.message }));
});

router.get('/:id', async (req, res) => {
  AgentImobiliarBucuresti.findAll({
    where: { idAgent: req.params.id },
    
  })
    .then(record => {
      res.json(record)
    })
    .catch(err => res.status(500).json({ error: err.message }));
});

router.post('/', async (req, res, next) => {
  AgentImobiliarBucuresti.create(req.body)
    .then((item) => {
      const result = item.dataValues;
      result.idAgent = item.idAgent;
      res.status(201).json(result);
    })
    .catch(next);
});

router.put('/:id', async (req, res, next) => {
  const id = req.params.id;
  AgentImobiliarBucuresti.update(
    req.body,
    { where: { idAgent: id } }
  ).then((result) => {
    if (result[0]) res.json({ message: 'Record modified' });
    else res.status(404).json({ error: 'Record not found' });
  })
    .catch(next);
});

router.delete('/:id', (req, res, next) => {
  AgentImobiliarBucuresti.destroy({
    where: { idAgent: req.params.id },
  })
    .then(affectedCount => {
      if (affectedCount) res.json({ message: 'Record deleted' });
      else res.status(404).json({ error: 'Record not found' });
    })
    .catch(err => res.status(500).json({ error: err.message }));
});

export { router as agentImobiliarBucurestiRouter };