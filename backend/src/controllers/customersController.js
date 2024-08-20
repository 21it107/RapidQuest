// backend/src/controllers/customersController.js
const Customer = require('../models/customerModel');
const Order = require('../models/orderModel');

// Get new customers added over time
const getNewCustomersOverTime = async (req, res) => {
    try {
        const { interval } = req.query; // daily, monthly, quarterly, yearly

        const groupBy = {
            daily: { $dateToString: { format: "%Y-%m-%d", date: "$created_at" } },
            monthly: { $dateToString: { format: "%Y-%m", date: "$created_at" } },
            quarterly: { $dateToString: { format: "%Y-Q%q", date: "$created_at" } },
            yearly: { $dateToString: { format: "%Y", date: "$created_at" } },
        };

        const pipeline = [
            {
                $group: {
                    _id: groupBy[interval] || groupBy.monthly,
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ];

        const customerData = await Customer.aggregate(pipeline);
        res.json(customerData);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get number of repeat customers over time
const getRepeatCustomersOverTime = async (req, res) => {
    try {
        const { interval } = req.query; // daily, monthly, quarterly, yearly

        const groupBy = {
            daily: { $dateToString: { format: "%Y-%m-%d", date: "$created_at" } },
            monthly: { $dateToString: { format: "%Y-%m", date: "$created_at" } },
            quarterly: { $dateToString: { format: "%Y-Q%q", date: "$created_at" } },
            yearly: { $dateToString: { format: "%Y", date: "$created_at" } },
        };

        const pipeline = [
            {
                $lookup: {
                    from: 'orders',
                    localField: '_id',
                    foreignField: 'customer',
                    as: 'orders'
                }
            },
            { $match: { 'orders.1': { $exists: true } } }, // Only customers with more than 1 order
            {
                $project: {
                    _id: 1,
                    created_at: 1,
                    orderDates: '$orders.created_at'
                }
            },
            {
                $unwind: '$orderDates'
            },
            {
                $group: {
                    _id: groupBy[interval] || groupBy.monthly,
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ];

        const repeatCustomerData = await Customer.aggregate(pipeline);
        res.json(repeatCustomerData);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get geographical distribution of customers
const getGeographicalDistribution = async (req, res) => {
    try {
        const pipeline = [
            {
                $group: {
                    _id: "$default_address.city",
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } }
        ];

        const distributionData = await Customer.aggregate(pipeline);
        res.json(distributionData);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get customer lifetime value by cohorts
const getCustomerLifetimeValueByCohorts = async (req, res) => {
    try {
        const pipeline = [
            {
                $lookup: {
                    from: 'orders',
                    localField: '_id',
                    foreignField: 'customer',
                    as: 'orders'
                }
            },
            {
                $addFields: {
                    firstPurchaseMonth: { $dateToString: { format: "%Y-%m", date: { $min: "$orders.created_at" } } },
                    lifetimeValue: { $sum: { $sum: "$orders.total_price_set.shop_money.amount" } }
                }
            },
            {
                $group: {
                    _id: "$firstPurchaseMonth",
                    totalLifetimeValue: { $sum: "$lifetimeValue" },
                    customerCount: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 1,
                    avgLifetimeValue: { $divide: ["$totalLifetimeValue", "$customerCount"] }
                }
            },
            { $sort: { _id: 1 } }
        ];

        const cohortData = await Customer.aggregate(pipeline);
        res.json(cohortData);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    getNewCustomersOverTime,
    getRepeatCustomersOverTime,
    getGeographicalDistribution,
    getCustomerLifetimeValueByCohorts,
};
