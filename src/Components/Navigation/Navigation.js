import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import avatar from '../../img/avatar.png'
import { signout } from '../../utils/Icons'
import { menuItems } from '../../utils/menuItems'
import { Goal, BadgeIndianRupee, Star } from "lucide-react";
import ProgressBar from "@ramonak/react-progress-bar";
import "./summary.css"
import { useGlobalContext } from '../../context/globalContext'

function Navigation({ active, setActive }) {
    const {dailyLimit, getDailyLimit, getTodayExpense, todayExpense} = useGlobalContext()
    useEffect(()=> {
        getDailyLimit()
        getTodayExpense()
    }, [])
    return (
        <NavStyled>
            <div className="user-con">
                <img src={avatar} alt="" />
                <div className="text">
                    <h2>Sweety</h2>
                    <p>CEO of Nomura</p>
                </div>
            </div>
            <ul className="menu-items">
                {menuItems.map((item) => {
                    return <li
                        key={item.id}
                        onClick={() => setActive(item.id)}
                        className={active === item.id ? 'active' : ''}
                    >
                        {item.icon}
                        <span>{item.title}</span>
                    </li>
                })}
            </ul>
            <div className="rounded bg-white p-4 flex w-full shadow">
                <div className="bg-indigo-200 rounded-lg p-4">
                    <Goal size={50} color="rgb(245, 102, 146)" />
                </div>
                <div className="w-full p-2 flex flex-col gap-2">
                    <div className="flex justify-between">
                        <div className="font-semibold text-zinc-500 text-sm ">
                        Daily Limit
                        </div>
                        {/* <div className="font-semibold text-zinc-500 text-sm ">
                            
                        </div> */}
                    </div>
                    <div>
                        <span className="font-bold" style={{ color: "rgb(245, 102, 146)" }}>
                            ₹{todayExpense?.totalExpense}
                        </span>
                        <span className="text-zinc-400 text-sm"> / {dailyLimit?.amount}</span>
                    </div>
                    <div className="h-0.5">
                        <ProgressBar
                            completed={(todayExpense?.totalExpense/dailyLimit)* 100}
                            bgColor="rgb(245, 102, 146)"
                            isLabelVisible={false}
                            height={7}
                            className="progress-bar"
                        />
                    </div>
                </div>
            </div>

        </NavStyled>
    )
}

const NavStyled = styled.nav`
    padding: 2rem 1.5rem;
    width: 374px;
    height: 100%;
    background: rgba(252, 246, 249, 0.78);
    border: 3px solid #FFFFFF;
    backdrop-filter: blur(4.5px);
    border-radius: 32px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 2rem;
    .user-con{
        height: 100px;
        display: flex;
        align-items: center;
        gap: 1rem;
        img{
            width: 80px;
            height: 80px;
            border-radius: 50%;
            object-fit: cover;
            background: #fcf6f9;
            border: 2px solid #FFFFFF;
            padding: .2rem;
            box-shadow: 0px 1px 17px rgba(0, 0, 0, 0.06);
        }
        h2{
            color: rgba(34, 34, 96, 1);
        }
        p{
            color: rgba(34, 34, 96, .6);
        }
    }

    .menu-items{
        flex: 1;
        display: flex;
        flex-direction: column;
        li{
            display: grid;
            grid-template-columns: 40px auto;
            align-items: center;
            margin: .6rem 0;
            font-weight: 500;
            cursor: pointer;
            transition: all .4s ease-in-out;
            color: rgba(34, 34, 96, .6);
            padding-left: 1rem;
            position: relative;
            i{
                color: rgba(34, 34, 96, 0.6);
                font-size: 1.4rem;
                transition: all .4s ease-in-out;
            }
        }
    }

    .active{
        color: rgba(34, 34, 96, 1) !important;
        i{
            color: rgba(34, 34, 96, 1) !important;
        }
        &::before{
            content: "";
            position: absolute;
            left: 0;
            top: 0;
            width: 4px;
            height: 100%;
            background: #222260;
            border-radius: 0 10px 10px 0;
        }
    }
`;

export default Navigation