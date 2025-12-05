import EmailLead from '../models/SignUpEmailLead.js';

export const saveEmail = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const existing = await EmailLead.findOne({ email });
    if (existing) return res.status(200).json({ message: 'Email already exists' });

    const newEmail = new EmailLead({ email });
    await newEmail.save();

    res.status(201).json({ success: true, email });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
