import express from 'express';
import { changePassword, sendOtp, sendPurchaseConfirmation, sendResetPasswordCode, verifyOtp, verifyResetPasswordCode } from '../controllers/authController.js';

const router = express.Router();

router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/send-purchase-confirmation', sendPurchaseConfirmation);
router.post('/send-reset-password-code', sendResetPasswordCode);
router.post('/verify-reset-password-code', verifyResetPasswordCode);
router.post('/change-password', changePassword);


export default router;
