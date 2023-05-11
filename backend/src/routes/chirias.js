import { Router } from "express";
import { Chirias } from '../models/chirias.js'
import { SequelizeService } from "../config/db.js";

const router = Router();

let sequelize = SequelizeService.getModbbdNationalInstance();

router.get('/', async (req, res) => {
  Chirias.findAll({
   
  })
    .then(records => {
      res.json(records)
    })
    .catch(err => res.status(500).json({ error: err.message }));
});

router.get('/:id', async (req, res) => {
  Chirias.findAll({
    where: { idChirias: req.params.id },
   
  })
    .then(record => {
      res.json(record)
    })
    .catch(err => res.status(500).json({ error: err.message }));
});

router.post('/', async (req, res, next) => {
  let dataNastere = `${new Date(req.body.dataNastere).getFullYear()}-${new Date(req.body.dataNastere).getMonth()}-${new Date(req.body.dataNastere).getDate()}`;

  sequelize.query(`INSERT INTO OLTP_CHIRIAS (prenume, nume, email, telefon, sex, data_nastere, starea_civila) VALUES ('${req.body.prenume}', '${req.body.nume}', '${req.body.email}', '${req.body.telefon}', '${req.body.sex}', to_date('${dataNastere}', 'YYYY-MM-DD'), '${req.body.stareaCivila}');`,
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
  Chirias.update(
    req.body,
    { where: { idChirias: id } }
  ).then((result) => {
    if (result[0]) res.json({ message: 'Record modified' });
    else res.status(404).json({ error: 'Record not found' });
  })
    .catch(next);
});

router.delete('/:id', (req, res, next) => {
  Chirias.destroy({
    where: { idChirias: req.params.id },
  })
    .then(affectedCount => {
      if (affectedCount) res.json({ message: 'Record deleted' });
      else res.status(404).json({ error: 'Record not found' });
    })
    .catch(err => res.status(500).json({ error: err.message }));
});

export { router as chiriasRouter };