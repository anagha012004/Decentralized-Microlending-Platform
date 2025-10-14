import abi from './NFTRewards.json'
export const contractABI=abi.abi;
// Use local Hardhat network address for testing
export const contractAddress= "0x5FbDB2315678afecb367f032d93F642f64180aa3";
import Web3 from 'web3';
// Configure Web3 to use local network
const web3 = new Web3('http://127.0.0.1:8545');

export const NFTContract = new web3.eth.Contract(
    contractABI,
    contractAddress
);
