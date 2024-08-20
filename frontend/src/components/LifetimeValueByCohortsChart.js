import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const LifetimeValueByCohortsChart = () => {
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            {
                label: 'Customer Lifetime Value by Cohorts',
                data: [],
                backgroundColor: 'rgba(75,192,192,0.2)',
                borderColor: 'rgba(75,192,192,1)',
                borderWidth: 1,
            },
        ],
    });

    useEffect(() => {
        axios.get('http://localhost:5000/api/customers/lifetime-value-by-cohorts')
            .then((response) => {
                const data = response.data;
                setChartData({
                    labels: data.map(item => item.cohort),
                    datasets: [{
                        label: 'Customer Lifetime Value',
                        data: data.map(item => item.totalLifetimeValue),
                        backgroundColor: 'rgba(75,192,192,0.2)',
                        borderColor: 'rgba(75,192,192,1)',
                        borderWidth: 1,
                    }]
                });
            })
            .catch((error) => {
                console.error('Error fetching lifetime value by cohorts data:', error);
            });
    }, []);

    return (
        <div>
            <h2>Customer Lifetime Value by Cohorts</h2>
            <Bar
                data={chartData}
                options={{
                    responsive: true,
                    plugins: {
                        title: {
                            display: true,
                            text: 'Customer Lifetime Value by Cohorts',
                        },
                        legend: {
                            display: true,
                        },
                        tooltip: {
                            callbacks: {
                                label: function(tooltipItem) {
                                    return `Lifetime Value: $${tooltipItem.raw}`;
                                },
                            },
                        },
                    },
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Cohort (Month-Year)',
                            },
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Lifetime Value ($)',
                            },
                        },
                    },
                }}
            />
        </div>
    );
};

export default LifetimeValueByCohortsChart;