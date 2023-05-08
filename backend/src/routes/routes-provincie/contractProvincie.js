import { Router } from "express";
import { Op } from "sequelize";
import { ContractProvincie } from "../../models/models-provincie/contractProvincie.js";
import { ApartamentProvincie } from "../../models/models-provincie/apartamentProvincie.js";
import { AdresaProvincie } from "../../models/models-provincie/adresaProvincie.js";
import { LocalitateProvincie } from "../../models/models-provincie/localitateProvincie.js";
import { JudetProvincie } from "../../models/models-provincie/judetProvincie.js";
import { ChiriasProvincie } from "../../models/models-provincie/chiriasProvincie.js";
import { AgentImobiliarProvincie } from "../../models/models-provincie/agentImobiliarProvincie.js";

const router = Router();

router.get('/', async (req, res) => {
  const params = req.query;
  if (params.idChirias) {
    ContractProvincie.findAll({
      where: {
        ID_CHIRIAS: params.idChirias
      },
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
      ]
    })
      .then(record => {
        res.json(record)
      })
      .catch(err => res.status(500).json({ error: err.message }));
  } else if(params.clientsWithContracts) {
    try {
      let clientsWithContract = await ContractProvincie.findAll({
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

      let clients = await ChiriasProvincie.findAll({
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
    ContractProvincie.findAll({
      raw: true,
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

export { router as contractProvincieRouter };