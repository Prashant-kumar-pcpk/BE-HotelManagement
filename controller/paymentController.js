const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Booking = require('../models/Booking');

// Create payment intent
const createPaymentIntent = async (req, res) => {
    try {
        const { amount, currency = 'usd', bookingData } = req.body;

        // Create a PaymentIntent with the order amount and currency
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Convert to cents
            currency: currency,
            automatic_payment_methods: {
                enabled: true,
            },
            metadata: {
                bookingData: JSON.stringify(bookingData)
            }
        });

        res.json({
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id
        });
    } catch (error) {
        console.error('Error creating payment intent:', error);
        res.status(500).json({ error: 'Failed to create payment intent' });
    }
};

// Confirm payment and create booking
const confirmPayment = async (req, res) => {
    try {
        const { paymentIntentId, bookingData, userId } = req.body;

        // Verify payment status with Stripe
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

        if (paymentIntent.status === 'succeeded') {
            // Create booking record
            const booking = new Booking({
                user: userId,
                room: bookingData.room,
                guestInfo: bookingData.guestInfo,
                checkInDate: new Date(bookingData.checkInDate),
                checkOutDate: new Date(bookingData.checkOutDate),
                totalAmount: bookingData.totalAmount,
                paymentStatus: 'paid',
                stripePaymentIntentId: paymentIntentId,
                bookingStatus: 'confirmed'
            });

            await booking.save();

            res.json({
                success: true,
                booking: booking,
                message: 'Payment confirmed and booking created successfully'
            });
        } else {
            res.status(400).json({
                success: false,
                message: 'Payment not completed'
            });
        }
    } catch (error) {
        console.error('Error confirming payment:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to confirm payment'
        });
    }
};

// Get booking by ID
const getBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id).populate('user', 'name email');
        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }
        res.json(booking);
    } catch (error) {
        console.error('Error fetching booking:', error);
        res.status(500).json({ error: 'Failed to fetch booking' });
    }
};

// Get user's bookings
const getUserBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.params.userId })
            .sort({ createdAt: -1 })
            .populate('user', 'name email');
        res.json(bookings);
    } catch (error) {
        console.error('Error fetching user bookings:', error);
        res.status(500).json({ error: 'Failed to fetch bookings' });
    }
};

// UPI Payment (simulated for demo)
const processUPIPayment = async (req, res) => {
    try {
        const { upiId, amount, bookingData } = req.body;

        // Validate UPI ID format (basic validation)
        const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/;
        if (!upiRegex.test(upiId)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid UPI ID format'
            });
        }

        // Simulate UPI payment processing
        // In a real implementation, you would integrate with UPI payment gateway
        const paymentSuccess = Math.random() > 0.2; // 80% success rate for demo

        if (paymentSuccess) {
            // Create booking record
            const booking = new Booking({
                user: 'guest', // For demo purposes
                room: bookingData.room,
                guestInfo: bookingData.guestInfo,
                checkInDate: new Date(bookingData.checkInDate),
                checkOutDate: new Date(bookingData.checkOutDate),
                totalAmount: bookingData.totalAmount,
                paymentStatus: 'paid',
                stripePaymentIntentId: `upi_${Date.now()}`, // Mock UPI transaction ID
                bookingStatus: 'confirmed'
            });

            await booking.save();

            res.json({
                success: true,
                booking: booking,
                message: 'UPI payment successful and booking created',
                transactionId: `UPI${Date.now()}`
            });
        } else {
            res.status(400).json({
                success: false,
                error: 'UPI payment failed. Please try again.'
            });
        }
    } catch (error) {
        console.error('Error processing UPI payment:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to process UPI payment'
        });
    }
};

module.exports = {
    createPaymentIntent,
    confirmPayment,
    getBooking,
    getUserBookings,
    processUPIPayment
};