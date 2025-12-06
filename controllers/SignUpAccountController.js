import Account from "../models/SignUpAccount.js";

// Save account (already exists)
export const saveAccount = async (req, res) => {
  try {
    const { email, fullName, accountName } = req.body; // ADD email here

    if (!fullName) {
      return res.status(400).json({ message: "Full name is required" });
    }

    // Check if account already exists
    let account = await Account.findOne({ email });
    
    if (account) {
      // Update existing account
      account.fullName = fullName;
      account.accountName = accountName;
      await account.save();
    } else {
      // Create new account
      account = await Account.create({
        email,
        fullName,
        accountName
      });
    }

    res.status(200).json({
      message: "Account saved successfully",
      account
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

// GET account (NEW FUNCTION - ADD THIS)
export const getAccount = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const account = await Account.findOne({ email });
    
    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }
    
    res.status(200).json({ account });
  } catch (error) {
    res.status(500).json({ 
      message: "Error fetching account", 
      error: error.message 
    });
  }
};