import { Router } from "express";
import { AdresaBucuresti } from "../../models/models-bucuresti/adresaBucuresti.js";
import { LocalitateBucuresti } from "../../models/models-bucuresti/localitateBucuresti.js";
import { JudetBucuresti } from "../../models/models-bucuresti/judetBucuresti.js";
import { ApartamentBucuresti } from "../../models/models-bucuresti/apartamentBucuresti.js";
import { ContractBucuresti } from "../../models/models-bucuresti/contractBucuresti.js";
import { PlataChirieBucuresti } from "../../models/models-bucuresti/plataChirieBucuresti.js";
import { SequelizeService } from "../../config/db.js";
import { Op } from "sequelize";

let sequelize = SequelizeService.getModbdBucurestiInstance();

const router = Router();

router.get('/', async (req, res) => {
    AdresaBucuresti.findAll({
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
    })
      .then(records => {
        res.json(records)
      })
      .catch(err => res.status(500).json({ error: err.message }));
  });

  router.get('/:id', async (req, res) => {
    AdresaBucuresti.findAll({
      where: { idAdresa: req.params.id }
    })
      .then(record => {
        res.json(record)
      })
      .catch(err => res.status(500).json({ error: err.message }));
  });
  
  router.post('/', async (req, res, next) => {
    AdresaBucuresti.create(req.body)
      .then((item) => {
        const result = item.dataValues;
        result.idAdresa = item.idAdresa;
        res.status(201).json(result);
      })
      .catch(next);
  });
  
  router.put('/:id', async (req, res, next) => {
    const id = req.params.id;
    AdresaBucuresti.update(
      req.body,
      { where: { idAdresa: id } }
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
            ID_ADRESA: req.params.id
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
            ID_ADRESA: req.params.id
          },
          transaction: t
        });
      
        await AdresaBucuresti.destroy({
          where: { idAdresa: req.params.id },
          transaction: t
        })
        
        res.json({ message: 'Record deleted' });
  
      } catch (err) {
        res.status(500).json({ error: err.message })
      }
    });
  });
  
  export { router as adresaBucurestiRouter };