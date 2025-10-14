import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { toast } from 'react-toastify';
import { contractABI, contractAddress } from '../utils/constants';
import axios from 'axios';
import { URL } from '../utils/url';
export const NFTContext = React.createContext();
const { ethereum } = window;

const getEthereumContract = () => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, contractABI, signer);
    return contract;
}

export const NFTProvider = ({ children }) => {
    const [connectedAccount, setConnectedAccount] = useState(null);
    const [user,setUser]=useState();
    const getUser=async()=>{
        try{
            const res=await axios.get(`${URL}/user`,{
              headers:{
                  Authorization: `Bearer ${localStorage.getItem("token")}`
              }
            });
            setUser(res.data.data.user[0]);
         }
         catch(err){
          console.log(err);
         }
    }

    const updateWalletAddress = async (address) => {
        try {
            const res = await axios.put(`${URL}/user/wallet`, { walletAddress: address }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            if (res.status === 200) {
                getUser(); // Refresh user data
            }
        } catch (err) {
            console.log(err);
        }
    };
    const checkIfWalletIsConnected = async () => {
        if (!ethereum) return toast.error("Please install MetaMask");
        const accounts = await ethereum.request({ method: 'eth_accounts' });
        if (accounts.length && user && user.walletAddress) {
            // Only auto-connect if user exists and has a wallet address stored
            setConnectedAccount(accounts[0]);
        }
    };

    const connectWallet = async () => {
        if (!ethereum) return toast.error("Please install MetaMask");

        try {
            // Switch to localhost network
            try {
                await ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: '0x7A69' }], // 31337 in hex
                });
            } catch (switchError) {
                // If network doesn't exist, add it
                if (switchError.code === 4902) {
                    await ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [{
                            chainId: '0x7A69',
                            chainName: 'Localhost 8545',
                            rpcUrls: ['http://127.0.0.1:8545'],
                            nativeCurrency: {
                                name: 'ETH',
                                symbol: 'ETH',
                                decimals: 18,
                            },
                        }],
                    });
                } else {
                    throw switchError;
                }
            }

            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
            setConnectedAccount(accounts[0]);
            if (user) {
                await updateWalletAddress(accounts[0]);
            }
        } catch (err) {
            toast.error(err.message);
        }
    };

    useEffect(() => {
        checkIfWalletIsConnected();
        getUser();
    }, []);

    useEffect(() => {
        if (connectedAccount && user && user.walletAddress !== connectedAccount) {
            updateWalletAddress(connectedAccount);
        }
    }, [connectedAccount, user]);

    return (
        <NFTContext.Provider value={{ connectWallet, connectedAccount ,user}}>
            {children}
        </NFTContext.Provider>
    );
}
