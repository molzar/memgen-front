import { BaseConfig } from './baseConfig';
import { ProdConfig } from './prodConfig';
const currentProcess = process.env.NODE_ENV;

let Config = BaseConfig; //eslint-disable-line

if (currentProcess === 'production') {
  Config = { ...BaseConfig, ...ProdConfig };
}

export default Config;
