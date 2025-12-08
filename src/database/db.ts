import { Pool } from "pg";
import config from "./config";

export const pool = new Pool({
  connectionString: `${config.connection_str}`,
});

const initDB = async () => {
  await pool.query(`
        CREATE TABLE IF NOT EXISTS vehicles(
        id SERIAL PRIMARY KEY,
        vehicle_name VARCHAR(100) NOT NULL,
        type VARCHAR(150) NOT NULL,
        CHECK (type IN ('car', 'bike', 'van','suv')),
        registration_number VARCHAR(30) UNIQUE NOT NULL,
        daily_rent_price INT NOT NULL,
        availability_status VARCHAR(15)
        )
        `);
  await pool.query(`
        CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        role VARCHAR(50) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        password TEXT NOT NULL,
        phone TEXT NOT NULL
    )
    `);
  await pool.query(`
        CREATE TABLE IF NOT EXISTS bookings(
        id SERIAL PRIMARY KEY,
        customer_id INT REFERENCES users(id) ON DELETE CASCADE,
        vehicle_id INT REFERENCES vehicles(id) ON DELETE CASCADE,
        rent_start_date VARCHAR(50) NOT NULL,
        rent_end_date VARCHAR(50) NOT NULL,
        total_price INT NOT NULL,
        status TEXT NOT NULL,
        CHECK (status IN ('active', 'cancelled', 'returned')),
        CONSTRAINT valid_rent_period CHECK (rent_end_date > rent_start_date)
        )
        `);
};

export default initDB;
