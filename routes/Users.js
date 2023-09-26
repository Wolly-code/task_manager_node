const { User, validate } = require('../models/User');
const mongoose = require('mongoose');
const express = require('express');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const auth = require('../middleware/auth');

router.get('/me', auth, async (req, res) => {
    const user = await User.findById(req.user._id).select('-password');
    res.send(user);

});


router.post('/register', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send("User already registered.")

    user = new User(_.pick(req.body, ["name", "email", "password"]));

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    await user.save();

    const token = user.generateAuthToken();

    // res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));
    res.header('x-auth-token', token).send(user);
});

router.post('/login', async (req, res) => {
    const { error } = validateLogin(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //Check if the user has email or not

    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send("User not found");

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send("Invalid email or password.");

    const token = user.generateAuthToken();

    res.send({ "token": token, "user": _.pick(user, ['_id', 'name', 'email']) });
})

function validateLogin(req) {
    try {
        const schema = Joi.object({
            email: Joi.string().min(5).max(255).required().email(),
            password: Joi.string().min(5).max(255).required(),
        });
        return schema.validate(req);
    } catch (error) {
        console.log(error);
    }
}

module.exports = router;