module.exports = {
  getById: async function (db, id) {
    const q = "SELECT * FROM pets WHERE id = ?";
    const [results, fields] = await db.query(q, [id]);
    return [results[0], fields];
  },
  getAll: async function (db) {
    const q = "SELECT * FROM pets";
    return await db.query(q);
  },
  create: async function (db, data) {
    const q = "INSERT INTO pets (image, name, email) VALUES (?, ?, ?)";
    const [result] = await db.query(q, [data.image, data.name, data.email]);
    if (result) {
      return result.insertId;
    } else {
      return false;
    }
  },
  updateImage: async function (db, id, path) {
    const q = "UPDATE pets SET image = ? WHERE id = ?";
    return await db.query(q, [path, id]);
  },
  delete: async function (db, id) {
    const q = "DELETE FROM pets WHERE id = ?";
    return await db.query(q, [id]);
  },
  createSpecies: async function (db, data) {
    const q = "INSERT INTO species (name) VALUES (?)";
    const [result] = await db.query(q, [data.name]);
    if (result) {
      return result.insertId;
    } else {
      return false;
    }
  },
  updateSpecies: async function (db, spiecesData, petID) {
    const q = `UPDATE pets
              INNER JOIN  species  
              ON species.ID = pets.species_ID  
              SET pets.species_ID = species.ID
              WHERE species.name = ? AND pets.ID = ?`;
    return await db.query(q, [spiecesData.name, petID]);
  },
  showSpecies: async function (db, data){
    const q = `SELECT species.name FROM pets
               INNER JOIN species
               ON species.ID = pets`;
    return await db.query(q, [])
  },
  getRandomID: async function (db) {
    const q = `SELECT ID FROM pets ORDER BY RAND() LIMIT 2;`;
    const [results, fields] = await db.query(q);
    return [results, fields];
  },
  createBattle: async function (db, pet1ID, pet2ID, votesResult){
    const q = `INSERT INTO votes (pets1_ID, pets2_ID, result) VALUES (?, ?, ?)`;
    const [result] = await db.query(q, [pet1ID, pet2ID, votesResult]);
    if (result) {
      return result.insertId;
    } else {
      return false;
    }
  }
};
