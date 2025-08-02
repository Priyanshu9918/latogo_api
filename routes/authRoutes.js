const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { register, login, updateUser,deleteUser,allUser,userInfo,forgotPassword,resetPassword } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.put('/update/:id', auth,updateUser);
router.delete('/delete/:id', auth,deleteUser);
router.get('/all_user', allUser);
router.get('/user_info/:id', auth,userInfo);
router.get('/forgot_password', auth,forgotPassword);
router.get('/reset_password/:token', auth,resetPassword);

module.exports = router;
