import { pool } from "../../database/db";

const isVehicleAndUserExistForBook = async (
  payload: Record<string, unknown>
) => {
  const { customer_id, vehicle_id } = payload;
  const usersResult = await pool.query(
    `
    SELECT * FROM users WHERE id = $1
    `,
    [customer_id]
  );
  const vehicleResult = await pool.query(
    `
    SELECT * FROM vehicles WHERE id = $1
    `,
    [vehicle_id]
  );

  return { usersResult, vehicleResult };
};

const createBooking = async (payload: Record<string, unknown>) => {
  const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;
  const booked = "booked";

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
  const upateVehicleStatus = await pool.query(
    `
    UPDATE vehicles SET availability_status=$1 WHERE id = $2
    `,
    [booked, vehicle_id]
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
    SELECT id,name,email FROM users WHERE id=$1
    `,
    [result.rows[0].customer_id]
  );
  const vehicleInfo = await pool.query(
    `
    SELECT vehicle_name, registration_number FROM vehicles WHERE id=$1
    `,
    [result.rows[0].vehicle_id]
  );
  return { result, customerInfo, vehicleInfo };
};

const singleCustomerBooking = async (email: string) => {
  const bookingInfo = await pool.query(`
        SELECT * FROM bookings
        `);
  const customerInfo = await pool.query(
    `
    SELECT id,name,email FROM users WHERE email=$1
    `,
    [email]
  );
  const ownBooking = bookingInfo.rows.filter(
    (booking) => booking.customer_id === customerInfo.rows[0].id
  );

  const ownBookingVehicleId = ownBooking.map((booking) => booking.vehicle_id);
  const vehicleId = ownBooking.map((vehicleid) => vehicleid.vehicle_id);
  // const vehicleInfo = await pool.query(
  //   `
  //   SELECT * FROM vehicles WHERE id=$1
  //   `,
  //   [bookingInfo.rows[0].vehicle_id]
  // );

  //vehicle_name, registration_number

  return ownBooking;
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

  const vehicleInfo = await pool.query(
    `
    SELECT availability_status FROM vehicles WHERE id=$1
    `,
    [vehicle_id]
  );

  return { result, vehicleInfo };
};

export const bookingService = {
  createBooking,
  getAllBooking,
  updateBooking,
  isVehicleAndUserExistForBook,
  singleCustomerBooking,
};
