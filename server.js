import express from "express";
import db from "./database.js";
import validator from "validator";
import _ from "lodash";

const app = express();
const PORT = 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//All Users Endpoint
app.get("/users", (req, res, next) => {
  console.log("GET - /users");
  let offset = req.query.offset || "0";
  let limit = req.query.limit || "250";

  //Input Validation
  if (!validator.isInt(offset)) {
    res.status(400).json({ message: "Offsets must be integers" });
    return;
  }

  if (!validator.isInt(limit)) {
    res.status(400).json({ message: "Limits must be integers" });
    return;
  }

  limit = parseInt(limit) < 250 ? parseInt(limit) : 250;
  offset = parseInt(offset);
  let out;

  db.serialize(() => {
    const sql = `
      SELECT name, company, email, phone, is_registered
      FROM user
      ORDER BY id ASC
      LIMIT ? OFFSET ?`;

    db.all(sql, [limit, offset], (err, rows) => {
      if (err) {
        console.log(err);
        res.status(500).json({ message: "Something went wrong." });
        return;
      }

      if (!rows) {
        res.status(200).json({ message: "No user found" });
        return;
      }
      out = rows.map((row) => ({ ...row, skills: [] }));

      const skillSql = `
        SELECT skill, rating, user_id
        FROM skill
        WHERE user_id IN (
          SELECT id
          FROM user
          ORDER BY id ASC
          LIMIT ? OFFSET ?
        )
        ORDER BY user_id`;

      db.all(skillSql, [limit, offset], (err, rows) => {
        if (err) {
          console.log(err);
          res.status(500).json({ message: "Something went wrong." });
          return;
        }

        //Match skills to their user objects in order since we know both are sorted
        offset = rows[0].user_id;

        let userPointer = 0;
        let skillNum = rows[0].user_id;
        rows.forEach((row) => {
          if (row.user_id !== skillNum) {
            userPointer++;
            skillNum = row.user_id;
          }

          out[userPointer].skills.push({
            skill: row.skill,
            rating: row.rating,
          });
        });

        // Return data
        res.status(200).json({
          message: "success",
          data: out,
        });
        return;
      });
    });
  });
});

//User Information Endpoint
app.get("/users/:id", (req, res, next) => {
  let userID = req.params.id || "";
  console.log(`GET - /user/${userID}"`);

  //Input Validation
  if (!userID || !validator.isInt(userID)) {
    res
      .status(400)
      .json({ message: "User ID is required and must be an integer." });
    return;
  }

  userID = parseInt(userID);

  const userSql = `
      SELECT name, company, email, phone, is_registered
      FROM user
      WHERE id = ? `;

  const params = [userID];

  db.get(userSql, params, (err, row) => {
    if (err) {
      console.log(err);
      res.status(500).json({ message: "Something went wrong." });
      return;
    }

    if (!row) {
      res.status(200).json({ message: "No user found" });
      return;
    }

    let out = row;

    const skillSql = `
      SELECT skill, rating
      FROM skill
      WHERE user_id = ?`;

    db.all(skillSql, params, (err, rows) => {
      if (err) {
        console.log(err);
        res.status(500).json({ message: "Something went wrong." });
        return;
      }

      out.skills = rows;

      res.status(200).json({
        message: "success",
        data: out,
      });
      return;
    });
  });
});

//Updating User Data Endpoint
app.put("/users/:id", (req, res, next) => {
  //Input Validation
  //TODO: Validate that no other key value pairs are there
  let userID = req.params.id;
  let updatedName = req.body.name;
  let updatedCompany = req.body.company;
  let updatedEmail = req.body.email;
  let updatedPhone = req.body.phone;
  let updatedSkills = req.body.skills;

  //Input Validation
  if (!userID || !validator.isInt(userID)) {
    res
      .status(400)
      .json({ message: "User IDs is required and must be an integer." });
    return;
  }
  userID = parseInt(req.params.id);

  if (updatedName && !_.isString(updatedName)) {
    res.status(400).json({ message: "Names must be a string." });
    return;
  }

  if (updatedCompany && !_.isString(updatedCompany)) {
    res.status(400).json({ message: "Company must be a string." });
    return;
  }

  if (updatedEmail && !validator.isEmail(email)) {
    res.status(400).json({ message: "Invalid email." });
    return;
  }

  if (updatedPhone && !_.isString(updatedPhone)) {
    res.status(400).json({ message: "Phone number must be a string." });
    return;
  }

  if (updatedSkills)
    updatedSkills.forEach((skill) => {
      if (
        !skill.skill ||
        !skill.rating ||
        !_.isString(skill.skill) ||
        !validator.isInt(skill.rating + "") ||
        skill.rating > 5 ||
        skill.rating < 1
      ) {
        res.status(400).json({ message: "Improper skill object as input." });
        return;
      }
    });
  //TODO: UPDATE SKILLS

  const sql = `
    UPDATE user 
    SET 
    name = COALESCE(?,name), 
    company = COALESCE(?,company),
    email = COALESCE(?,email), 
    phone = COALESCE(?,phone) 
    WHERE id = ?`;

  const params = [
    updatedName,
    updatedCompany,
    updatedEmail,
    updatedPhone,
    userID,
  ];

  db.run(sql, params, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json({ message: "Something went wrong." });
      return;
    }
    // If there are no skills to update, return a success message
    if (!updatedSkills) {
      res.status(200).json({
        message: "success",
      });
      return;
    }

    const updateSkillsSql = `
      INSERT INTO skill (skill, rating, user_id)
      VALUES (?, ?, ?)
      ON CONFLICT (user_id, skill)
      DO UPDATE SET rating = excluded.rating;
    `;

    let error;
    for (let i = 0; i < updatedSkills.length; i++) {
      let skill = updatedSkills[i];
      const params = [skill.skill, skill.rating, userID];

      db.run(updateSkillsSql, params, (err, result) => {
        if (err) {
          error = err;
          console.log(err);
        }

        //At the last skill, return
        if (i === updatedSkills.length - 1) {
          if (error) {
            res.status(500).json({ message: "Something went wrong." });
            return;
          }

          res.status(200).json({
            message: "success",
            result: result,
          });
          return;
        }
      });
    }
  });
});

// //Delete user endpoint, unfinished with a bug somewhere.
//
// app.delete("/user/:id", (req, res, next) => {
//   let userID = req.params.id || "";
//   console.log(`DELETE - /users/"${userID}"`);

//   //Input Validation
//   if (!validator.isInt(userID)) {
//     console.log("\tInvalid Input");
//     res
//       .status(400)
//       .json({ message: "Invalid user ID format, user IDs are integers" });
//     return;
//   }

//   userID = parseInt(userID);

//   const sql = `DELETE user, skill
//     FROM user
//     INNER JOIN skill
//     ON user.id = skill.user_id
//     WHERE id = ?`;

//   db.run(sql, userID, function (err, result) {
//     if (err) {
//       console.log(err);
//       res.status(500).json({ message: "Something went wrong." });
//       return;
//     }
//     res.json({ message: "deleted", changes: this.changes });
//   });
// });

//Registration Endpoint
app.put("/users/register/:id", (req, res, next) => {
  let userID = req.params.id || "";
  console.log(`PUT - /user/register/${userID}"`);

  //Input Validation
  if (!userID || !validator.isInt(userID)) {
    res
      .status(400)
      .json({ message: "User ID is required and must be an integer." });
    return;
  }

  userID = parseInt(userID);

  const sql = `
    UPDATE user 
    SET 
    is_registered = 1
    WHERE id = ?`;
  const params = [userID];

  db.run(sql, params, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json({ message: "Something went wrong." });
      return;
    }

    res.status(200).json({
      message: "success",
    });
    return;
  });
});

//Skills Endpoints
app.get("/skills/:skill", (req, res, next) => {
  let skillQuery = req.params.skill;
  console.log(`GET - /skills/${skillQuery}"`);

  if (!_.isString(skillQuery)) {
    res.status(400).json({ message: "Skill names must be a string." });
    return;
  }

  skillQuery = skillQuery.toLowerCase();

  const sql = `
    SELECT COUNT(*)
    FROM skill
    WHERE LOWER(skill) = ?`;

  db.get(sql, [skillQuery], (err, count) => {
    if (err) {
      console.log(err);
      res.status(500).json({ message: "Something went wrong." });
      return;
    }
    res.status(200).json({
      message: "success",
      count: count["COUNT(*)"],
    });
  });
});

//Skill Frequency Range Endpoint
app.get("/skills/", (req, res, next) => {
  let min = req.query.min_frequency;
  let max = req.query.max_frequency;
  console.log(`GET - /skills/${(min, max)}"`);

  if (min && !validator.isInt(min)) {
    res.status(400).json({ message: "Min frequency must be an integer." });
    return;
  }
  if (min) min = parseInt(min);

  if (max && !validator.isInt(max)) {
    res.status(400).json({ message: "Max frequency must be an integer." });
    return;
  }
  if (max) max = parseInt(max);

  if (min > max || min < 0 || max < 0) {
    res.status(400).json({
      message: "The minimum cannot be smaller than the maximum frequency",
    });
    return;
  }

  const sql = `
      SELECT skill
      FROM (
        SELECT skill, COUNT(*) AS frequency
        FROM skill
        GROUP BY skill
      )
      WHERE (frequency >= ? OR ? IS NULL)
        AND (frequency <= ? OR ? IS NULL)`;

  db.all(sql, [min, min, max, max], (err, skills) => {
    if (err) {
      console.log(err);
      res.status(500).json({ message: "Something went wrong." });
      return;
    }

    skills = skills.map((skill) => skill.skill);

    res.status(200).json({
      message: "success",
      data: skills,
    });
  });
});

// Root endpoint
app.use("/", (req, res, next) => {
  res.status(200).json({ message: "pong" });
});

// Start server
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);

export const server = app;
