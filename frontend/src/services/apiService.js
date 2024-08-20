import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export const getTotalSalesOverTime = async (interval) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/orders/sales/${interval}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching sales data', error);
        throw error;
    }
};

// Additional API functions for Sales Growth, New Customers, Repeat Customers, etc.