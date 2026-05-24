const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET
router.get('/', (req, res) => {

    db.query(
        'SELECT * FROM Trainer',
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
        trainerName,
        specialization,
        daysAvailable
    } = req.body;

    const sql = `
        INSERT INTO Trainer
        (trainerName, specialization, daysAvailable)
        VALUES (?, ?, ?)
    `;

    db.query(
        sql,
        [
            trainerName,
            specialization,
            daysAvailable
        ],
        (err, result) => {

            if (err) {
                res.send(err);
            } else {
                res.send('Trainer Added');
            }
        }
    );
});

// PUT
router.put('/:id', (req, res) => {

    const { id } = req.params;

    const {
        trainerName,
        specialization,
        daysAvailable
    } = req.body;

    const sql = `
        UPDATE Trainer
        SET
            trainerName=?,
            specialization=?,
            daysAvailable=?
        WHERE trainerID=?
    `;

    db.query(
        sql,
        [
            trainerName,
            specialization,
            daysAvailable,
            id
        ],
        (err, result) => {

            if (err) {
                res.send(err);
            } else {
                res.send('Trainer Updated');
            }
        }
    );
});

// DELETE
router.delete('/:id', (req, res) => {

    const { id } = req.params;

    db.query(
        'DELETE FROM Trainer WHERE trainerID=?',
        [id],
        (err, result) => {

            if (err) {
                res.send(err);
            } else {
                res.send('Trainer Deleted');
            }
        }
    );
});

module.exports = router;