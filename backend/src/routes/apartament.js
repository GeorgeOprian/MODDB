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

const router = Router();

let sequelize = SequelizeService.getModbbdNationalInstance();

router.get('/', async (req, res) => {
  const params = req.query;
  if (params.busy !== undefined) {
    if (params.busy === 'true') {
      // sequelize.query(`SELECT ID_APARTAMENT, ID_ADRESA, NUMAR_CAMERE, ETAJ, SUPRAFATA, CENTRALA_PROPRIE, PRET_INCHIRIERE, TIP_CONFORT
      //   from PI_OLTP.OLTP_APARTAMENT 
      //   WHERE ID_APARTAMENT NOT IN (SELECT ID_APARTAMENT FROM PI_OLTP.OLTP_CONTRACT WHERE DATA_FINAL > SYSDATE)`, {
      //   type: sequelize.QueryTypes.SELECT,
      //   model: Apartament,
      //   mapToModel: true
      // }).then(records => {
      //   res.json(records)
      // })
      // .catch(err => res.status(500).json({ error: err.message }));

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
    // sequelize.query(`SELECT a.ID_APARTAMENT, a.ID_ADRESA, a.NUMAR_CAMERE, a.ETAJ, a.SUPRAFATA, a.CENTRALA_PROPRIE, a.PRET_INCHIRIERE, a.TIP_CONFORT
    //   FROM PI_OLTP.OLTP_APARTAMENT a
    //   JOIN PI_OLTP.OLTP_CONTRACT co on a.ID_APARTAMENT = co.ID_APARTAMENT
    //   JOIN PI_OLTP.OLTP_CHIRIAS c on co.ID_CHIRIAS = c.ID_CHIRIAS
    //   WHERE co.DATA_FINAL > SYSDATE
    //   AND c.ID_CHIRIAS = :idChirias;`, {
    //     replacements: { idChirias: params.idChirias },
    //     type: sequelize.QueryTypes.SELECT,
    //     model: Apartament,
    //     mapToModel: true
    // }).then(records => {
    //   res.json(records)
    // })
    // .catch(err => res.status(500).json({ error: err.message }));
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

export { router as apartamentRouter };