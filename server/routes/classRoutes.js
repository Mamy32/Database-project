const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET
router.get('/', (req, res) => {

    db.query(
        'SELECT * FROM Class',
        (err, result) => {

            if (err) {
                res.send(err);
            } else {
                res.send(result);
            }
        }
    );
});

// POST
router.post('/', (req, res) => {

    const {
        className,
        trainerID,
        scheduleID,
        maxCapacity
    } = req.body;

    const sql = `
        INSERT INTO Class
        (className, trainerID, scheduleID, maxCapacity)
        VALUES (?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            className,
            trainerID,
            scheduleID,
            maxCapacity
        ],
        (err, result) => {

            if (err) {
                res.send(err);
            } else {
                res.send('Class Added');
            }
        }
    );
});

// PUT
router.put('/:id', (req, res) => {

    const { id } = req.params;

    const {
        className,
        trainerID,
        scheduleID,
        maxCapacity
    } = req.body;

    const sql = `
        UPDATE Class
        SET
            className=?,
            trainerID=?,
            scheduleID=?,
            maxCapacity=?
        WHERE classID=?
    `;

    db.query(
        sql,
        [
            className,
            trainerID,
            scheduleID,
            maxCapacity,
            id
        ],
        (err, result) => {

            if (err) {
                res.send(err);
            } else {
                res.send('Class Updated');
            }
        }
    );
});

// DELETE
router.delete('/:id', (req, res) => {

    const { id } = req.params;

    db.query(
        'DELETE FROM Class WHERE classID=?',
        [id],
        (err, result) => {

            if (err) {
                res.send(err);
            } else {
                res.send('Class Deleted');
            }
        }
    );
});

module.exports = router;