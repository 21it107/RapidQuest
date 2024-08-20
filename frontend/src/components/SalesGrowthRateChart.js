import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const SalesGrowthRateChart = () => {
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            {
                label: 'Sales Growth Rate Over Time',
                data: [],
                backgroundColor: 'rgba(75,192,192,0.2)',
                borderColor: 'rgba(75,192,192,1)',
                borderWidth: 1,
            },
        ],
    });

    useEffect(() => {
        // Fetch data from your backend API
        axios.get('http://localhost:5000/api/sales/growth')
            .then((response) => {
                const data = response.data;  // Expecting data in the format { labels: [], values: [] }
                
                setChartData({
                    labels: data.labels,  // Array of labels (e.g., months)
                    datasets: [
                        {
                            label: 'Sales Growth Rate Over Time',
                            data: data.values,  // Array of growth rates corresponding to the labels
                            backgroundColor: 'rgba(75,192,192,0.2)',
                            borderColor: 'rgba(75,192,192,1)',
                            borderWidth: 1,
                        },
                    ],
                });
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }, []);

    return (
        <div>
            <h2>Sales Growth Rate Over Time</h2>
            <Line
                data={chartData}
                options={{
                    responsive: true,
                    plugins: {
                        title: {
                            display: true,
                            text: 'Sales Growth Rate Over Time',
                        },
                        legend: {
                            display: true,
                        },
                        tooltip: {
                            callbacks: {
                                label: function(tooltipItem) {
                                    return `Growth Rate: ${tooltipItem.raw.toFixed(2)}%`;
                                },
                            },
                        },
                    },
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Month',
                            },
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Growth Rate (%)',
                            },
                            ticks: {
                                callback: function(value) {
                                    return `${value.toFixed(2)}%`;
                                },
                            },
                        },
                    },
                }}
            />
        </div>
    );
};

export default SalesGrowthRateChart;