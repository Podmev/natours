const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: './config.env' });

const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log('DB connection successful!'));

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  console.log(err);
  server.close(() => {
    process.exit(1);
  });
});

// process.on('unhandledRejection', err => {
//   const fullMessage = err.message;
//   const errmsgStart = fullMessage.indexOf('errmsg:') + 8; // Find errmsg inside message
//   const errmsgStop = fullMessage.indexOf(',', errmsgStart); // Find first comma after that
//   const errmsgLen = errmsgStop - errmsgStart;
//   const errorText = fullMessage.substr(errmsgStart, errmsgLen);
//   console.log(err.name);
//   console.log(errorText);
//   console.log('UNHANDLED REJECTION! Shutting down!');
//   // server.close(() => {
//   //    process.exit(1);
//   // });
// });

process.on('SIGTERM', () => {
  console.log('SIGTERM RECEIVED. Shutting down gracefully');
  server.close(() => {
    console.log('Process terminated!');
  });
});
