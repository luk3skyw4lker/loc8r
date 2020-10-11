const mongoose = require('mongoose');
require('./locations');
require('./users');
const dbURI = process.env.MONGODB_URI;

// To avoid deprecation warnings
mongoose.set('useUnifiedTopology', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useNewUrlParser', true);
mongoose.set('useCreateIndex', true);

// Starting the connection
mongoose.connect(dbURI);

// Monitoring the connection
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to:', dbURI);
});
mongoose.connection.on('error', err => {
  console.log('Mongoose connection error:', err);
});
mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
});

// For closing the connection on any platform
const shutdown = (msg, callback) => {
  mongoose.connection.close(() => {
    console.log('Mongoose disconnected through', msg);
    callback();
  });
};

// For app termination
process.once('SIGINT', () => {
  shutdown('app termination', () => {
    process.kill(process.pid, 'SIGINT');
  });
});

// For heroku app termination
process.once('SIGTERM', () => {
  shutdown('heroku app termination', () => {
    process.kill(process.pid, 'SIGTERM');
  });
});
