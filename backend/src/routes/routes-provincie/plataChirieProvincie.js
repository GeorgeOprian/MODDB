import { Router } from "express";
import { PlataChirieProvincie } from "../../models/models-provincie/plataChirieProvincie.js";
import { ContractProvincie } from "../../models/models-provincie/contractProvincie.js";
import { ApartamentProvincie } from "../../models/models-provincie/apartamentProvincie.js";
import { AdresaProvincie } from "../../models/models-provincie/adresaProvincie.js";
import { LocalitateProvincie } from "../../models/models-provincie/localitateProvincie.js";
import { JudetProvincie } from "../../models/models-provincie/judetProvincie.js";
import { ChiriasProvincie } from "../../models/models-provincie/chiriasProvincie.js";

const router = Router();

router.get('/', async (req, res) => {
  PlataChirieProvincie.findAll({
    include: [
      {
        model: ContractProvincie,
        include: [
          {
            model: ApartamentProvincie,
            include: [
              {
                model: AdresaProvincie,
                include: [
                  {
                    model: LocalitateProvincie,
                    include: [
                      {
                        model: JudetProvincie
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            model: ChiriasProvincie
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

export { router as plataChirieProvincieRouter };