import { Router } from "express";
import { PlataChirieBucuresti } from "../../models/models-bucuresti/plataChirieBucuresti.js";
import { ContractBucuresti } from "../../models/models-bucuresti/contractBucuresti.js";
import { ApartamentBucuresti } from "../../models/models-bucuresti/apartamentBucuresti.js";
import { AdresaBucuresti } from "../../models/models-bucuresti/adresaBucuresti.js";
import { LocalitateBucuresti } from "../../models/models-bucuresti/localitateBucuresti.js";
import { JudetBucuresti } from "../../models/models-bucuresti/judetBucuresti.js";
import { ChiriasBucuresti } from "../../models/models-bucuresti/chiriasBucuresti.js";

const router = Router();

router.get('/', async (req, res) => {
  PlataChirieBucuresti.findAll({
    include: [
      {
        model: ContractBucuresti,
        include: [
          {
            model: ApartamentBucuresti,
            include: [
              {
                model: AdresaBucuresti,
                include: [
                  {
                    model: LocalitateBucuresti,
                    include: [
                      {
                        model: JudetBucuresti
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            model: ChiriasBucuresti
          }
        ]
      }
    ]
  })
    .then(records => {
      res.json(records)
    })
    .catch(err => res.status(500).json({ error: err.message }));
});

router.get('/:id', async (req, res) => {
  PlataChirie.findAll({
    where: { idPlata: req.params.id },
    raw: true
  })
    .then(record => {
      res.json(record)
    })
    .catch(err => res.status(500).json({ error: err.message }));
});

router.post('/', async (req, res, next) => {
  PlataChirie.create(req.body)
    .then((item) => {
      const result = item.dataValues;
      result.idPlata = item.idPlata;
      res.status(201).json(result);
    })
    .catch(next);
});

router.put('/:id', async (req, res, next) => {
  const id = req.params.id;
  PlataChirie.update(
    req.body,
    { where: { idPlata: id } }
  ).then((result) => {
    if (result[0]) res.json({ message: 'Record modified' });
    else res.status(404).json({ error: 'Record not found' });
  })
    .catch(next);
});

router.delete('/:id', (req, res, next) => {
  PlataChirie.destroy({
    where: { idPlata: req.params.id },
  })
    .then(affectedCount => {
      if (affectedCount) res.json({ message: 'Record deleted' });
      else res.status(404).json({ error: 'Record not found' });
    })
    .catch(err => res.status(500).json({ error: err.message }));
});

export { router as plataChirieBucurestiRouter };