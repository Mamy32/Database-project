const express = require("express");
const router = express.Router();
const db = require("../config/db");

// =========================================
// GET ALL ATTENDANCE
// =========================================

router.get("/", (req, res) => {

  db.query(
    "SELECT * FROM Attendance",
    (err, result) => {

      if (err) {
        res.send(err);
      } else {
        res.send(result);
      }
    }
  );
});

// =========================================
// CREATE ATTENDANCE
// =========================================

router.post("/", (req, res) => {

  const {
    memberID,
    classID,
    date,
    checkedIn,
  } = req.body;

  const sql = `
    INSERT INTO Attendance
    (
      memberID,
      classID,
      date,
      checkedIn
    )
    VALUES (?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      memberID,
      classID,
      date,
      checkedIn,
    ],
    (err, result) => {

      if (err) {

        console.log(err);
        res.send(err);

      } else {

        res.send("Attendance Added");
      }
    }
  );
});

// =========================================
// UPDATE ATTENDANCE
// =========================================

router.put("/:id", (req, res) => {

  const { id } = req.params;

  const {
    memberID,
    classID,
    date,
    checkedIn,
  } = req.body;

  const sql = `
    UPDATE Attendance
    SET
      memberID=?,
      classID=?,
      date=?,
      checkedIn=?
    WHERE attendanceID=?
  `;

  db.query(
    sql,
    [
      memberID,
      classID,
      date,
      checkedIn,
      id,
    ],
    (err, result) => {

      if (err) {

        console.log(err);
        res.send(err);

      } else {

        res.send("Attendance Updated");
      }
    }
  );
});

// =========================================
// DELETE ATTENDANCE
// =========================================

router.delete("/:id", (req, res) => {

  const { id } = req.params;

  db.query(
    "DELETE FROM Attendance WHERE attendanceID=?",
    [id],
    (err, result) => {

      if (err) {

        res.send(err);

      } else {

        res.send("Attendance Deleted");
      }
    }
  );
});

module.exports = router;