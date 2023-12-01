const pool = require("../connection.js");
const Moralis = require("moralis").default;
require("dotenv").config();
// const  ethers  = require('ethers');
// const { utils } = require('ethers');
const jwt = require("jsonwebtoken");

exports.connectWallet = async (req, res) => {
  const { walletAddress } = req.body; // original: const { walletAddress, signature, message } = req.body;
  try {
    // Check if wallet address is already in database
    const walletExists = await checkWalletExistence(walletAddress);
    const WA = walletAddress;
    if (!walletExists) {
      // Store wallet address in database
      await pool.query(`INSERT INTO WALLETS (wallet_address) VALUES ($1)`, [
        WA,
      ]);
      console.log(`Wallet address ${WA} stored in database`);
    }

    // Create JWT

    accessToken = jwt.sign({ walletAddress: WA }, process.env.JWT_SECRET, {
      expiresIn: "5m",
    });
    console.log(`JWT Access Token Created Successfully ${accessToken}`);

    refreshToken = jwt.sign(
      { walletAddress: WA },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "5h" }
    );
    await pool.query(
      `UPDATE WALLETS SET refresh_token = $1 WHERE wallet_address = $2`,
      [refreshToken, WA]
    );
    console.log(`JWT Refresh Token Created Successfully ${refreshToken}`);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      expires: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
      // secure: true,
      // sameSite: 'none',
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      expires: new Date(Date.now() + 5 * 60 * 60 * 1000), // 5 hours
      // secure: true,
    });
    // Send response
    return res.status(200).json({
      message: "Wallet connected successfully",
    });
  } catch (error) {
    // If an error is thrown make sure the user is prompted to connect the wallet again on the front end
    console.error(
      `Error in storing wallet address to database. \nError: \n${error}`
    );
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const tokenAddress = "PLACEHOLDER";
// const USDTAddress = '0xdac17f958d2ee523a2206206994597c13d831ec7';

// Here i just want to check for the amount of VLKC tokens in the wallet. EXPORT
exports.getWalletBalance = async (walletAddress) => {
  try {
    const returnObj = {};

    const tokenBalances = await Moralis.EvmApi.token.getWalletTokenBalances({
      address: walletAddress,
      chain: "0x1",
    });
    const tokens = tokenBalances.toJSON();
    const filteredTokens = tokens.filter(
      (el) => el.token_address === tokenAddress
    ); //|| el.token_address === USDTAddress);
    if (filteredTokens.length === 0) {
      return null;
    }
    filteredTokens.forEach((el) => {
      const balance = el.balance / 10 ** el.decimals;
      returnObj[el.symbol] = balance;
    });
    return returnObj; // {'VLKC' : 1000}}
  } catch (error) {
    console.log(error);
  }
};

const checkWalletExistence = async (walletAddress) => {
  try {
    const result = await pool.query(
      `SELECT * FROM WALLETS WHERE wallet_address = $1`,
      [walletAddress]
    );
    if (result.rows.length === 0) {
      return false;
    }
    return true;
  } catch (error) {
    console.error(
      `Error in checking if wallet exists in database. \nError: \n${error}`
    );
    return null;
  }
};
