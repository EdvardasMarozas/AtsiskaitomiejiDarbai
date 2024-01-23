module.exports = {
  mostWinning: async function (db) {
    const q = `SELECT pets.ID, (ROUND(COUNT(result)*100/(SELECT COUNT(*) 
    FROM votes WHERE (pets1_ID = pets.ID OR pets2_ID = pets.ID))))
    AS winprocent FROM votes INNER JOIN pets ON pets.ID = votes.pets1_ID 
    WHERE result <> 'draw' GROUP BY pets.ID  ORDER BY winprocent DESC;`;
    const [results, fields] = await db.query(q);
    return [results, fields];
  },
  mostLosing: async function (db) {
    const q = `SELECT pets.ID, ROUND(((SELECT COUNT(*) 
    FROM votes WHERE (pets1_ID = pets.ID OR pets2_ID = pets.ID))-
    COUNT(result)-(SELECT COUNT(*) FROM votes WHERE 
    (pets1_ID = pets.ID OR pets2_ID = pets.ID) AND result = 'draw'))*100/(SELECT COUNT(*) 
    FROM votes WHERE (pets1_ID = pets.ID OR pets2_ID = pets.ID)))
    AS loseprocent FROM votes INNER JOIN pets ON pets.ID = votes.pets1_ID 
    WHERE result <> 'draw' GROUP BY pets.ID  ORDER BY loseprocent DESC;`;
    const [results, fields] = await db.query(q);
    return [results, fields];
  },
  mostPeacefull: async function (db) {
    const q = `SELECT pets.ID, ROUND((SELECT COUNT(*) FROM votes WHERE
    (pets1_ID = pets.ID OR pets2_ID = pets.ID) AND result = 'draw')*100/(SELECT COUNT(*) 
    FROM votes WHERE (pets1_ID = pets.ID OR pets2_ID = pets.ID)))
    AS tiedprocent FROM votes INNER JOIN pets ON pets.ID = votes.pets1_ID 
    WHERE result <> 'draw' GROUP BY pets.ID  ORDER BY tiedprocent DESC;`;
    const [results, fields] = await db.query(q);
    return [results, fields];
  },
  winnerOfTheWeek: async function (db) {
    const q = `SELECT pets.ID, (ROUND(COUNT(result)*100/(SELECT COUNT(*) 
    FROM votes WHERE (pets1_ID = pets.ID OR pets2_ID = pets.ID))))
    AS winprocent FROM votes INNER JOIN pets ON pets.ID = votes.pets1_ID 
    WHERE result <> 'draw' AND week(votes.created_at) = week(CURRENT_DATE)
    GROUP BY pets.ID  ORDER BY winprocent DESC;`;
    const [results, fields] = await db.query(q);
    return results[0];
  },
  winnerOfTheMonth: async function (db) {
    const q = `SELECT pets.ID, (ROUND(COUNT(result)*100/(SELECT COUNT(*) 
    FROM votes WHERE (pets1_ID = pets.ID OR pets2_ID = pets.ID))))
    AS winprocent FROM votes INNER JOIN pets ON pets.ID = votes.pets1_ID 
    WHERE result <> 'draw' AND month(votes.created_at) = month(CURRENT_DATE)
    GROUP BY pets.ID  ORDER BY winprocent DESC;`;
    const [results, fields] = await db.query(q);
    return results[0];
  },
  winnerOfTheYear: async function (db) {
    const q = `SELECT pets.ID, (ROUND(COUNT(result)*100/(SELECT COUNT(*) 
    FROM votes WHERE (pets1_ID = pets.ID OR pets2_ID = pets.ID))))
    AS winprocent FROM votes INNER JOIN pets ON pets.ID = votes.pets1_ID 
    WHERE result <> 'draw' AND year(votes.created_at) = year(CURRENT_DATE)
    GROUP BY pets.ID  ORDER BY winprocent DESC;`;
    const [results, fields] = await db.query(q);
    return results[0];
  },
};
