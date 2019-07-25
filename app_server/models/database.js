const mongoose = require('mongoose');
require('./locations');
let dbURI = 'mongodb://localhost/Loc8r';
if(process.env.NODE_ENV === 'production'){
  dbURI = 'mongodb+srv://lucashenrique:Linkinpark_001@cluster0-h6qbp.mongodb.net/test?retryWrites=true&w=majority';
}

// To avoid deprecation warnings
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
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

// For nodemon restarts
process.once('SIGUSR2', () => {
  shutdown('nodemon restart', () => {
    process.kill(process.pid, 'SIGUSR2');
  });
});

// For app termination
process.once('SIGINT', () => {
  shutdown('app termination', () => {
    process.kill(process.pid, 'SIGUSR2');
  });
});

// For heroku app termination
process.once('SIGTERM', () => {
  shutdown('heroku app termination', () => {
    process.kill(process.pid, 'SIGUSR2');
  });
});
