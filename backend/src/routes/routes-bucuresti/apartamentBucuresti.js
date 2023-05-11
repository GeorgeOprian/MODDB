import { Router } from "express";
import { Op } from "sequelize";
import { ApartamentBucuresti } from "../../models/models-bucuresti/apartamentBucuresti.js";
import { AdresaBucuresti } from "../../models/models-bucuresti/adresaBucuresti.js";
import { LocalitateBucuresti } from "../../models/models-bucuresti/localitateBucuresti.js";
import { JudetBucuresti } from "../../models/models-bucuresti/judetBucuresti.js";
import { ContractBucuresti } from "../../models/models-bucuresti/contractBucuresti.js";
import { ChiriasBucuresti } from "../../models/models-bucuresti/chiriasBucuresti.js";
import { AgentImobiliarBucuresti } from "../../models/models-bucuresti/agentImobiliarBucuresti.js";
import { PlataChirieBucuresti } from "../../models/models-bucuresti/plataChirieBucuresti.js";
import { SequelizeService } from "../../config/db.js";

const router = Router();

let sequelize = SequelizeService.getModbdBucurestiInstance();

router.get('/', async (req, res) => {
  const params = req.query;
  if (params.busy !== undefined) {
    if (params.busy === 'true') {
      try {
        let busyAparments = await ContractBucuresti.findAll({
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
              model: ChiriasBucuresti
            },
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
              model: AgentImobiliarBucuresti
            },
          ]
        });
  
        res.json(busyAparments)
      } catch (err) {
        res.status(500).json({ error: err.message })
      }

    } else if((params.busy === 'false')) {
      try {
        let busyAparments = await ContractBucuresti.findAll({
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
  
        let freeApartments = await ApartamentBucuresti.findAll({
          where: {
            ID_APARTAMENT: {
              [Op.notIn]: busyAparmentsIds
            }
          },
          
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
        res.json(freeApartments)
      } catch (err) {
        res.status(500).json({ error: err.message })
      }
    }
  } 
  else if (params.idChirias) {
      try {
        let clientApartment = await ContractBucuresti.findOne({
          where: {
            ID_CHIRIAS: {
              [Op.eq]: params.idChirias
            }
          },
          include: [ChiriasBucuresti, ApartamentBucuresti, AgentImobiliarBucuresti]
        })

        res.json(clientApartment)
      } catch (error) {
        res.status(500).json({ error: err.message })
      }

  } else {
    ApartamentBucuresti.findAll({
      
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

  ApartamentBucuresti.findOne({
    where: { idApartament: req.params.id },
    
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
    .then(record => {
      res.json(record)
    })
    .catch(err => res.status(500).json({ error: err.message }));
});

router.post('/', async (req, res, next) => {
  ApartamentBucuresti.create(req.body)
    .then((item) => {
      const result = item.dataValues;
      result.idApartament = item.idApartament;
      res.status(201).json(result);
    })
    .catch(next);
});

router.put('/:id', async (req, res, next) => {
  const id = req.params.id;
  ApartamentBucuresti.update(
    req.body,
    { where: { idApartament: id } }
  ).then((result) => {
    if (result[0]) res.json({ message: 'Record modified' });
    else res.status(404).json({ error: 'Record not found' });
  })
    .catch(next);
});

router.delete('/:id', async (req, res, next) => {
  await sequelize.transaction(async (t) => {

    try {
      let apartament = await ApartamentBucuresti.findOne({ 
        where: {
          idApartament: req.params.id
        },
        transaction: t  
      })
  
      let contracts = await ContractBucuresti.findAll({
        where: {
          ID_APARTAMENT: apartament.dataValues.idApartament
        },
        transaction: t  
      })
  
      let contractsIds = contracts.map(m => m.dataValues.idContract);
      
      await PlataChirieBucuresti.destroy({
        where: {
          ID_CONTRACT: {
            [Op.in]: contractsIds
          }
        },
        transaction: t
      })
  
      await ContractBucuresti.destroy({
        where: {
          ID_APARTAMENT: apartament.dataValues.idApartament
        },
        transaction: t
      })
  
      await ApartamentBucuresti.destroy({
        where: {
          idApartament: req.params.id
        },
        transaction: t
      });
      
      res.json({ message: 'Record deleted' });

    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  });
});

export { router as apartamentBucurestiRouter };