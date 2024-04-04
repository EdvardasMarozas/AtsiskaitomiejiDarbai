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
  getAllNewPets: async function (db) {
    const q = "SELECT * FROM pets ORDER BY created_at DESC";
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
  createSpecies: async function (db, specieName) {
    const q = "INSERT INTO species (name) VALUES (?)";
    const [result] = await db.query(q, [specieName]);
    if (result) {
      return result.insertId;
    } else {
      return false;
    }
  },
  updateNewPetSpecie: async function (db, spiecesID, petID) {
    const q = `UPDATE pets SET species_ID= ? WHERE ID = ?;`;
    return await db.query(q, [spiecesID, petID]);
  },
  updateSpecie: async function (db, specieName, petID) {
    const q = `UPDATE species SET name = ?
    WHERE ID = (SELECT species.ID FROM species 
    JOIN pets ON pets.species_ID = species.ID 
    WHERE pets.ID = ?);`;
    return await db.query(q, [specieName, petID]);
  },
  updateAllPetSpecies: async function (db, specieID, specieName) {
    const q = `UPDATE pets SET pets.species_ID = ?
      WHERE pets.ID IN (SELECT pets.ID FROM pets JOIN
      species ON species.ID = pets.species_ID WHERE
      species.name = ?);`;
    return await db.query(q, [specieID, specieName]);
  },
  newestSpeciesID: async function (db) {
    const q = `SELECT ID FROM species ORDER BY species.ID DESC LIMIT 1;`;
    const [results, fields] = await db.query(q);
    return [results[0].ID, fields];
  },
  deleteSpiece: async function (db, name, specieID) {
    const q = `DELETE FROM species WHERE name = ? AND ID <> ?;`;
    return await db.query(q, [name, specieID]);
  },
  getSpecieAmount: async function (db, name) {
    const q = `SELECT COUNT(name) as cnt FROM species WHERE name = ?;`;
    const [results, fields] = await db.query(q, [name]);
    return results[0].cnt;
  },
  diableKeyCheck: async function (db) {
    const q = `SET FOREIGN_KEY_CHECKS=0;`;
    return await db.query(q);
  },
  enableKeyCheck: async function (db) {
    const q = `SET FOREIGN_KEY_CHECKS=1;`;
    return await db.query(q);
  },
  getSpecie: async function (db, petID) {
    const q = `SELECT species.name FROM pets 
    JOIN species ON species.ID = pets.species_ID 
    WHERE pets.ID = ?;`;
    const [results, fields] = await db.query(q, [petID]);
    return results[0];
  },
  getPhoto: async function (db, petID) {
    const q = `SELECT image FROM pets WHERE ID = ?;`;
    const [results, fields] = await db.query(q, [petID]);
    return results[0].image;
  },
};
