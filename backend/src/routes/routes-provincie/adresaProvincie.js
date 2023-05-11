import { Router } from "express";
import { AdresaProvincie } from "../../models/models-provincie/adresaProvincie.js";
import { LocalitateProvincie } from "../../models/models-provincie/localitateProvincie.js";
import { JudetProvincie } from "../../models/models-provincie/judetProvincie.js";
import { ApartamentProvincie } from "../../models/models-provincie/apartamentProvincie.js";
import { ContractProvincie } from "../../models/models-provincie/contractProvincie.js";
import { PlataChirieProvincie } from "../../models/models-provincie/plataChirieProvincie.js";
import { SequelizeService } from "../../config/db.js";
import { Op } from "sequelize";

const router = Router();

let sequelize = SequelizeService.getModbdProvincieInstance();

router.get('/', async (req, res) => {
    AdresaProvincie.findAll({
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
    })
      .then(records => {
        res.json(records)
      })
      .catch(err => res.status(500).json({ error: err.message }));
  });

  router.get('/:id', async (req, res) => {
    AdresaProvincie.findAll({
      where: { idAdresa: req.params.id }
    })
      .then(record => {
        res.json(record)
      })
      .catch(err => res.status(500).json({ error: err.message }));
  });
  
  router.post('/', async (req, res, next) => {
    AdresaProvincie.create(req.body)
      .then((item) => {
        const result = item.dataValues;
        result.idAdresa = item.idAdresa;
        res.status(201).json(result);
      })
      .catch(next);
  });
  
  router.put('/:id', async (req, res, next) => {
    const id = req.params.id;
    AdresaProvincie.update(
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
        let apartament = await ApartamentProvincie.findOne({ 
          where: {
            ID_ADRESA: req.params.id
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
            ID_ADRESA: req.params.id
          },
          transaction: t
        });
      
        await AdresaProvincie.destroy({
          where: { idAdresa: req.params.id },
          transaction: t
        })
        
        res.json({ message: 'Record deleted' });
  
      } catch (err) {
        res.status(500).json({ error: err.message })
      }
    });
  });
  
  export { router as adresaProvincieRouter };