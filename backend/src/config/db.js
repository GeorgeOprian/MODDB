import { Sequelize } from "sequelize";
import * as dotenv from 'dotenv';
import * as oracledb from 'oracledb';
dotenv.config();

export class SequelizeService {
    static #modbbdNationalInstance;
    static #modbbdBucurestiInstance;
    static #modbbdProvincieInstance;

    static getModbbdNationalInstance() {
        if (!SequelizeService.#modbbdNationalInstance) {
            SequelizeService.#modbbdNationalInstance = new Sequelize( {
                dialect: 'oracle',
                username: 'modbd_national',
                password: 'parolamodbd',
                host: 'localhost',
                port: '1521',
                database: 'modbd1',
            });
        }
        return SequelizeService.#modbbdNationalInstance;
    }

    static getModbdBucurestiInstance() {
        if (!SequelizeService.#modbbdBucurestiInstance) {
            SequelizeService.#modbbdBucurestiInstance = new Sequelize( {
                dialect: 'oracle',
                username: 'modbd_bucuresti',
                password: 'parolamodbd',
                host: 'localhost',
                port: '1521',
                database: 'modbd1',
                
            });
        }
        return SequelizeService.#modbbdBucurestiInstance;
    }

    static getModbdProvincieInstance() {
        if (!SequelizeService.#modbbdProvincieInstance) {
            SequelizeService.#modbbdProvincieInstance = new Sequelize( {
                dialect: 'oracle',
                username: 'modbd_provincie',
                password: 'parolamodbd',
                host: 'localhost',
                port: '1521',
                database: 'modbd2',
                
            });
        }
        return SequelizeService.#modbbdProvincieInstance;
    }
}