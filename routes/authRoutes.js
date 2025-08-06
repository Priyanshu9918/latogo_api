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
router.post('/forgot_password', forgotPassword);
router.post('/reset_password/:token',resetPassword);

module.exports = router;
