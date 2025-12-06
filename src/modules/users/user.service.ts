import { pool } from "../../database/db";

const getAlluser = async () => {
  const result = await pool.query(`
        SELECT id,name,role,email,phone FROM users
        `);
  return result;
};

export const userService = {
  getAlluser,
};
