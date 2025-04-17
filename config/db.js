import mysql from 'mysql2/promise';

export const pool = mysql.createPool({
  host: 'localhost', // replace with your DB host
  user: 'root', // replace with your DB user
  password: 'Kpsingh@1234', // replace with your DB password
  database: 'gupshup' // replace with your DB name
});
