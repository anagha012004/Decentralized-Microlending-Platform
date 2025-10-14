import User from '../modals/User.modal.js';
import Invest from '../modals/Invest.modal.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
export const registerUser = async (req, res) => {
    try {
        const { username, fullname, email, password } = req.body;
        if (!username || !fullname || !email || !password) {
            return res.status(400).json({
                status: 'false',
                message: 'Please fill all fields'
            })
        }
        const existingEmail = await User.findOne({ email });
        if(existingEmail){
            return res.status(400).json({
                status: 'false',
                message: 'Email already exists'
            })  
        }
        console.log('Checking username:', username);
const existingUsername = await User.findOne({ userName: username });
console.log('Found existing user:', existingUsername);

        if(existingUsername){
            return res.status(400).json({
                status: 'false',
                message: 'Username already exists'
            })
        }
        const passwordHash = await bcrypt.hash(password, 12);
        const user = new User({
            userName: username,
            fullName: fullname,
            email,
            password: passwordHash
        })
        await user.save();
        res.status(201).json({
            status: 'success',
            message: 'User registered successfully'
        })
    }
    catch (err) {
        res.status(400).json({
            status: 'false',
            message: err.message
        })
    }
}

export const loginUser = async (req, res) => {
    try {
        const { usernameOrEmail, password } = req.body;
        if (!usernameOrEmail || !password) {
            throw new Error('Please fill all fields')
        }
        const user = await User.findOne({ $or: [{ userName: usernameOrEmail }, { email: usernameOrEmail }] });
        if (!user) {
            return res.status(400).json({
                status: 'false',
                message: 'User do not exist'
            })
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                status: 'false',
                message: 'Invalid Credentials'
            })
        }
        const token = jwt.sign({ id: user._id }, process.env.TOKEN_SECRET, { expiresIn: '72h' });
        res.status(200).json({
            status: 'success',
            message: 'User logged in successfully',
            token
        })
    }
    catch (err) {
        res.status(400).json({
            status: 'false',
            message: err.message
        })
    }
}

export const getUser = async (req, res) => {
    try {
        const id = req.user.id;
        const user = await User.find({ _id: id });
        res.status(200).json({
            status: 'success',
            data: {
                user
            }
        })
    }
    catch (err) {
        res.status(400).json({
            status: 'false',
            message: err.message
        })
    }
}

export const SendUPIMoney = async (req, res) => {
    try {
        const { amount } = req.body;
        const userId = req.user.id;
        const crypto = parseInt(amount);
        const user = await User.findOne({ _id: userId });
        if (user) {
            user.wallet += crypto;
            await user.save();
            return res.status(200).send({ message: "Transaction Successful" });
        } else {
            return res.status(404).send({ message: "User Not Found" });
        }
    }
    catch (err) {
        return res.status(400).json({
            status: 'false',
            message: err.message
        })
    }
}

export const takeloan = async (req, res) => {
    try {
        const { amount } = req.body;
        const userId = req.user.id;
        const crypto = parseInt(amount);
        const user = await User.findOne({ _id: userId });
        if (user) {
            user.loan += crypto;
            user.wallet += crypto;
            await user.save();
            return res.status(200).send({ message: "Transaction Successful" });
        } else {
            return res.status(404).send({ message: "User Not Found" });
        }
    }
    catch (err) {
        return res.status(400).json({
            status: 'false',
            message: err.message
        })
    }
}

export const payloan = async (req, res) => {
    try {
        const { amount } = req.body;
        const userId = req.user.id;
        const crypto = parseInt(amount);
        const user = await User.findOne({ _id: userId });
        if (user) {
            user.loan -= crypto;
            await user.save();
            return res.status(200).send({ message: `You have Paid loan of ${amount} dollars` });
        } else {
            return res.status(404).send({ message: "User Not Found" });
        }
    }
    catch (err) {
        return res.status(400).json({
            status: 'false',
            message: err.message
        })
    }
}

export const invest = async (req, res) => {
    try {
        const { coinName, amount, duration } = req.body;
        if (!coinName || !amount || !duration) {
            return res.status(400).json({
                status: 'false',
                message: 'Please fill all fields'
            })
        }
        const user = await User.findOne({ _id: req.user.id });
        if (!user) {
            return res.status(400).json({
                status: 'false',
                message: 'User do not exist'
            })
        }
        if (user.wallet < amount) {
            return res.status(400).json({
                status: 'false',
                message: 'Insufficient funds'
            })
        }
        user.wallet -= amount;
        await user.save();
        const invest = new Invest({
            userId: req.user.id,
            coinName,
            amount,
            duration
        })
        invest.save();
        return res.status(200).json({
            status: 'success',
            message: 'Investment successful'
        })
    }
    catch (err) {
        return res.status(400).json({
            status: 'false',
            message: err.message
        })
    }
}

export const getinvestments = async (req, res) => {
    try {
        const id = req.user.id;
        const investments = await Invest.find({ userId: id });
        res.status(200).json({
            status: 'success',
            investments
        });
    }
    catch(err){
        return res.status(400).json({
            status: 'false',
            message: err.message
        })
    }
}

export const updateWalletAddress = async (req, res) => {
    try {
        const { walletAddress } = req.body;
        const userId = req.user.id;
        const user = await User.findOne({ _id: userId });
        if (user) {
            user.walletAddress = walletAddress;
            await user.save();
            return res.status(200).json({
                status: 'success',
                message: 'Wallet address updated successfully'
            });
        } else {
            return res.status(404).json({
                status: 'false',
                message: 'User not found'
            });
        }
    } catch (err) {
        return res.status(400).json({
            status: 'false',
            message: err.message
        });
    }
}
