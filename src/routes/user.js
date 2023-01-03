const express = require('express');
const { verifyToken, apiLimiter, verifyPermission } = require('../middlewares');
const router = express.Router();
const user = require('../services/user');

router.get('/', apiLimiter, verifyToken, verifyPermission(4), async function (req, res, next) {
    try {
        res.json(await user.getUsers(req.query.page));
    } catch (err) {

        console.error(`Error while getting users `, err.message);
        next(err);
    }
});

router.post('/', apiLimiter, async function (req, res, next) {
    try {
        res.json(await user.create(req.body));
    } catch (err) {
        console.error(`Error while creating user`, err.message);
        next(err);
    }
});

router.get('/:id', apiLimiter, verifyToken, verifyPermission(1), async function (req, res, next) {
    try {
        var result = await user.getUser(req.params.id);
        delete result.password;
        res.json(result);
    } catch (err) {
        console.error('Error while getting user', err.message);
        next(err);
    }
});


router.delete('/:id', apiLimiter, verifyToken, verifyPermission(1), async function (req, res, next) {
    try {
        res.json(await user.remove(req.params.id));
    } catch (err) {
        console.error('Error while deleting user', err.message);
        next(err);
    }
});

router.put('/:id', apiLimiter, verifyToken, verifyPermission(1), async function (req, res, next) {
    try {
        res.json(await user.update(req.params.id, req.body));
    } catch (err) {
        console.error(`Error while updating user`, err.message);
        next(err);
    }
});

module.exports = router;