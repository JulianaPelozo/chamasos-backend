import { Router } from 'express';
import { registerLogin, login, getAllLogins, getLoginById } from '../Controllers/userController';

const router = Router();

router.post('/register', registerLogin);
router.post('/login', login);
router.get('/listalogins', getAllLogins);        
router.get('/logins/:id', getLoginById);   

export default router;