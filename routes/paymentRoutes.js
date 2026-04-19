const express = require('express');
const router = express.Router();
const {
    createPaymentIntent,
    confirmPayment,
    getBooking,
    getUserBookings,
    processUPIPayment
} = require('../controller/paymentController');

// Create payment intent
router.post('/create-payment-intent', createPaymentIntent);

// Confirm payment and create booking
router.post('/confirm-payment', confirmPayment);

// Get booking by ID
router.get('/booking/:id', getBooking);

// Get user's bookings
router.get('/user/:userId/bookings', getUserBookings);

// Process UPI payment
router.post('/upi-payment', processUPIPayment);

module.exports = router;