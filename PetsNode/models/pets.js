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
  // updateSpecies: async function (db, spiecesID, petID) {
  //   const q = `UPDATE pets SET species_ID= ? WHERE ID = ?;`
  //   return await db.query(q, [spiecesID, petID]);
  // },
  updateSpecies: async function (db, spiecesID, specieName) {
    const q = `UPDATE pets SET pets.species_ID = ?
    FROM pets JOIN species ON species.ID = pets.ID 
    WHERE species.name = '?';`;
    return await db.query(q, [spiecesID, petID]);
  },
  newestSpeciesID: async function (db){
    const q = `SELECT ID FROM species ORDER BY species.ID DESC LIMIT 1;`;
    const [results, fields] = await db.query(q);
    return [results[0].ID, fields];
  },
  deleteSpiece: async function (db, name) {
    const q = `DELETE FROM species WHERE name = ?;`;
    return await db.query(q, [name]);
  },
  diableKeyCheck: async function(db) {
  q = `SET FOREIGN_KEY_CHECKS=0;`;
  return await db.query(q);
  },
  enableKeyCheck: async function(db) {
  q = `SET FOREIGN_KEY_CHECKS=1;`;
  return await db.query(q);
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
