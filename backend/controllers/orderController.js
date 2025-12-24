import Order from '../models/Order.js';
import Cart from '../models/Cart.js';

export const createOrder = async (req, res) => {
    try {
        const { shippingAddress, paymentMethod } = req.body;

        if (!shippingAddress || !paymentMethod) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }

        const items = cart.items.map(item => ({
            product: item.product._id,
            name: item.product.name,
            price: item.product.price,
            quantity: item.quantity
        }));

        const total = items.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );

        const order = await Order.create({
            user: req.user._id,
            items,
            total,
            shippingAddress,
            paymentMethod,
            status: 'PENDING',
            paymentStatus: 'PENDING'
        });

        cart.items = [];
        await cart.save();

        res.status(201).json(order);
    } catch (error) {
        console.error('CREATE ORDER ERROR', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (error) {
        console.error('Get user orders error', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('user', 'username email');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (
            req.user.role !== 'ADMIN' &&
            order.user._id.toString() !== req.user._id.toString()
        ) {
            return res.status(403).json({ message: 'Access denied' });
        }

        res.status(200).json(order);
    } catch (error) {
        console.error('Get order by id error', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('user', 'username email')
            .sort({ createdAt: -1 });

        res.status(200).json(orders);
    } catch (error) {
        console.error('Get all orders error', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateOrder = async (req, res) => {
    try {
        const { status, paymentStatus } = req.body;

        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (status) order.status = status;
        if (paymentStatus) order.paymentStatus = paymentStatus;

        await order.save();
        res.status(200).json(order);
    } catch (error) {
        console.error('Update order error', error);
        res.status(500).json({ message: 'Server error' });
    }
};
