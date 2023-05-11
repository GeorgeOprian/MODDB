import { Router } from "express";
import { Op } from "sequelize";
import { Apartament } from '../models/apartament.js'
import { SequelizeService } from "../config/db.js";
import { Adresa } from "../models/adresa.js";
import { Localitate } from "../models/localitate.js";
import { Judet } from "../models/judet.js";
import { Contract } from "../models/contract.js";
import { Chirias } from "../models/chirias.js";
import { AgentImobiliar } from "../models/agentImobiliar.js";
import { PlataChirie } from "../models/plataChirie.js";

const router = Router();

let sequelize = SequelizeService.getModbbdNationalInstance();

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
    Apartament.findAll({
      
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
  sequelize.query(`INSERT INTO OLTP_APARTAMENT (ID_ADRESA, NUMAR_CAMERE, ETAJ, SUPRAFATA, CENTRALA_PROPRIE, PRET_INCHIRIERE, TIP_CONFORT) VALUES (${req.body.ID_ADRESA}, ${req.body.numarCamere}, ${req.body.etaj}, ${req.body.suprafata}, '${req.body.centralaProprie}', ${req.body.pretInchiriere}, ${req.body.tipConfort});`,
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
  Apartament.update(
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
      let apartament = await Apartament.findOne({ 
        where: {
          idApartament: req.params.id
        },
        transaction: t  
      })
  
      let contracts = await Contract.findAll({
        where: {
          ID_APARTAMENT: apartament.dataValues.idApartament
        },
        transaction: t  
      })
  
      let contractsIds = contracts.map(m => m.dataValues.idContract);
      
      await PlataChirie.destroy({
        where: {
          ID_CONTRACT: {
            [Op.in]: contractsIds
          }
        },
        transaction: t
      })
  
      await Contract.destroy({
        where: {
          ID_APARTAMENT: apartament.dataValues.idApartament
        },
        transaction: t
      })
  
      await Apartament.destroy({
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

export { router as apartamentRouter };