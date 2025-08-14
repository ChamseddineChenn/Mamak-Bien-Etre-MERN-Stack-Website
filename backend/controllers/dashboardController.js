// controllers/dashboardController.js
import Order from '../models/orderModel.js';
import Newsletter from '../models/newsletterModel.js';

export const getDashboardStats = async (req, res) => {
  try {
    const [orders, revenue, subscribers] = await Promise.all([
      Order.countDocuments(),
      Order.aggregate([
        { $match: { status: 'delivered' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ]),
      Newsletter.countDocuments(),
    ]);

    res.json({
      success: true,
      orders: orders,
      revenue: revenue[0]?.total || 0,
      subscribers: subscribers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching stats: ' + error.message,
    });
  }
};
