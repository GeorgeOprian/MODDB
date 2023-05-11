import { Router } from "express";
import { Op } from "sequelize";
import { ContractBucuresti } from "../../models/models-bucuresti/contractBucuresti.js";
import { ApartamentBucuresti } from "../../models/models-bucuresti/apartamentBucuresti.js";
import { AdresaBucuresti } from "../../models/models-bucuresti/adresaBucuresti.js";
import { LocalitateBucuresti } from "../../models/models-bucuresti/localitateBucuresti.js";
import { JudetBucuresti } from "../../models/models-bucuresti/judetBucuresti.js";
import { ChiriasBucuresti } from "../../models/models-bucuresti/chiriasBucuresti.js";
import { AgentImobiliarBucuresti } from "../../models/models-bucuresti/agentImobiliarBucuresti.js";
import { PlataChirieBucuresti } from "../../models/models-bucuresti/plataChirieBucuresti.js";
import { SequelizeService } from "../../config/db.js";

const router = Router();

let sequelize = SequelizeService.getModbdBucurestiInstance();

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
        include: [ChiriasBucuresti]
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
  ContractBucuresti.findAll({
    where: { idContract: req.params.id },
  })
    .then(record => {
      res.json(record)
    })
    .catch(err => res.status(500).json({ error: err.message }));
});

router.post('/', async (req, res, next) => {
  ContractBucuresti.create(req.body)
    .then(async (item) => {
      let contract = await ContractBucuresti.findOne({
        where: {
          ID_CHIRIAS: item.dataValues.ID_CHIRIAS,
          ID_APARTAMENT: item.dataValues.ID_APARTAMENT,
          ID_AGENT: item.dataValues.ID_AGENT,
          ziuaScandenta: item.dataValues.ziuaScandenta
        }
      })
      res.status(201).json(contract);
    })
    .catch(next);
});

router.put('/:id', async (req, res, next) => {
  const id = req.params.id;
  ContractBucuresti.update(
    req.body,
    { where: { idContract: id } }
  ).then((result) => {
    if (result[0]) res.json({ message: 'Record modified' });
    else res.status(404).json({ error: 'Record not found' });
  })
    .catch(next);
});

router.delete('/:id', async (req, res, next) => {
  await sequelize.transaction(async (t) => {

    try {
  
      let contract = await ContractBucuresti.findOne({
        where: {
          idContract: req.params.id
        },
        transaction: t  
      })
      
      await PlataChirieBucuresti.destroy({
        where: {
          ID_CONTRACT: contract.dataValues.idContract
        },
        transaction: t
      })
  
      await ContractBucuresti.destroy({
        where: {
          idContract: req.params.id
        },
        transaction: t
      })
      
      res.json({ message: 'Record deleted' });

    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  });
});

export { router as contractBucurestiRouter };