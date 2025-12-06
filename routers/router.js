import {Router} from 'express'
import UserController from "../controllers/user-controller.js";

const router = new Router()

router.post('/registration', UserController.registration);
router.post('/login', UserController.login);
router.post('/logout', UserController.logout);
router.get('/activated/:link', UserController.activated);
router.get('/refresh', UserController.refresh);
router.get('/users', UserController.getAllUsers);

export default router;
