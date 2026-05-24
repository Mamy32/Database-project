const express = require('express');
const router = express.Router();
const db = require('../config/db');

// =========================================
// GET ALL SCHEDULES
// =========================================

router.get('/', (req, res) => {

    db.query(
        'SELECT * FROM Schedule',
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
// CREATE SCHEDULE
// =========================================

router.post('/', (req, res) => {

    const {
        day,
        timeStart,
        timeEnd,
        duration,
        trainerID
    } = req.body;

    const sql = `
        INSERT INTO Schedule
        (
            day,
            timeStart,
            timeEnd,
            duration,
            trainerID
        )
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            day,
            timeStart,
            timeEnd,
            duration,
            trainerID
        ],
        (err, result) => {

            if (err) {
                res.send(err);
            } else {
                res.send('Schedule Added');
            }
        }
    );
});

// =========================================
// UPDATE SCHEDULE
// =========================================

router.put('/:id', (req, res) => {

    const { id } = req.params;

    const {
        day,
        timeStart,
        timeEnd,
        duration,
        trainerID
    } = req.body;

    const sql = `
        UPDATE Schedule
        SET
            day=?,
            timeStart=?,
            timeEnd=?,
            duration=?,
            trainerID=?
        WHERE scheduleID=?
    `;

    db.query(
        sql,
        [
            day,
            timeStart,
            timeEnd,
            duration,
            trainerID,
            id
        ],
        (err, result) => {

            if (err) {
                res.send(err);
            } else {
                res.send('Schedule Updated');
            }
        }
    );
});

// =========================================
// DELETE SCHEDULE
// =========================================

router.delete('/:id', (req, res) => {

    const { id } = req.params;

    db.query(
        'DELETE FROM Schedule WHERE scheduleID=?',
        [id],
        (err, result) => {

            if (err) {
                res.send(err);
            } else {
                res.send('Schedule Deleted');
            }
        }
    );
});

module.exports = router;