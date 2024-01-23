module.exports = {
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
    const q = `SELECT COUNT(*) as answer FROM votes WHERE (pets1_ID = ?
          OR pets2_ID = ?);`;
    const [results, fields] = await db.query(q, [petID, petID]);
    return [results[0].answer, fields];
  },
  battlesWon: async function (db, petID) {
    const q = `SELECT COUNT(*) as answer FROM votes WHERE (pets1_ID = ?
          OR pets2_ID = ?) AND result = ?;`;
    const [results, fields] = await db.query(q, [petID, petID, petID]);
    return [results[0].answer, fields];
  },
  battlesDrawn: async function (db, petID) {
    const q = `SELECT COUNT(*) as answer FROM votes WHERE (pets1_ID = ?
          OR pets2_ID = ?) AND result = 'draw';`;
    const [results, fields] = await db.query(q, [petID, petID]);
    return [results[0].answer, fields];
  },
};
