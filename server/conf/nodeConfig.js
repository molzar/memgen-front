const currentProcess = process.env.NODE_ENV;

const BaseConfig = {
  apiHost: 'localhost',
  apiPort: '3001',
};

const ProdConfig = {
  apiHost: 'localhost',
  apiPort: '3001',
};

let Config = BaseConfig;

if (currentProcess === 'production') {
  Config = ProdConfig;
}

module.exports = Config;
