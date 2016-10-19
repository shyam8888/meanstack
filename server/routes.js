var middleware = require('./middleware');

module.exports = function(app) {
  app.use('/api/v1', require('./api/v1'));
};
