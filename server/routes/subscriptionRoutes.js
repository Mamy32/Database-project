const express = require('express');
const router = express.Router();
const db = require('../config/db');

// =========================================
// GET ALL SUBSCRIPTIONS
// =========================================

router.get('/', (req, res) => {

    db.query(
        'SELECT * FROM Subscription',
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
// CREATE SUBSCRIPTION
// =========================================

router.post('/', (req, res) => {

    const {
        memberID,
        planID,
        startDate,
        endDate,
        paymentAmount,
        paymentDate,
        method,
        status
    } = req.body;

    const sql = `
        INSERT INTO Subscription
        (
            memberID,
            planID,
            startDate,
            endDate,
            paymentAmount,
            paymentDate,
            method,
            status
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            memberID,
            planID,
            startDate,
            endDate,
            paymentAmount,
            paymentDate,
            method,
            status
        ],
        (err, result) => {

            if (err) {
                res.send(err);
            } else {
                res.send('Subscription Added');
            }
        }
    );
});

// =========================================
// UPDATE SUBSCRIPTION
// =========================================

router.put('/:id', (req, res) => {

    const { id } = req.params;

    const {
        memberID,
        planID,
        startDate,
        endDate,
        paymentAmount,
        paymentDate,
        method,
        status
    } = req.body;

    const sql = `
        UPDATE Subscription
        SET
            memberID=?,
            planID=?,
            startDate=?,
            endDate=?,
            paymentAmount=?,
            paymentDate=?,
            method=?,
            status=?
        WHERE subscriptionID=?
    `;

    db.query(
        sql,
        [
            memberID,
            planID,
            startDate,
            endDate,
            paymentAmount,
            paymentDate,
            method,
            status,
        ],
        (err, result) => {

            if (err) {
                res.send(err);
            } else {
                res.send('Subscription Updated');
            }
        }
    );
});

// =========================================
// DELETE SUBSCRIPTION
// =========================================

router.delete('/:id', (req, res) => {

    const { id } = req.params;

    db.query(
        'DELETE FROM Subscription WHERE subscriptionID=?',
        [id],
        (err, result) => {

            if (err) {
                res.send(err);
            } else {
                res.send('Subscription Deleted');
            }
        }
    );
});

module.exports = router;