import { pool } from "../../database/db";

const getAlluser = async () => {
  const result = await pool.query(`
        SELECT id,name,role,email,phone FROM users
        `);
  return result;
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

export const userService = {
  getAlluser,
  updateUser
};
