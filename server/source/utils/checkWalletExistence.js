import pool from "../connection.cjs";

export const checkWalletExistence = async (walletAddress) => {
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