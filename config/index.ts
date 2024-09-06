const env = process.env.NODE_ENV || 'development';
console.log('CLUSTER MODE ENABLED', process.env.HMSH_IS_CLUSTER === 'true');

const baseConfig = {
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000', //for local testing of React Web App
};

const envConfig = {
  development: require('./development').default,
  test: require('./test').default,
  staging: require('./staging').default,
  production: require('./production').default,
};

export default { ...baseConfig, ...envConfig[env] };
