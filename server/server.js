const mysql = require('mysql2');

const connection = mysql.createConnection({
  user: 'root',
  password: '',
  database: 'node_education',
});

connection.connect((err) => {
  if (err) {
    console.error('Errore nella connessione al database:', err);
    return;
  }
  console.log('Connessione al database avvenuta con successo!');
});


module.exports = connection;
