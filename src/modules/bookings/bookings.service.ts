import { pool } from "../../database/db";

const createBooking = async (payload: Record<string, unknown>) => {
  const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;

  const vehicleResult = await pool.query(
    `
    SELECT * FROM vehicles WHERE id = $1
    `,
    [vehicle_id]
  );
  const carRentPrice = vehicleResult.rows[0].daily_rent_price;
  const startDate = new Date(rent_start_date as string);
  const endDate = new Date(rent_end_date as string);
  const totalDays =
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
  const total_price = totalDays * carRentPrice;
  let status = "active";
  const result = await pool.query(
    `
        INSERT INTO bookings(customer_id, vehicle_id, rent_start_date, rent_end_date,total_price,status) VALUES($1,$2,$3,$4,$5,$6) RETURNING *
        `,
    [
      customer_id,
      vehicle_id,
      rent_start_date,
      rent_end_date,
      total_price,
      status,
    ]
  );
  const { vehicle_name, daily_rent_price } = vehicleResult.rows[0];
  const vehicle = { vehicle_name, daily_rent_price };
  return { result, vehicle };
};

const getAllBooking = async () => {
  const result = await pool.query(`
        SELECT * FROM bookings
        `);
  return result;
};

export const bookingService = {
  createBooking,
  getAllBooking,
};
