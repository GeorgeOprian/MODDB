import { Router } from "express";
import { Op } from "sequelize";
import { ContractBucuresti } from "../../models/models-bucuresti/contractBucuresti.js";
import { ApartamentBucuresti } from "../../models/models-bucuresti/apartamentBucuresti.js";
import { AdresaBucuresti } from "../../models/models-bucuresti/adresaBucuresti.js";
import { LocalitateBucuresti } from "../../models/models-bucuresti/localitateBucuresti.js";
import { JudetBucuresti } from "../../models/models-bucuresti/judetBucuresti.js";
import { ChiriasBucuresti } from "../../models/models-bucuresti/chiriasBucuresti.js";
import { AgentImobiliarBucuresti } from "../../models/models-bucuresti/agentImobiliarBucuresti.js";

const router = Router();

router.get('/', async (req, res) => {
  const params = req.query;
  if (params.idChirias) {
    ContractBucuresti.findAll({
      where: {
        ID_CHIRIAS: params.idChirias
      },
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
      ]
    })
      .then(record => {
        res.json(record)
      })
      .catch(err => res.status(500).json({ error: err.message }));
  } else if(params.clientsWithContracts) {
    try {
      let clientsWithContract = await ContractBucuresti.findAll({
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

      let clients = await ChiriasBucuresti.findAll({
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
    ContractBucuresti.findAll({
      raw: true,
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

export { router as contractBucurestiRouter };