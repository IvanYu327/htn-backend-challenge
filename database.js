import sqlite3 from "sqlite3";
// import fetch from "node-fetch";
import { USER_DATA } from "./HTN_2023_BE_Challenge_Data.js";

const DATABASE_SOURCE = "db.sqlite";

const db = new sqlite3.Database(DATABASE_SOURCE, (err) => {
  if (err) {
    console.error(`Error in initializing database. ${err}`);
    throw err;
  }
});

console.log("Connected to the SQLite database.");

db.serialize(() => {
  // db.run(`DROP TABLE IF EXISTS user;`, (err) => {
  //   if (err) console.log(`Failed to drop skill table if exists. Error: ${err}`);
  //   else console.log("User table dropped");
  // });

  // db.run(`DROP TABLE IF EXISTS skill;`, (err) => {
  //   if (err) console.log(`Failed to drop skill table if exists. Error: ${err}`);
  //   else console.log("Skill table dropped");
  // });

  db.run(
    `
    CREATE TABLE user (
      user_id integer PRIMARY KEY AUTOINCREMENT,
      name text NOT NULL,
      company text, 
      email text UNIQUE,
      phone text UNIQUE, 
      CONSTRAINT email_unique UNIQUE (email),
      CONSTRAINT phone_unique UNIQUE (phone)
    )
  `,
    (err) => {
      if (err) {
        console.log(err.message);
      } else {
        console.log("User table created.");
      }
    }
  );

  db.run(
    `
    CREATE TABLE skill (
      skill_id integer PRIMARY KEY AUTOINCREMENT,
      skill text NOT NULL,
      rating int NOT NULL, 
      user_id integer NOT NULL,
      FOREIGN KEY (user_id)
        REFERENCES user (user_id)
    )
  `,
    (err) => {
      if (err) {
        console.log(err.message);
      } else {
        console.log("Skills table created.");
        populateTables();
      }
    }
  );
});

const populateTables = () => {
  let BUSER_DATA = USER_DATA.slice(0, 5);
  console.log(`Populating the database with ${BUSER_DATA.length} objects`);

  const userInsert =
    "INSERT INTO user (name, company, email, phone) VALUES (?,?,?,?) RETURNING user_id";

  const skillInsert =
    "INSERT INTO skill (user_id, skill, rating) VALUES (?,?,?)";

  BUSER_DATA.forEach((user) => {
    db.serialize(() => {
      const userValues = [user.name, user.company, user.email, user.phone];

      db.run(userInsert, userValues);

      let userId;
      db.get(`SELECT last_insert_rowid()`, (err, row) => {
        if (err) console.log(`Insert failed for ${user}. ${err}`);
        userId = row["last_insert_rowid()"];
        // console.log(userId);

        db.parallelize(() => {
          user.skills.forEach((skill) => {
            // console.log(skill);
            const skillValues = [userId, skill.skill, skill.rating];
            db.run(skillInsert, skillValues);
          });
        });
      });
    });
  });
};

export default db;
