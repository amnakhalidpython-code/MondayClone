// controllers/SignUpAccountController.js
import Account from "../models/SignUpAccount.js";

// Save account with category
export const saveAccount = async (req, res) => {
  try {
    const { email, fullName, accountName, category, role } = req.body; // 🆕 category aur role add kiya

    if (!fullName) {
      return res.status(400).json({ message: "Full name is required" });
    }

    let account = await Account.findOne({ email });
    
    if (account) {
      account.fullName = fullName;
      account.accountName = accountName;
      account.category = category || 'work'; // 🆕 category save
      account.role = role; // 🆕 role save
      await account.save();
    } else {
      account = await Account.create({
        email,
        fullName,
        accountName,
        category: category || 'work', // 🆕 default 'work'
        role
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

// Get account
export const getAccount = async (req, res) => {
  try {
    const { email } = req.query; // 🆕 query se get karo
    
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