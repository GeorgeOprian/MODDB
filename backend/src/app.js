import express from 'express';
import chalk from 'chalk';
import { handleError } from './routes/middleware.js';
import oracledb from 'oracledb';
import { contractRouter } from './routes/contract.js';
import { SequelizeService } from "./config/db.js";
import { judetRouter } from './routes/judet.js';
import { localitateRouter } from './routes/localitate.js';
import { apartamentRouter } from './routes/apartament.js';
import { chiriasRouter } from './routes/chirias.js';
import { agentImobiliarRouter } from './routes/agentImobiliar.js';
import { plataChirieRouter } from './routes/plataChirie.js';
import { adresaRouter } from './routes/adresa.js'
import { adresaBucurestiRouter } from './routes/routes-bucuresti/adresaBucuresti.js';
import { judetBucurestiRouter } from './routes/routes-bucuresti/judetBucuresti.js';
import { localitateBucurestiRouter } from './routes/routes-bucuresti/localitateBucuresti.js';
import { judetProvincieRouter } from './routes/routes-provincie/judetProvincie.js';
import { apartamentBucurestiRouter } from './routes/routes-bucuresti/apartamentBucuresti.js';
import { chiriasBucurestiRouter } from './routes/routes-bucuresti/chiriasBucuresti.js';
import { agentImobiliarBucurestiRouter } from './routes/routes-bucuresti/agentImobiliarBucuresti.js';
import { contractBucurestiRouter } from './routes/routes-bucuresti/contractBucuresti.js';
import { plataChirieBucurestiRouter } from './routes/routes-bucuresti/plataChirieBucuresti.js';
import { localitateProvincieRouter } from './routes/routes-provincie/localitateProvincie.js';
import { adresaProvincieRouter } from './routes/routes-provincie/adresaProvincie.js';
import { apartamentProvincieRouter } from './routes/routes-provincie/apartamentProvincie.js';
import { chiriasProvincieRouter } from './routes/routes-provincie/chiriasProvincie.js';
import { agentImobiliarProvincieRouter } from './routes/routes-provincie/agentImobiliarProvincie.js';
import { contractProvincieRouter } from './routes/routes-provincie/contractProvincie.js';
import { plataChirieProvincieRouter } from './routes/routes-provincie/plataChirieProvincie.js';
const today = new Date();
console.log(today.toISOString());


const app = express();

// CORS policy
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS, PUT");
  next();
})

app.get('/health', (req, res) => {
  res.send({
    message: 'Up and running'
  })
});

app.use(express.json());

// SequelizeService.getModbbdNationalInstance().sync()
//   .then(() => {
//     console.log('Database sync successful!');
//   })
//   .catch((error) => {
//     console.error('Database sync error:', error);
//   });

// await SequelizeService.getModbbdNationalInstance();

// SequelizeService.getModbdBucurestiInstance().sync()
//   .then(() => {
//     console.log('Database sync successful!');
//   })
//   .catch((error) => {
//     console.error('Database sync error:', error);
//   });

// await SequelizeService.getModbdBucurestiInstance();



app.use('/adresa', adresaRouter);
app.use('/judet', judetRouter);
app.use('/localitate', localitateRouter);
app.use('/contract', contractRouter);
app.use('/apartament', apartamentRouter);
app.use('/chirias', chiriasRouter);
app.use('/agent', agentImobiliarRouter);
app.use('/plata', plataChirieRouter);

app.use('/adresaBucuresti', adresaBucurestiRouter);
app.use('/judetBucuresti', judetBucurestiRouter);
app.use('/localitateBucuresti', localitateBucurestiRouter);
app.use('/apartamentBucuresti', apartamentBucurestiRouter);
app.use('/chiriasBucuresti', chiriasBucurestiRouter);
app.use('/agentBucuresti', agentImobiliarBucurestiRouter);
app.use('/contractBucuresti', contractBucurestiRouter);
app.use('/plataBucuresti', plataChirieBucurestiRouter);

app.use('/judetProvincie', judetProvincieRouter);
app.use('/localitateProvincie', localitateProvincieRouter);
app.use('/adresaProvincie', adresaProvincieRouter);
app.use('/apartamentProvincie', apartamentProvincieRouter);
app.use('/chiriasProvincie', chiriasProvincieRouter);
app.use('/agentProvincie', agentImobiliarProvincieRouter);
app.use('/contractProvincie', contractProvincieRouter);
app.use('/plataProvincie', plataChirieProvincieRouter);

app.use(handleError);


const connectionParams = {
  user: 'modbd_national',
  password: 'parolamodbd',
  connectString: 'localhost/modbd1'
};

const connectionParamsBucuresti = {
  user: 'modbd_bucuresti',
  password: 'parolamodbd',
  connectString: 'localhost/modbd1',
};

const connectionParamsProvincie = {
  user: 'modbd_provincie',
  password: 'parolamodbd',
  connectString: 'localhost/modbd2',
};

// oracledb.getConnection(connectionParams, (err, connection) => {
//   if (err) {
//     console.error(err.message);
//     return;
//   }
//   console.log('Connected to Oracle database!');
//   connection.execute(
//     "SELECT ID_APARTAMENT from modbd_national.OLTP_APARTAMENT WHERE ID_APARTAMENT NOT IN (SELECT ID_APARTAMENT FROM modbd_national.OLTP_CONTRACT WHERE data_final > SYSDATE)",
//     (err, result) => {
//       if (err) {
//         console.error(err.message);
//         return;
//       }
//       console.log(result);
//     }
//   );
// });

// oracledb.getConnection(connectionParamsBucuresti, (err, connection) => {
//   if (err) {
//     console.error(err.message);
//     return;
//   }
//   console.log('Connected to Oracle database Bucuresti!');
//   connection.execute(
//     "SELECT * FROM judet_bucuresti",
//     (err, result) => {
//       if (err) {
//         console.error(err.message);
//         return;
//       }
//       console.log(result);
//     }
//   );
// });

// oracledb.getConnection(connectionParamsProvincie, (err, connection) => {
//   if (err) {
//     console.error(err.message);
//     return;
//   }
//   console.log('Connected to Oracle database Provincie!');
//   connection.execute(
//     "SELECT * FROM judet_provincie",
//     (err, result) => {
//       if (err) {
//         console.error(err.message);
//         return;
//       }
//       console.log(result);
//     }
//   );
// });

app.listen(4200, (err) => {
  err && console.error(err);
  console.log(chalk.magenta(`Server started on port`), chalk.yellow(4200));
});