import Product from '../models/productModel.js';
import Order from '../models/orderModel.js';

export const getAnalytics = async (req, res) => {
  try {
    // Get most viewed products
    const topProducts = await Product.find({})
      .sort({ views: -1 })
      .limit(5)
      .select('name views price')
      .lean();

    // Calculate conversion rate (orders / sessions)
    const totalSessions = await getTotalSessions(); // Implement this function
    const totalOrders = await Order.countDocuments();
    const conversionRate =
      totalSessions > 0 ? ((totalOrders / totalSessions) * 100).toFixed(2) : 0;

    // Get average session duration (in seconds)
    const avgSessionDuration = await getAvgSessionDuration(); // Implement this

    res.json({
      success: true,
      sessions: totalSessions,
      conversionRate,
      topProducts,
      avgSessionDuration,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching analytics: ' + error.message,
    });
  }
};

// Mock functions - replace with actual analytics implementation
const getTotalSessions = async () => {
  // In a real implementation, get this from Google Analytics or your tracking DB
  return 1240;
};

const getAvgSessionDuration = async () => {
  // In a real implementation, get this from Google Analytics or your tracking DB
  return 186; // seconds
};
