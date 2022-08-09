const router = require('express').Router();

const {
    getAllUsers,
    getUserById,
    createUser,
} = require('../../controllers.userControllers.js');