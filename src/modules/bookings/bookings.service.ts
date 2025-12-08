import { pool } from "../../database/db";

const createBooking = async (payload: Record<string, unknown>) => {
  const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;
  const booked = "booked";

  const vehicleResult = await pool.query(
    `
    SELECT * FROM vehicles WHERE id = $1
    `,
    [vehicle_id]
  );
  const upateVehicleStatus = await pool.query(
    `
    UPDATE vehicles SET availability_status=$1 WHERE id = $2
    `,
    [booked, vehicle_id]
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
  const customerInfo = await pool.query(
    `
    SELECT name,email FROM users WHERE id=$1
    `,
    [result.rows[0].customer_id]
  );
  const vehicleInfo = await pool.query(
    `
    SELECT vehicle_name, registration_number FROM vehicles WHERE id=$1
    `,
    [result.rows[0].vehicle_id]
  );
  // const { name, email } = customerInfo.rows[0];
  // const { vehicle_name, registration_number } = vehicleInfo.rows[0];
  // const customerinfo = { name, email };
  // const vehicleinfo = { vehicle_name, registration_number };
  return { result, customerInfo, vehicleInfo };
};

const updateBooking = async (status: string, id: string) => {
  const result = await pool.query(
    `
    UPDATE bookings SET status=$1 WHERE id=$2 RETURNING *
    `,
    [status, id]
  );

  const { vehicle_id } = result.rows[0];
  const booked = "available";

  const upateVehicleStatus = await pool.query(
    `
    UPDATE vehicles SET availability_status=$1 WHERE id = $2
    `,
    [booked, vehicle_id as string]
  );
  console.log("result from service", vehicle_id);

  return result;
};

export const bookingService = {
  createBooking,
  getAllBooking,
  updateBooking,
};
