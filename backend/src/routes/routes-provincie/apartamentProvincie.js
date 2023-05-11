import { Router } from "express";
import { Op } from "sequelize";
import { ApartamentProvincie } from "../../models/models-provincie/apartamentProvincie.js";
import { AdresaProvincie } from "../../models/models-provincie/adresaProvincie.js";
import { LocalitateProvincie } from "../../models/models-provincie/localitateProvincie.js";
import { JudetProvincie } from "../../models/models-provincie/judetProvincie.js";
import { ContractProvincie } from "../../models/models-provincie/contractProvincie.js";
import { ChiriasProvincie } from "../../models/models-provincie/chiriasProvincie.js";
import { AgentImobiliarProvincie } from "../../models/models-provincie/agentImobiliarProvincie.js";
import { PlataChirieProvincie } from "../../models/models-provincie/plataChirieProvincie.js";
import { SequelizeService } from "../../config/db.js";

const router = Router();

let sequelize = SequelizeService.getModbdProvincieInstance();

router.get('/', async (req, res) => {
  const params = req.query;
  if (params.busy !== undefined) {
    if (params.busy === 'true') {
      try {
        let busyAparments = await ContractProvincie.findAll({
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
              model: ChiriasProvincie
            },
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
              model: AgentImobiliarProvincie
            },
          ]
        });
  
        res.json(busyAparments)
      } catch (err) {
        res.status(500).json({ error: err.message })
      }

    } else if((params.busy === 'false')) {
      try {
        let busyAparments = await ContractProvincie.findAll({
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
  
        let freeApartments = await ApartamentProvincie.findAll({
          where: {
            ID_APARTAMENT: {
              [Op.notIn]: busyAparmentsIds
            }
          },
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
        })
        res.json(freeApartments)
      } catch (err) {
        res.status(500).json({ error: err.message })
      }
    }
  } 
  else if (params.idChirias) {
      try {
        let clientApartment = await ContractProvincie.findOne({
          where: {
            ID_CHIRIAS: {
              [Op.eq]: params.idChirias
            }
          },
          include: [ChiriasProvincie, ApartamentProvincie, AgentImobiliarProvincie]
        })

        res.json(clientApartment)
      } catch (error) {
        res.status(500).json({ error: err.message })
      }

  } else {
    ApartamentProvincie.findAll({
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
    })
      .then(records => {
        res.json(records)
      })
      .catch(err => res.status(500).json({ error: err.message }));
  }
});

router.get('/:id', async (req, res) => {

  ApartamentProvincie.findOne({
    where: { idApartament: req.params.id },
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
  })
    .then(record => {
      res.json(record)
    })
    .catch(err => res.status(500).json({ error: err.message }));
});

router.post('/', async (req, res, next) => {
  ApartamentProvincie.create(req.body)
    .then((item) => {
      const result = item.dataValues;
      result.idApartament = item.idApartament;
      res.status(201).json(result);
    })
    .catch(next);
});

router.put('/:id', async (req, res, next) => {
  const id = req.params.id;
  ApartamentProvincie.update(
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
      let apartament = await ApartamentProvincie.findOne({ 
        where: {
          idApartament: req.params.id
        },
        transaction: t  
      })
  
      let contracts = await ContractProvincie.findAll({
        where: {
          ID_APARTAMENT: apartament.dataValues.idApartament
        },
        transaction: t  
      })
  
      let contractsIds = contracts.map(m => m.dataValues.idContract);
      
      await PlataChirieProvincie.destroy({
        where: {
          ID_CONTRACT: {
            [Op.in]: contractsIds
          }
        },
        transaction: t
      })
  
      await ContractProvincie.destroy({
        where: {
          ID_APARTAMENT: apartament.dataValues.idApartament
        },
        transaction: t
      })
  
      await ApartamentProvincie.destroy({
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

export { router as apartamentProvincieRouter };