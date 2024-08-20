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

const RepeatCustomersChart = () => {
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            {
                label: 'Number of Repeat Customers',
                data: [],
                backgroundColor: 'rgba(54,162,235,0.2)',
                borderColor: 'rgba(54,162,235,1)',
                borderWidth: 1,
            },
        ],
    });

    useEffect(() => {
        // Fetch data from your backend API
        axios.get('http://localhost:5000/api/customers/repeat')
            .then((response) => {
                const data = response.data;  // Expecting data in the format { day: { labels: [], values: [] }, month: { labels: [], values: [] }, ... }

                // Prepare chart data
                const datasets = Object.keys(data).map(timeFrame => ({
                    label: `${timeFrame.charAt(0).toUpperCase() + timeFrame.slice(1)}ly Repeat Customers`,
                    data: data[timeFrame].values,
                    backgroundColor: 'rgba(54,162,235,0.2)',
                    borderColor: 'rgba(54,162,235,1)',
                    borderWidth: 1,
                }));

                setChartData({
                    labels: data.month.labels,  // Assuming monthly labels to be common for the x-axis
                    datasets
                });
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }, []);

    return (
        <div>
            <h2>Number of Repeat Customers Over Time</h2>
            <Line
                data={chartData}
                options={{
                    responsive: true,
                    plugins: {
                        title: {
                            display: true,
                            text: 'Number of Repeat Customers Over Time',
                        },
                        legend: {
                            display: true,
                        },
                        tooltip: {
                            callbacks: {
                                label: function(tooltipItem) {
                                    return `Repeat Customers: ${tooltipItem.raw}`;
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
                                text: 'Number of Repeat Customers',
                            },
                        },
                    },
                }}
            />
        </div>
    );
};

export default RepeatCustomersChart;