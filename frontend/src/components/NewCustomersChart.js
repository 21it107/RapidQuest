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

const NewCustomersChart = () => {
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            {
                label: 'New Customers Added Over Time',
                data: [],
                backgroundColor: 'rgba(153,102,255,0.2)',
                borderColor: 'rgba(153,102,255,1)',
                borderWidth: 1,
            },
        ],
    });

    useEffect(() => {
        // Fetch data from your backend API
        axios.get('http://localhost:5000/api/customers/new')
            .then((response) => {
                const data = response.data;  // Expecting data in the format { labels: [], values: [] }
                
                setChartData({
                    labels: data.labels,  // Array of labels (e.g., dates or months)
                    datasets: [
                        {
                            label: 'New Customers Added Over Time',
                            data: data.values,  // Array of values corresponding to the labels
                            backgroundColor: 'rgba(153,102,255,0.2)',
                            borderColor: 'rgba(153,102,255,1)',
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
            <h2>New Customers Added Over Time</h2>
            <Line
                data={chartData}
                options={{
                    responsive: true,
                    plugins: {
                        title: {
                            display: true,
                            text: 'New Customers Added Over Time',
                        },
                        legend: {
                            display: true,
                        },
                        tooltip: {
                            callbacks: {
                                label: function(tooltipItem) {
                                    return `${tooltipItem.label}: ${tooltipItem.raw} new customers`;
                                },
                            },
                        },
                    },
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Time',
                            },
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Number of New Customers',
                            },
                        },
                    },
                }}
            />
        </div>
    );
};

export default NewCustomersChart;