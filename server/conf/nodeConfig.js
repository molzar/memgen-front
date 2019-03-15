const currentProcess = process.env.NODE_ENV;

const BaseConfig = {
  apiHost: '10.185.22.80',
  apiPort: '3001',
};

const ProdConfig = {
  apiHost: '10.185.22.80',
  apiPort: '3001',
};

let Config = BaseConfig;

if (currentProcess === 'production') {
  Config = ProdConfig;
}

module.exports = Config;
