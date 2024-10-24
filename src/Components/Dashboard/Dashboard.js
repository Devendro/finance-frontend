import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useGlobalContext } from '../../context/globalContext';
import History from '../../History/History';
import { InnerLayout } from '../../styles/Layouts';
import { rupee } from '../../utils/Icons';
import Chart from '../Chart/Chart';
import Expense from '../Chart/Expense';
import DatePicker from "react-datepicker";
import axios from "axios"

function Dashboard() {
    const { totalExpenses, incomes, expenses, totalIncome, totalBalance, getIncomes, getExpenses } = useGlobalContext()
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [currentMonthExpense, setCurrentExpense] = useState(0)

    const getMonthlyData = async () => {
        const response = await axios.get('http://localhost:5000/api/v1/getMonthlyExpense');
        const firstElementSum = Object.values(response.data[0].categories).reduce((sum, value) => sum + value, 0);
        setCurrentExpense(firstElementSum);
    }

    useEffect(() => {
        getIncomes()
        getExpenses()
        getMonthlyData();
    }, [])

    const CustomInput = ({ value, onClick }) => (
        <input
            type="text"
            value={value}
            onClick={onClick}
            placeholder="Select Date Range"
            readOnly
            style={{
                padding: "10px", background: "#FCF6F9",
                border: "2px solid #FFFFFF",
                boxShadow: "0px 1px 15px rgba(0, 0, 0, 0.06)",
                borderRadius: "10px", marginTop: "30px", marginRight: "25px", width: "400px"
            }}
        />
    );

    const handleDateChange = (dates) => {
        const [start, end] = dates;
        setStartDate(start);
        setEndDate(end);
    };
    return (
        <DashboardStyled>
            <InnerLayout>
                <h1>All Transactions</h1>
                <div className="stats-con">
                    <div className="chart-con">
                        <Chart />
                        <div className="date-filter-input" style={{ display: "flex", flexDirection: "row", }}>
                            <DatePicker
                                selected={startDate}
                                onChange={handleDateChange}
                                startDate={startDate}
                                endDate={endDate}
                                monthsShown={2}
                                selectsRange
                                customInput={<CustomInput />}
                            />
                            <button style={{ padding: "10px", borderRadius: "10px", border: "1px solid white", width: "200px", color: "white", backgroundColor: "#F56692", marginTop: "30px", cursor: "pointer" }}>Apply</button>
                        </div>
                        <div className="amount-con">

                            <div className="income">
                                <h5>Total Income</h5>
                                <p>
                                    {rupee} {totalIncome({startDate: startDate, endDate: endDate})}
                                </p>
                            </div>
                            <div className="expense">
                                <h5>Total Expense</h5>
                                <p>
                                    {rupee} {totalExpenses()}
                                </p>
                            </div>
                            <div className="expense">
                                <h5>Total Expense (Current Month)</h5>
                                <p>
                                    {rupee} {currentMonthExpense}
                                </p>
                            </div>
                            <div className="expense">
                                <h5>Goal Remaining</h5>
                                <p>
                                    {rupee} {totalExpenses()}
                                </p>
                            </div>
                            <div className="balance">
                                <h5>Total Balance</h5>
                                <p>
                                    {rupee} {totalBalance()}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="history-con">
                        <Expense />
                        <History />
                        <h2 className="salary-title">Min <span>Salary</span>Max</h2>
                        <div className="salary-item">
                            <p>
                                ${Math.min(...incomes.map(item => item.amount))}
                            </p>
                            <p>
                                ${Math.max(...incomes.map(item => item.amount))}
                            </p>
                        </div>
                        <h2 className="salary-title">Min <span>Expense</span>Max</h2>
                        <div className="salary-item">
                            <p>
                                ${Math.min(...expenses.map(item => item.amount))}
                            </p>
                            <p>
                                ${Math.max(...expenses.map(item => item.amount))}
                            </p>
                        </div>
                    </div>
                </div>
            </InnerLayout>
        </DashboardStyled>
    )
}

const DashboardStyled = styled.div`
    .stats-con {
        display: grid;
        grid-template-columns: repeat(5, 1fr); // Five equal columns
        gap: 2rem;

        .chart-con {
            grid-column: 1 / 4; // Adjust to span 3 columns
            height: 400px;

            .amount-con {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 2rem;
                margin-top: 2rem;

                .income,
                .expense {
                    grid-column: span 2; // Each spans 2 columns
                }

                .income,
                .expense,
                .balance {
                    background: #FCF6F9;
                    border: 2px solid #FFFFFF;
                    box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
                    border-radius: 20px;
                    padding: 1rem;

                    p {
                        font-size: 2rem;
                        font-weight: 700;
                    }
                }

                .balance {
                    grid-column: 2 / 4; // This balances out with the other spans
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;

                    p {
                        color: var(--color-green);
                        opacity: 0.6;
                        font-size: 2rem;
                    }
                }
            }
        }

        .history-con {
            grid-column: 4 / 6; // Adjust to span the last 2 columns
            h2 {
                margin: 1rem 0;
                display: flex;
                align-items: center;
                justify-content: space-between;
            }

            .salary-title {
                font-size: 1.2rem;

                span {
                    font-size: 1.4rem;
                }
            }

            .salary-item {
                background: #FCF6F9;
                border: 2px solid #FFFFFF;
                box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
                padding: 1rem;
                border-radius: 20px;
                display: flex;
                justify-content: space-between;
                align-items: center;

                p {
                    font-weight: 600;
                    font-size: 1.6rem;
                }
            }
        }
    }
`;

export default Dashboard