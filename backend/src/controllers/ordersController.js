// backend/src/controllers/ordersController.js
const Order = require('../models/orderModel');

// Get total sales over time
const getTotalSalesOverTime = async (req, res) => {
    try {
        const { interval } = req.query; // daily, monthly, quarterly, yearly

        let groupBy;
        switch (interval) {
            case 'daily':
                groupBy = { $dateToString: { format: "%Y-%m-%d", date: "$created_at" } };
                break;
            case 'monthly':
                groupBy = { $dateToString: { format: "%Y-%m", date: "$created_at" } };
                break;
            case 'quarterly':
                groupBy = { $concat: [{ $toString: { $year: "$created_at" } }, "-Q", { $toString: { $ceil: { $divide: [{ $month: "$created_at" }, 3] } } }] };
                break;
            case 'yearly':
                groupBy = { $dateToString: { format: "%Y", date: "$created_at" } };
                break;
            default:
                return res.status(400).json({ message: "Invalid interval" });
        }

        const salesData = await Order.aggregate([
            {
                $group: {
                    _id: groupBy,
                    totalSales: { $sum: { $toDouble: "$total_price_set.shop_money.amount" } },
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);

        res.json(salesData);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get sales growth rate over time
const getSalesGrowthRateOverTime = async (req, res) => {
    try {
        const { interval } = req.query; // daily, monthly, quarterly, yearly

        let groupBy;
        switch (interval) {
            case 'daily':
                groupBy = { $dateToString: { format: "%Y-%m-%d", date: "$created_at" } };
                break;
            case 'monthly':
                groupBy = { $dateToString: { format: "%Y-%m", date: "$created_at" } };
                break;
            case 'quarterly':
                groupBy = { $concat: [{ $toString: { $year: "$created_at" } }, "-Q", { $toString: { $ceil: { $divide: [{ $month: "$created_at" }, 3] } } }] };
                break;
            case 'yearly':
                groupBy = { $dateToString: { format: "%Y", date: "$created_at" } };
                break;
            default:
                return res.status(400).json({ message: "Invalid interval" });
        }

        const salesData = await Order.aggregate([
            {
                $group: {
                    _id: groupBy,
                    totalSales: { $sum: { $toDouble: "$total_price_set.shop_money.amount" } },
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);

        let growthRates = [];
        for (let i = 1; i < salesData.length; i++) {
            const growthRate = ((salesData[i].totalSales - salesData[i - 1].totalSales) / salesData[i - 1].totalSales) * 100;
            growthRates.push({
                period: salesData[i]._id,
                growthRate: growthRate.toFixed(2),
            });
        }

        res.json(growthRates);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get number of repeat customers over time
const getNumberOfRepeatCustomers = async (req, res) => {
    try {
        const { interval } = req.query; // daily, monthly, quarterly, yearly

        let groupBy;
        switch (interval) {
            case 'daily':
                groupBy = { $dateToString: { format: "%Y-%m-%d", date: "$created_at" } };
                break;
            case 'monthly':
                groupBy = { $dateToString: { format: "%Y-%m", date: "$created_at" } };
                break;
            case 'quarterly':
                groupBy = { $concat: [{ $toString: { $year: "$created_at" } }, "-Q", { $toString: { $ceil: { $divide: [{ $month: "$created_at" }, 3] } } }] };
                break;
            case 'yearly':
                groupBy = { $dateToString: { format: "%Y", date: "$created_at" } };
                break;
            default:
                return res.status(400).json({ message: "Invalid interval" });
        }

        const repeatCustomersData = await Order.aggregate([
            {
                $group: {
                    _id: { customer: "$customer", groupBy },
                    orderCount: { $sum: 1 }
                }
            },
            {
                $match: { orderCount: { $gt: 1 } }
            },
            {
                $group: {
                    _id: "$_id.groupBy",
                    repeatCustomers: { $sum: 1 }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);

        res.json(repeatCustomersData);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    getTotalSalesOverTime,
    getSalesGrowthRateOverTime,
    getNumberOfRepeatCustomers,
};
