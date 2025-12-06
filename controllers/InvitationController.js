// InvitationController.js
import Invitation from '../models/Invitation.js';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

// Email transporter setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Send invitations
export const sendInvitations = async (req, res) => {
  try {
    const { inviterUserId, inviterName, inviterEmail, accountName, invitations } = req.body;

    if (!invitations || invitations.length === 0) {
      return res.status(400).json({ message: 'No invitations provided' });
    }

    const sentInvitations = [];

    for (const invite of invitations) {
      const { email, role } = invite;

      // Generate unique token
      const invitationToken = crypto.randomBytes(32).toString('hex');

      // Save invitation to database
      const newInvitation = new Invitation({
        inviterUserId,
        inviterName,
        inviterEmail,
        accountName,
        invitedEmail: email,
        role,
        invitationToken
      });

      await newInvitation.save();

      // Send email
      const invitationUrl = `https://${accountName}.monday.com/accept-invitation?token=${invitationToken}`;
      
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: `${inviterName} invited you to monday.com`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: #0073ea; color: white; padding: 20px; text-align: center; }
              .content { padding: 30px; background: #f9f9f9; }
              .button { display: inline-block; padding: 12px 30px; background: #0073ea; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0; }
              .info { background: white; padding: 15px; border-left: 4px solid #0073ea; margin: 20px 0; }
              .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>monday.com</h1>
              </div>
              <div class="content">
                <h2>${inviterName} invited you to monday.com</h2>
                <p><strong>Work Management</strong></p>
                <p>monday.com is the Work OS that powers teams to run projects and workflows with confidence.</p>
                
                <a href="${invitationUrl}" class="button">Accept Invitation</a>
                
                <div class="info">
                  <p><strong>Your Account's URL:</strong><br>${accountName}.monday.com</p>
                  <p><strong>Your Login Email:</strong><br>${email}</p>
                </div>
              </div>
              <div class="footer">
                <p>Made with ❤️ by monday.com</p>
                <p><a href="#">Unsubscribe</a> from any communication about this invitation</p>
              </div>
            </div>
          </body>
          </html>
        `
      };

      await transporter.sendMail(mailOptions);
      sentInvitations.push(newInvitation);
    }

    res.status(200).json({
      message: 'Invitations sent successfully',
      invitations: sentInvitations
    });

  } catch (error) {
    console.error('Error sending invitations:', error);
    res.status(500).json({ message: 'Error sending invitations', error: error.message });
  }
};

// Accept invitation
export const acceptInvitation = async (req, res) => {
  try {
    const { token } = req.params;

    const invitation = await Invitation.findOne({ invitationToken: token });

    if (!invitation) {
      return res.status(404).json({ message: 'Invitation not found' });
    }

    if (invitation.status !== 'pending') {
      return res.status(400).json({ message: 'Invitation already processed' });
    }

    invitation.status = 'accepted';
    await invitation.save();

    res.status(200).json({
      message: 'Invitation accepted successfully',
      invitation
    });

  } catch (error) {
    console.error('Error accepting invitation:', error);
    res.status(500).json({ message: 'Error accepting invitation', error: error.message });
  }
};