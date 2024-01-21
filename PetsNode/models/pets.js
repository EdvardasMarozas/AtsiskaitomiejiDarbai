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
  update: async function (db, id, data) {
    const q = "UPDATE pets SET name = ?, email = ? WHERE id = ?";
    return await db.query(q, [data.name, data.email, id]);
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
  // updatePetSpecies: async function (db, specieName, specieID, petID) {
  //   const q = `UPDATE pets SET pets.species_ID =
  //   (SELECT species.ID FROM species WHERE species.name = ? AND species.ID = ?)
  //    WHERE pets.ID = ?;`;
  //   return await db.query(q, [specieName, specieID,  petID]);
  // },
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
    return results[0].name;
  },
  getRandomID: async function (db) {
    const q = `SELECT ID FROM pets ORDER BY RAND() LIMIT 2;`;
    const [results, fields] = await db.query(q);
    return [results, fields];
  },
  createBattle: async function (db, pet1ID, pet2ID, votesResult) {
    const q = `INSERT INTO votes (pets1_ID, pets2_ID, result) VALUES (?, ?, ?)`;
    const [result] = await db.query(q, [pet1ID, pet2ID, votesResult]);
    if (result) {
      return result.insertId;
    } else {
      return false;
    }
  },
  battleStats: async function (db, pet1ID, pet2ID) {
    const q = `SELECT DISTINCT ABS(ROUND((SELECT COUNT(*) 
    FROM votes WHERE result = ?)*100/((SELECT COUNT(*) 
    FROM votes WHERE result = ?) + 
    (SELECT COUNT(*) FROM votes WHERE result = ?)), 0)) AS answer FROM votes;`;
    const [results, fields] = await db.query(q, [pet1ID, pet1ID, pet2ID]);
    return [results[0].answer, fields];
  },
  totalBattles: async function (db, petID) {
    const q = `SELECT COUNT(*) as answer FROM votes WHERE (pets1_ID = ? OR pets2_ID = ?);`;
    const [results, fields] = await db.query(q, [petID, petID]);
    return [results[0].answer, fields];
  },
  battlesWon: async function (db, petID) {
    const q = `SELECT COUNT(*) as answer FROM votes WHERE (pets1_ID = ? OR pets2_ID = ?) AND result = ?;`;
    const [results, fields] = await db.query(q, [petID, petID, petID]);
    return [results[0].answer, fields];
  },
  battlesDrawn: async function (db, petID) {
    const q = `SELECT COUNT(*) as answer FROM votes WHERE (pets1_ID = ? OR pets2_ID = ?) AND result = 'draw';`;
    const [results, fields] = await db.query(q, [petID, petID]);
    return [results[0].answer, fields];
  },
};
