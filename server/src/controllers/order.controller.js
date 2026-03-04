const prisma = require('../prismaClient');

// Create Order
const createOrder = async (req, res) => {
    try {
        const { userId, total, status, items } = req.body;
        const order = await prisma.order.create({
            data: {
                userId,
                total,
                status: status || 'PENDING',
                items: {
                    create: items && items.length > 0 ? items.map(item => ({
                        productId: item.productId,
                        quantity: item.quantity
                    })) : []
                }
            },
            include: {
                items: true
            }
        });
        res.status(201).json(order);
    } catch (error) {
        res.status(400).json({ error: 'Failed to create order' });
    }
};

// Get all Orders
const getOrders = async (req, res) => {
    try {
        const orders = await prisma.order.findMany({
            include: {
                items: true
            }
        });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
};

// Get Order by ID
const getOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await prisma.order.findUnique({
            where: { id: parseInt(id) },
            include: { user: true, items: true }
        });
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        res.json(order);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch order' });
    }
};

// Update Order status
const updateOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const order = await prisma.order.update({
            where: { id: parseInt(id) },
            data: { status }
        });
        res.json(order);
    } catch (error) {
        res.status(400).json({ error: 'Failed to update order' });
    }
};

// Delete Order and associated items
const deleteOrder = async (req, res) => {
    try {
        const { id } = req.params;
        // Delete associated order items first due to foreign key constraints without cascade
        await prisma.orderItem.deleteMany({
            where: { orderId: parseInt(id) }
        });

        // Delete the order itself
        await prisma.order.delete({
            where: { id: parseInt(id) }
        });

        res.status(204).send();
    } catch (error) {
        res.status(400).json({ error: 'Failed to delete order' });
    }
};

module.exports = {
    createOrder,
    getOrders,
    getOrderById,
    updateOrder,
    deleteOrder
};
