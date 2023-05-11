import { Router } from "express";
import { Contract } from '../models/contract.js'
import { Chirias } from "../models/chirias.js";
import { Apartament } from "../models/apartament.js";
import { AgentImobiliar } from "../models/agentImobiliar.js";
import { Adresa } from "../models/adresa.js";
import { Localitate } from "../models/localitate.js";
import { Judet } from "../models/judet.js";
import { Op } from "sequelize";
import { SequelizeService } from "../config/db.js";
import { PlataChirie } from "../models/plataChirie.js";

const router = Router();

let sequelize = SequelizeService.getModbbdNationalInstance();

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
      })
    .then(record => {
      res.json(record)
    })
    .catch(err => res.status(500).json({ error: err.message }));
});

router.post('/', async (req, res, next) => {
  let dataInceput = `${new Date(req.body.dataInceput).getFullYear()}-${new Date(req.body.dataInceput).getMonth()}-${new Date(req.body.dataInceput).getDate()}`;
  let dataFinal = `${new Date(req.body.dataFinal).getFullYear()}-${new Date(req.body.dataFinal).getMonth()}-${new Date(req.body.dataFinal).getDate()}`;

  sequelize.query(`INSERT INTO OLTP_CONTRACT (id_chirias, id_apartament, id_agent, data_inceput, data_final, ziua_scadenta, pret_inchiriere, valoare_estimata, incasari) VALUES (${req.body.idChirias}, ${req.body.idApartament}, ${req.body.idAgent}, to_date('${dataInceput}', 'YYYY-MM-DD'), to_date('${dataFinal}', 'YYYY-MM-DD'), ${req.body.ziuaScandenta}, ${req.body.pretInchiriere}, ${req.body.valoareEstimata}, ${req.body.incasari});`,
  {
    type: sequelize.QueryTypes.INSERT,
    
  })
  .then(async () => {
    let contract = await Contract.findOne({
      where: {
        ID_CHIRIAS: req.body.idChirias,
        ID_APARTAMENT: req.body.idApartament,
        ID_AGENT: req.body.idAgent,
        ziuaScandenta: req.body.ziuaScandenta
      }
    })
      res.status(201).json(contract);
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

router.delete('/:id', async (req, res, next) => {
  await sequelize.transaction(async (t) => {

    try {
  
      let contract = await Contract.findOne({
        where: {
          idContract: req.params.id
        },
        transaction: t  
      })
      
      await PlataChirie.destroy({
        where: {
          ID_CONTRACT: contract.dataValues.idContract
        },
        transaction: t
      })
  
      await Contract.destroy({
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

export { router as contractRouter };