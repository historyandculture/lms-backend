const express = require('express');
const { verifyToken, apiLimiter, verifyPermission } = require('../middlewares');
const { getTodo, updateTodo } = require('../services/todo');
const router = express.Router();

router.get('/:id', apiLimiter, verifyToken, verifyPermission(1), async function (req, res, next) {
    try {
        let data = await getTodo(req.params.id);
        res.json(JSON.parse(data));
    } catch (err) {
        console.error(`Error while getting todo data`, err.message);
        next(err);
    }
});

router.post('/:id', apiLimiter, verifyToken, verifyPermission(1), async function (req, res, next) {
    try {
        await updateTodo(req.params.id, (data) => {
            res.json(data);
        });
    } catch (err) {
        console.error(`Error while creating todo data`, err.message);
        next(err);
    }
});

module.exports = router;