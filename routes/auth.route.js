const Router = require('express').Router;
const AuthController = require('../controllers/auth.controller');

const router = module.exports = new Router();

/**
 * Sign up
 */
router.post('/signup', AuthController.signup);

/**
 * Login
 */
router.post('/login', AuthController.login);
