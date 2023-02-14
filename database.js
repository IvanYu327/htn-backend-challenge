var sqlite3 = require("sqlite3").verbose();

const DATABASE_SOURCE = "db.sqlite";

let db = new sqlite3.Database(DATABASE_SOURCE, (err) => {
  if (err) {
    console.error(err.message);
    throw err;
  } else {
    console.log("Connected to the SQLite database.");
    db.run(``, (err) => {
      if (err) {
        console.log("Table already exists");
      } else {
        console.log("Creating entries");
        var insert = "INSERT INTO user (name, email, password) VALUES (?,?,?)";
        db.run(insert, []);
        db.run(insert, []);
      }
    });
  }
});

module.exports = db;
