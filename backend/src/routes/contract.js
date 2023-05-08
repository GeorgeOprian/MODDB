import { Router } from "express";
import { Contract } from '../models/contract.js'
import { Chirias } from "../models/chirias.js";
import { Apartament } from "../models/apartament.js";
import { AgentImobiliar } from "../models/agentImobiliar.js";
import { Adresa } from "../models/adresa.js";
import { Localitate } from "../models/localitate.js";
import { Judet } from "../models/judet.js";
import { Op } from "sequelize";

const router = Router();

router.get('/', async (req, res) => {
  const params = req.query;
  if (params.idChirias) {
    Contract.findAll({
      where: {
        ID_CHIRIAS: params.idChirias
      },
      include: [
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
      ]
    })
      .then(record => {
        res.json(record)
      })
      .catch(err => res.status(500).json({ error: err.message }));
  } else if(params.clientsWithContracts) {
    try {
      let clientsWithContract = await Contract.findAll({
        where:{
          dataFinal: {
            [Op.gt]: new Date(),
          },
          dataInceput: {
            [Op.lt]: new Date()
          }
        },
        include: [Chirias]
      })
  
      let clientsIds = [...new Set(clientsWithContract.map(m => m.ID_CHIRIAS))];

      let clients = await Chirias.findAll({
        where: {
          ID_CHIRIAS: {
            [Op.in]: clientsIds
          }
        }
      })

      res.json(clients)
    } catch (err) {
      res.status(500).json({ error: err.message })
    }

  } else {
    Contract.findAll({
      raw: true,
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
    })
      .then(records => {
        res.json(records)
      })
      .catch(err => res.status(500).json({ error: err.message }));
  }
});

router.get('/:id', async (req, res) => {
  Contract.findAll({
    where: { idContract: req.params.id },
    raw: true
  })
    .then(record => {
      res.json(record)
    })
    .catch(err => res.status(500).json({ error: err.message }));
});

router.post('/', async (req, res, next) => {
  Contract.create(req.body)
    .then((item) => {
      const result = item.dataValues;
      result.idContract = item.idContract;
      res.status(201).json(result);
    })
    .catch(next);
});

router.put('/:id', async (req, res, next) => {
  const id = req.params.id;
  Contract.update(
    req.body,
    { where: { idContract: id } }
  ).then((result) => {
    if (result[0]) res.json({ message: 'Record modified' });
    else res.status(404).json({ error: 'Record not found' });
  })
    .catch(next);
});

router.delete('/:id', (req, res, next) => {
  Contract.destroy({
    where: { idContract: req.params.id },
  })
    .then(affectedCount => {
      if (affectedCount) res.json({ message: 'Record deleted' });
      else res.status(404).json({ error: 'Record not found' });
    })
    .catch(err => res.status(500).json({ error: err.message }));
});

export { router as contractRouter };