const { Pool } = require("pg");
require("dotenv").config();
const DB_USER = process.env.DB_USER;
const DB_HOST = process.env.DB_HOST;
const DB_DATABASE = process.env.DB_DATABASE;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_PORT = process.env.DB_PORT;

const pool = new Pool({
  user: DB_USER,
  host: DB_HOST,
  database: DB_DATABASE,
  password: DB_PASSWORD,
  port: DB_PORT,
  ssl: {
    rejectUnauthorized: false,
  },
});
const leerValorDolar = async () => {
  try {
    const res = await pool.query(
      "SELECT bcv, en_paralelo_vzla3, binance_p2p, monitor_dolar_web, en_paralelo_vzla_vip FROM tabla_dolar;"
    );
    return res.rows[0];
  } catch (error) {
    console.error("Error al obtener datos de la base de datos:", error);
    return {};
  }
};
const escribirValorDolar = async (valores) => {
  try {
    const query = `
      UPDATE tabla_dolar
      SET
        bcv = $1,
        en_paralelo_vzla3 = $2,
        binance_p2p = $3,
        monitor_dolar_web = $4,
        en_paralelo_vzla_vip = $5
      WHERE id = 1
      RETURNING *;
    `;
    const values = [
      valores.bcv,
      valores.en_paralelo_vzla3,
      valores.binance_p2p,
      valores.monitor_dolar_web,
      valores.en_paralelo_vzla_vip,
    ];
    const res = await pool.query(query, values);
    res.rows[0];
  } catch (error) {
    console.error("Error al guardar en la base de datos:", error);
  }
};
// const valores = {
//   bcv: 35.51,
//   en_paralelo_vzla3: 37.22,
//   binance_p2p: 36.92,
//   monitor_dolar_web: 36,
//   en_paralelo_vzla_vip: 36,
// };

// const insertarValoresDolar = async () => {
//   const query = `
//     INSERT INTO tabla_dolar(bcv, en_paralelo_vzla3, binance_p2p, monitor_dolar_web, en_paralelo_vzla_vip)
//     VALUES($1, $2, $3, $4, $5) RETURNING *;
//   `;
//   const values = [
//     valores.bcv,
//     valores.en_paralelo_vzla3,
//     valores.binance_p2p,
//     valores.monitor_dolar_web,
//     valores.en_paralelo_vzla_vip,
//   ];

//   try {
//     const res = await pool.query(query, values);
//   } catch (error) {
//     console.error("Error al insertar valores en la base de datos:", error);
//   }
// };

// const crearTablaValorDolar = async () => {
//   try {
//     const query = `
//       CREATE TABLE IF NOT EXISTS tabla_dolar (
//         id SERIAL PRIMARY KEY,
//         fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//         bcv DECIMAL(10, 2),
//         en_paralelo_vzla3 DECIMAL(10, 2),
//         binance_p2p DECIMAL(10, 2),
//         monitor_dolar_web DECIMAL(10, 2),
//         en_paralelo_vzla_vip DECIMAL(10, 2)
//       );
//     `;

//     await pool.query(query);
//   } catch (error) {
//     console.error("Error al crear la tabla 'tabla_dolar':", error);
//   }
// };

module.exports = {
  leerValorDolar,
  escribirValorDolar,
};
