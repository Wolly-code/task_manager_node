const jwt = require("jsonwebtoken")
const express = require('express');
const router = express.Router();

module.exports = function (req, res, next) { // Corrected order of req and res
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).send('Access denied. No token provided.');

    try {
        const decoded = jwt.verify(token, process.env.jwtPrivateKey);
        req.user = decoded;
        next();
    }
    catch (ex) {
        res.status(400).send('Invalid token.');
        console.log('Invalid token:', ex.message); // Log the error message for debugging
    }
}
