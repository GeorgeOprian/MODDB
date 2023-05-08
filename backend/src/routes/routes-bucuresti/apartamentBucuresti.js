import { Router } from "express";
import { Op } from "sequelize";
import { ApartamentBucuresti } from "../../models/models-bucuresti/apartamentBucuresti.js";
import { AdresaBucuresti } from "../../models/models-bucuresti/adresaBucuresti.js";
import { LocalitateBucuresti } from "../../models/models-bucuresti/localitateBucuresti.js";
import { JudetBucuresti } from "../../models/models-bucuresti/judetBucuresti.js";

const router = Router();

router.get('/', async (req, res) => {
  const params = req.query;
  if (params.busy !== undefined) {
    if (params.busy === 'true') {
      try {
        let busyAparments = await Contract.findAll({
          where:{
            dataFinal: {
              [Op.gt]: new Date(),
            },
            dataInceput: {
              [Op.lt]: new Date()
            }
          },
          include: [
            {
              model: Chirias
            },
            {
              model: Apartament,
              include: [
                {
                  model: Adresa,
                  include: [
                    {
                      model: Localitate,
                      include: [
                        {
                          model: Judet
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              model: AgentImobiliar
            },
          ]
        });
  
        res.json(busyAparments)
      } catch (err) {
        res.status(500).json({ error: err.message })
      }

    } else if((params.busy === 'false')) {
      try {
        let busyAparments = await Contract.findAll({
          where:{
            dataFinal: {
              [Op.gt]: new Date(),
            },
            dataInceput: {
              [Op.lt]: new Date()
            }
          }
        });
        let busyAparmentsIds = busyAparments.map(m => m["ID_APARTAMENT"]);
  
        let freeApartments = await Apartament.findAll({
          where: {
            ID_APARTAMENT: {
              [Op.notIn]: busyAparmentsIds
            }
          },
          raw: true,
          include: [
            {
              model: Adresa,
              include: [
                {
                  model: Localitate,
                  include: [
                    {
                      model: Judet
                    }
                  ]
                }
              ]
            }
          ]
        })
        res.json(freeApartments)
      } catch (err) {
        res.status(500).json({ error: err.message })
      }
    }
  } 
  else if (params.idChirias) {
      try {
        let clientApartment = await Contract.findOne({
          where: {
            ID_CHIRIAS: {
              [Op.eq]: params.idChirias
            }
          },
          include: [Chirias, Apartament, AgentImobiliar]
        })

        res.json(clientApartment)
      } catch (error) {
        res.status(500).json({ error: err.message })
      }

  } else {
    ApartamentBucuresti.findAll({
      raw: true,
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
    })
      .then(records => {
        res.json(records)
      })
      .catch(err => res.status(500).json({ error: err.message }));
  }
});

router.get('/:id', async (req, res) => {
  console.log(req.params.id);
  Apartament.findOne({
    where: { idApartament: req.params.id },
    raw: true,
    include: [
      {
        model: Adresa,
        include: [
          {
            model: Localitate,
            include: [
              {
                model: Judet
              }
            ]
          }
        ]
      }
    ]
  })
    .then(record => {
      res.json(record)
    })
    .catch(err => res.status(500).json({ error: err.message }));
});

router.post('/', async (req, res, next) => {
  Apartament.create(req.body)
    .then((item) => {
      const result = item.dataValues;
      result.idApartament = item.idApartament;
      res.status(201).json(result);
    })
    .catch(next);
});

router.put('/:id', async (req, res, next) => {
  const id = req.params.id;
  Apartament.update(
    req.body,
    { where: { idApartament: id } }
  ).then((result) => {
    if (result[0]) res.json({ message: 'Record modified' });
    else res.status(404).json({ error: 'Record not found' });
  })
    .catch(next);
});

router.delete('/:id', (req, res, next) => {
  Apartament.destroy({
    where: { idApartament: req.params.id },
  })
    .then(affectedCount => {
      if (affectedCount) res.json({ message: 'Record deleted' });
      else res.status(404).json({ error: 'Record not found' });
    })
    .catch(err => res.status(500).json({ error: err.message }));
});

export { router as apartamentBucurestiRouter };