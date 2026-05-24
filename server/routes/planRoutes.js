const express = require('express');
const router = express.Router();
const db = require('../config/db');

// =========================================
// GET ALL PLANS
// =========================================

router.get('/', (req, res) => {

    db.query(
        'SELECT * FROM MembershipPlan',
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
// CREATE PLAN
// =========================================

router.post('/', (req, res) => {

    const {
        planName,
        planPrice,
        duration,
        description
    } = req.body;

    const sql = `
        INSERT INTO MembershipPlan
        (
            planName,
            planPrice,
            duration,
            description
        )
        VALUES (?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            planName,
            planPrice,
            duration,
            description
        ],
        (err, result) => {

            if (err) {
                res.send(err);
            } else {
                res.send('Plan Added');
            }
        }
    );
});

// =========================================
// UPDATE PLAN
// =========================================

router.put('/:id', (req, res) => {

    const { id } = req.params;

    const {
        planName,
        planPrice,
        duration,
        description
    } = req.body;

    const sql = `
        UPDATE MembershipPlan
        SET
            planName=?,
            planPrice=?,
            duration=?,
            description=?
        WHERE planID=?
    `;

    db.query(
        sql,
        [
            planName,
            planPrice,
            duration,
            description,
            id
        ],
        (err, result) => {

            if (err) {
                res.send(err);
            } else {
                res.send('Plan Updated');
            }
        }
    );
});

// =========================================
// DELETE PLAN
// =========================================

router.delete('/:id', (req, res) => {

    const { id } = req.params;

    db.query(
        'DELETE FROM MembershipPlan WHERE planID=?',
        [id],
        (err, result) => {

            if (err) {
                res.send(err);
            } else {
                res.send('Plan Deleted');
            }
        }
    );
});

module.exports = router;