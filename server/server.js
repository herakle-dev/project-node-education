// connection.js
const mysql = require('mysql2');
const config = require('./config');

const connection = mysql.createConnection(config);

connection.connect((err) => {
  if (err) {
    console.error('Errore nella connessione al database:', err);
    return;
  }
  console.log('Connessione al database avvenuta con successo!');
});

module.exports = connection;
