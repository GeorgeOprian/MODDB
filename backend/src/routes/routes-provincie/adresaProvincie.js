import { Router } from "express";
import { AdresaProvincie } from "../../models/models-provincie/adresaProvincie.js";
import { LocalitateProvincie } from "../../models/models-provincie/localitateProvincie.js";
import { JudetProvincie } from "../../models/models-provincie/judetProvincie.js";

const router = Router();

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
  
  export { router as adresaProvincieRouter };