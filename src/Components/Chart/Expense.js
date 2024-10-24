import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import axios from 'axios';
import styled from 'styled-components';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const Expense = () => {
    const [monthlyData, setMonthlyData] = useState({ labels: [], datasets: [] });
    const [comparisonText, setComparisonText] = useState(""); // State for comparison text
    const [overallComparisonText, setOverallComparisonText] = useState(""); // State for overall comparison text

    const getData = async () => {
        const response = await axios.get('http://localhost:5000/api/v1/getMonthlyExpense');

        // Prepare the data structure
        const result = {
            labels: [],
            datasets: []
        };

        // Create an array to store month data in the order of months
        const monthData = response?.data.map(entry => {
            const monthDate = new Date(entry.month + '-01'); // Add day for proper date parsing
            const monthIndex = monthDate.getMonth(); // Get month index (0-11)
            return {
                monthName: monthDate.toLocaleString('default', { month: 'long' }),
                categories: entry.categories,
                monthIndex: monthIndex, // Store month index for sorting
                total: Object.values(entry.categories).reduce((a, b) => a + (b || 0), 0) // Calculate total expenses for the month
            };
        });

        // Sort the monthData by monthIndex
        monthData.sort((a, b) => a.monthIndex - b.monthIndex);

        // Extract the labels and datasets after sorting
        const categories = new Set();
        monthData.forEach(entry => {
            // Extract month name for labels
            result.labels.push(entry.monthName);

            // Collect unique categories
            Object.keys(entry.categories).forEach(category => {
                categories.add(category);
            });
        });

        // Create a dataset for each category
        categories.forEach(category => {
            const data = monthData.map(entry => entry.categories[category] || 0); // Map data points
            result.datasets.push({
                label: category.charAt(0).toUpperCase() + category.slice(1), // Capitalize the category name
                data: data,
                backgroundColor: `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.6)` // Random color
            });
        });

        setMonthlyData(result);

        // Generate comparison texts
        generateComparisonText(monthData, result.labels);
        generateOverallComparisonText(monthData);
    };

    const generateComparisonText = (monthData, labels) => {
        const currentMonthData = monthData[monthData.length - 1]; // Get current month data
        const previousMonthData = monthData[monthData.length - 2]; // Get previous month data

        if (!previousMonthData) {
            setComparisonText("Not enough data to compare with the previous month.");
            return;
        }

        let comparison = `In ${labels[labels.length - 1]}, you spent `;
        
        Object.keys(currentMonthData.categories).forEach(category => {
            const currentAmount = currentMonthData.categories[category] || 0;
            const previousAmount = previousMonthData.categories[category] || 0;

            const difference = currentAmount - previousAmount; // Calculate the difference
            
            if (difference > 0) {
                comparison += `₹${difference} more on ${category.charAt(0).toUpperCase() + category.slice(1)}. `;
            } else if (difference < 0) {
                comparison += `₹${-difference} less on ${category.charAt(0).toUpperCase() + category.slice(1)}. `;
            } else {
                comparison += `No change on ${category.charAt(0).toUpperCase() + category.slice(1)} (₹${currentAmount}). `;
            }
        });

        setComparisonText(comparison);
    };

    const generateOverallComparisonText = (monthData) => {
        const currentMonthData = monthData[monthData.length - 1]; // Get current month data
        const previousMonthData = monthData[monthData.length - 2]; // Get previous month data

        if (!previousMonthData) {
            setOverallComparisonText("Not enough data to compare with the previous month.");
            return;
        }

        const currentMonthTotal = currentMonthData.total; // Total for current month
        const previousMonthTotal = previousMonthData.total; // Total for previous month
        const overallDifference = currentMonthTotal - previousMonthTotal;

        if (overallDifference > 0) {
            setOverallComparisonText(`Overall, you spent ₹${overallDifference} more than the previous month.`);
        } else if (overallDifference < 0) {
            setOverallComparisonText(`Overall, you spent ₹${-overallDifference} less than the previous month.`);
        } else {
            setOverallComparisonText(`Overall, your spending remained the same at ₹${currentMonthTotal}.`);
        }
    };

    useEffect(() => {
        getData();
    }, []);

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Monthly Expense Comparison',
            },
        },
        scales: {
            x: {
                stacked: true, // Enable stacking on the x-axis
            },
            y: {
                stacked: true, // Enable stacking on the y-axis (horizontal bar)
            },
        },
    };

    return (
        <ChartStyled>
            <Bar data={monthlyData} options={options} />
            <ComparisonText>{comparisonText}</ComparisonText> {/* Display category comparison text */}
            <OverallComparisonText overallDifference={parseInt(overallComparisonText.match(/[-\d]+/)?.[0])}>
                {overallComparisonText} {/* Display overall comparison text */}
            </OverallComparisonText>
        </ChartStyled>
    );
};

const ChartStyled = styled.div`
    background: #FCF6F9;
    border: 2px solid #FFFFFF;
    box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
    padding: 1rem;
    border-radius: 20px;
`;

const ComparisonText = styled.p`
    margin-top: 1rem;
    font-size: 1rem;
    color: #333;
`;

const OverallComparisonText = styled.p`
    margin-top: 0.5rem;
    font-size: 1rem;
    color: ${props => (props.overallDifference < 0 ? 'red' : 'green')};
`;

export default Expense;
