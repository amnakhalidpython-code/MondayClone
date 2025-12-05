import Account from "../models/SignUpAccount.js";

export const saveAccount = async (req, res) => {
  try {
    const { fullName, accountName } = req.body;

    if (!fullName) {
      return res.status(400).json({ message: "Full name is required" });
    }

    const newAccount = await Account.create({
      fullName,
      accountName
    });

    res.status(200).json({
      message: "Account saved successfully",
      account: newAccount
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};
