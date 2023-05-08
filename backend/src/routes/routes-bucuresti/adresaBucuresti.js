import { Router } from "express";
import { AdresaBucuresti } from "../../models/models-bucuresti/adresaBucuresti.js";
import { LocalitateBucuresti } from "../../models/models-bucuresti/localitateBucuresti.js";
import { JudetBucuresti } from "../../models/models-bucuresti/judetBucuresti.js";

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
  
  export { router as adresaBucurestiRouter };