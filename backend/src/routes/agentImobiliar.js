import { Router } from "express";
import { AgentImobiliar } from '../models/agentImobiliar.js'
import { SequelizeService } from "../config/db.js";

const router = Router();

let sequelize = SequelizeService.getModbbdNationalInstance();

router.get('/', async (req, res) => {
  AgentImobiliar.findAll({
  })
    .then(records => {
      res.json(records)
    })
    .catch(err => res.status(500).json({ error: err.message }));
});

router.get('/:id', async (req, res) => {
  AgentImobiliar.findAll({
    where: { idAgent: req.params.id },
  })
    .then(record => {
      res.json(record)
    })
    .catch(err => res.status(500).json({ error: err.message }));
});

router.post('/', async (req, res, next) => {

  let dataAngajare = `${new Date(req.body.dataAngajare).getFullYear()}-${new Date(req.body.dataAngajare).getMonth()}-${new Date(req.body.dataAngajare).getDate()}`;

  sequelize.query(`INSERT INTO OLTP_AGENT_IMOBILIAR (prenume, nume, email, telefon, data_angajare, salariu, comision) VALUES ('${req.body.prenume}', '${req.body.nume}', '${req.body.email}', '${req.body.telefon}', to_date('${dataAngajare}', 'YYYY-MM-DD'), ${req.body.salariu}, ${req.body.comision});`,
  {
    type: sequelize.QueryTypes.INSERT,
    
  })
  .then((item) => {
      res.status(201).json(item);
    })
    .catch(next);
});

router.put('/:id', async (req, res, next) => {
  const id = req.params.id;
  AgentImobiliar.update(
    req.body,
    { where: { idAgent: id } }
  ).then((result) => {
    if (result[0]) res.json({ message: 'Record modified' });
    else res.status(404).json({ error: 'Record not found' });
  })
    .catch(next);
});

router.delete('/:id', (req, res, next) => {
  AgentImobiliar.destroy({
    where: { idAgent: req.params.id },
  })
    .then(affectedCount => {
      if (affectedCount) res.json({ message: 'Record deleted' });
      else res.status(404).json({ error: 'Record not found' });
    })
    .catch(err => res.status(500).json({ error: err.message }));
});

export { router as agentImobiliarRouter };