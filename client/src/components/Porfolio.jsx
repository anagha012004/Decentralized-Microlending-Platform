import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import Header from './Header';
import { NFTContext } from '../context/NFTcontext';
import { URL } from '../utils/url';
import { Link } from 'react-router-dom';
import img from '../assets/profile.jpg';

const Portfolio = () => {
    const { user: contextUser } = useContext(NFTContext);
    const [localUser, setLocalUser] = useState(null);
    const [nfts, setNfts] = useState([]);
    const [investments, setInvestments] = useState([]);

    // Use context user or local user
    const user = contextUser || localUser;

    const getUser = async () => {
        try {
            const res = await axios.get(`${URL}/user`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setLocalUser(res.data.data.user[0]);
        } catch (err) {
            console.log(err);
        }
    };

    const getNfts = () => {
        axios.get(`${URL}/nft/getnfts`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(res => {
            setNfts(res.data);
        })
        .catch(err => {
            console.log(err);
        });
    };

    const getInvestments = () => {
        axios.get(`${URL}/user/invest`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then((res) => {
            const data = res.data.investments.slice(0, 4);
            setInvestments(data);
        })
        .catch((err) => {
            console.log(err);
        });
    };

    useEffect(() => {
        getUser();
        getInvestments();
        getNfts();
    }, []);

    return (
        <>
            <Header />
            <div className="flex items-center justify-between mb-4" style={{ marginTop: "100px", marginLeft: "150px" }}>
                <div style={{ marginTop: "100px" }}>
                    <h1 className="max-w-2xl mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl dark:text-dark" style={{ fontFamily: "Roboto Mono" }}>
                        Portfolio For:
                    </h1>
                    <h2 className="max-w-2xl mb-4 text-2xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-3xl dark:text-dark" style={{ fontFamily: "Roboto Mono" }}>Name: {user?.userName || user?.fullName || "Loading..."}</h2>
                    <h2 className="max-w-2xl mb-4 text-2xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-3xl dark:text-dark" style={{ fontFamily: "Roboto Mono" }}>Email: {user?.email || "Loading..."}</h2>
                </div>
                <div className="w-full max-w-md p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-white dark:border-gray-700" style={{ marginLeft: "150px" }}>
                    <div className="flex items-center justify-between mb-4">
                        <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-dark">Latest Statistics</h5>
                    </div>
                    <div className="flow-root">
                        <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
                            <li className="py-3 sm:py-4">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <img className="w-8 h-8 rounded-full" src={img} alt="Neil image" />
                                    </div>
                                    <div className="flex-1 min-w-0 ms-4">
                                        <p className="text-lg font-medium text-gray-900 truncate dark:text-dark">
                                            Wallet Balance
                                        </p>
                                    </div>
                                    <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-dark">
                                        ${user?.wallet || 0}
                                    </div>
                                </div>
                            </li>
                            <li className="py-3 sm:py-4">
                                <div className="flex items-center ">
                                    <div className="flex-shrink-0">
                                        <img className="w-8 h-8 rounded-full" src={img} alt="Bonnie image" />
                                    </div>
                                    <div className="flex-1 min-w-0 ms-4">
                                        <p className="text-lg font-medium text-gray-900 truncate dark:text-dark">
                                            Total Loan Withdrawn
                                        </p>
                                    </div>
                                    <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-dark">
                                        ${user?.loan || 0}
                                    </div>
                                </div>
                            </li>
                            <li className="py-3 sm:py-4">
                                <div className="flex flex-col items-center ">
                                    <div className="flex-shrink-0">
                                        <img className="w-8 h-8 rounded-full" src={img} alt="Lana image" />
                                    </div>
                                    <div className="flex-1 min-w-0 ms-4">
                                        <p className="text-lg font-medium text-gray-900 truncate dark:text-dark">
                                            Total Investments
                                        </p>
                                    </div>
                                    <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-dark">
                                        {investments.length === 0 && (
                                            <div>
                                                <p>No Investments</p>
                                                <Link to='/invest' className="text-blue-500">Invest Now</Link>
                                            </div>
                                        )}
                                        {investments.length > 0 && (
                                            <div>
                                            <table className="table-auto">
                                                <thead>
                                                    <tr>
                                                        <th className="px-4 py-2">Coin Name</th>
                                                        <th className="px-4 py-2">Amount</th>
                                                        <th className="px-4 py-2">Duration</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {investments.map((investment, index) => (
                                                        <tr key={index}>
                                                            <td className="border px-4 py-2">{investment.coinName}</td>
                                                            <td className="border px-4 py-2">${investment.amount}</td>
                                                            <td className="border px-4 py-2">{investment.duration} year</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                            <Link to='/invested' className="text-blue-500">View All</Link>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </li>
                            <li className="py-3 sm:py-4">
                                <div className="flex flex-col items-center ">
                                    <div className="flex-shrink-0">
                                        <img className="w-8 h-8 rounded-full" src={img} alt="Thomas image" />
                                    </div>
                                    <div className="flex-1 min-w-0 ms-4">
                                        <p className="text-lg font-medium text-gray-900 truncate dark:text-dark">
                                            NFTs Minted
                                        </p>
                                    </div>
                                    <div className="inline-flex flex-col items-start text-base font-semibold text-gray-900 dark:text-dark">
                                        {nfts.length === 0 && (
                                            <div className="text-center">
                                                <p>No NFTs minted</p>
                                                <Link to='/mintnft' className="text-blue-500"><button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2">Mint Now</button></Link>
                                            </div>
                                        )}
                                        {nfts.length > 0 && (
                                            <div>
                                                {nfts.map((nft, index) => (
                                                    <div key={index} className="flex items-center space-x-4 mt-2">
                                                        <img src={`https://gateway.pinata.cloud/ipfs/${nft.cid}`} alt="nft" className="h-20 w-20 rounded-md" />
                                                        <p className="text-sm text-gray-900 dark:text-dark">{nft.cid.slice(0, 20) + '...'}</p>
                                                    </div>
                                                ))}
                                                <Link to='/nfts' className="text-blue-500">View All</Link>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Portfolio;
