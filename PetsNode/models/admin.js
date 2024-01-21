module.exports = {
  getAll: async function (db) {
    const q = "SELECT id, email FROM admin";
    return await db.query(q);
  },
  getById: async function (db, id) {
    const q = "SELECT * FROM admin WHERE id = ? LIMIT 1";
    const [results, fields] = await db.query(q, [id]);
    return [results[0], fields];
  },
  getByEmail: async function (db, email) {
    const q = "SELECT * FROM admin WHERE email = ? LIMIT 1";
    const [results, fields] = await db.query(q, [email]);
    return [results[0], fields];
  },
  create: async function (db, data) {
    const q = "INSERT INTO admin (email, password) VALUES (?, ?)";
    const [result] = await db.query(q, [data.email, data.password]);
    if (result) {
      return result.insertId;
    } else {
      return false;
    }
  },
  updatePassword: async function (db, id, password) {
    const q = "UPDATE admin SET password = ? WHERE id = ?";
    return await db.query(q, [password, id]);
  },
  delete: async function (db, id) {
    const q = "DELETE FROM admin WHERE id = ?";
    return await db.query(q, [id]);
  },
};
