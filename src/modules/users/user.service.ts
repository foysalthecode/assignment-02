import { JwtPayload } from "jsonwebtoken";
import { pool } from "../../database/db";

const getAlluser = async () => {
  const result = await pool.query(`
        SELECT id,name,role,email,phone FROM users
        `);
  return result;
};

const checkOwnProfile = async (id: string, user: JwtPayload) => {
  const email = user?.email;
  const result = await pool.query(
    `
    SELECT email FROM users WHERE id=$1
    `,
    [id]
  );
  const matchProfile = result.rows[0]?.email === email;
  return matchProfile;
};

const updateUser = async (payload: Record<string, unknown>) => {
  const { name, email, phone, role, id } = payload;
  const result = await pool.query(
    `
    UPDATE users SET name=$1,email=$2,phone=$3,role=$4 WHERE id=$5 RETURNING *
    `,
    [name, email, phone, role, id]
  );
  return result;
};

const isBookingExist = async (id: string) => {
  const bookingInfo = await pool.query(`
    SELECT customer_id FROM bookings 
    `);
  const userBookingId = bookingInfo.rows.map((booking) =>
    booking.customer_id.toString()
  );
  const isBookingExist = userBookingId.includes(id);
  return isBookingExist;
};

const deleteUser = async (id: string) => {
  const result = await pool.query(
    `
    DELETE FROM users WHERE id=$1
    `,
    [id]
  );
  return result;
};

export const userService = {
  getAlluser,
  updateUser,
  deleteUser,
  isBookingExist,
  checkOwnProfile,
};
