const express = require('express');
const router = express.Router();
const db = require('../config/db');

// =========================================
// GET MEMBERS
// =========================================

router.get('/', (req, res) => {

    db.query(
        'SELECT * FROM Member',
        (err, result) => {

            if (err) {
                console.log(err);
                res.send(err);

            } else {

                res.send(result);
            }
        }
    );
});

// =========================================
// CREATE MEMBER
// =========================================

router.post('/', (req, res) => {

    const {
        firstName,
        lastName,
        age,
        gender,
        phoneNo,
        email
    } = req.body;

    const sql = `
        INSERT INTO Member
        (
            firstName,
            lastName,
            age,
            gender,
            phoneNo,
            email
        )
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            firstName,
            lastName,
            age,
            gender,
            phoneNo,
            email
        ],
        (err, result) => {

            if (err) {

                console.log(err);
                res.send(err);

            } else {

                res.send('Member Added');
            }
        }
    );
});

// =========================================
// UPDATE MEMBER
// =========================================

router.put('/:id', (req, res) => {

    const { id } = req.params;

    const {
        firstName,
        lastName,
        age,
        gender,
        phoneNo,
        email
    } = req.body;

    const sql = `
        UPDATE Member
        SET
            firstName=?,
            lastName=?,
            age=?,
            gender=?,
            phoneNo=?,
            email=?
        WHERE memberID=?
    `;

    db.query(
        sql,
        [
            firstName,
            lastName,
            age,
            gender,
            phoneNo,
            email,
            id
        ],
        (err, result) => {

            if (err) {

                console.log(err);
                res.send(err);

            } else {

                res.send('Member Updated');
            }
        }
    );
});

// =========================================
// DELETE MEMBER
// =========================================

router.delete('/:id', (req, res) => {

    const { id } = req.params;

    db.query(
        'DELETE FROM Member WHERE memberID=?',
        [id],
        (err, result) => {

            if (err) {

                console.log(err);
                res.send(err);

            } else {

                res.send('Member Deleted');
            }
        }
    );
});

module.exports = router;