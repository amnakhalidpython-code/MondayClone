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

// Verify transporter on startup
transporter.verify(function (error, success) {
  if (error) {
    console.error('❌ Email configuration error:', error);
  } else {
    console.log('✅ Email server ready');
  }
});

// TEST EMAIL - Debugging ke liye
export const testEmail = async (req, res) => {
  try {
    console.log('📧 Sending test email...');
    console.log('From:', process.env.EMAIL_USER);
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Apne hi email pe test
      subject: 'Test Email - Monday Clone',
      html: '<h1>✅ Email Working!</h1><p>Your email configuration is correct.</p>'
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Test email sent:', info.messageId);
    
    res.status(200).json({ 
      message: 'Test email sent successfully!',
      messageId: info.messageId
    });
  } catch (error) {
    console.error('❌ Test email failed:', error);
    res.status(500).json({ 
      message: 'Test email failed', 
      error: error.message 
    });
  }
};

// Send invitations
export const sendInvitations = async (req, res) => {
  try {
    const { inviterUserId, inviterName, inviterEmail, accountName, invitations } = req.body;

    console.log('\n📩 NEW INVITATION REQUEST');
    console.log('==========================================');
    console.log('Inviter User ID:', inviterUserId);
    console.log('Inviter Name:', inviterName);
    console.log('Inviter Email:', inviterEmail);
    console.log('Account Name:', accountName);
    console.log('Number of Invitations:', invitations?.length);
    console.log('==========================================\n');

    // Validation
    if (!inviterUserId || !inviterName || !inviterEmail || !accountName) {
      console.error('❌ VALIDATION FAILED - Missing fields');
      return res.status(400).json({ 
        message: 'Missing required fields',
        received: { inviterUserId, inviterName, inviterEmail, accountName }
      });
    }

    if (!invitations || invitations.length === 0) {
      console.error('❌ No invitations provided');
      return res.status(400).json({ message: 'No invitations provided' });
    }

    const sentInvitations = [];
    const failedInvitations = [];

    for (const invite of invitations) {
      const { email, role } = invite;

      if (!email || !email.trim()) {
        console.log('⚠️ Skipping empty email');
        continue;
      }

      try {
        // Generate unique token
        const invitationToken = crypto.randomBytes(32).toString('hex');

        console.log(`\n📝 Processing: ${email}`);

        // Save to database
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
        console.log(`✅ Saved to database`);

        // Prepare email
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

        console.log(`📧 Sending email...`);
        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent! Message ID: ${info.messageId}`);
        
        sentInvitations.push(newInvitation);

      } catch (emailError) {
        console.error(`❌ Failed for ${email}:`, emailError.message);
        failedInvitations.push({ 
          email, 
          error: emailError.message 
        });
      }
    }

    console.log(`\n✅ COMPLETED: ${sentInvitations.length} sent, ${failedInvitations.length} failed\n`);

    res.status(200).json({
      message: 'Invitations processed',
      sentCount: sentInvitations.length,
      failedCount: failedInvitations.length,
      invitations: sentInvitations,
      failed: failedInvitations
    });

  } catch (error) {
    console.error('❌ CRITICAL ERROR:', error);
    res.status(500).json({ 
      message: 'Error sending invitations', 
      error: error.message,
      stack: error.stack
    });
  }
};

// Accept invitation
export const acceptInvitation = async (req, res) => {
  try {
    const { token } = req.params;

    console.log(`🔍 Accepting invitation with token: ${token}`);

    const invitation = await Invitation.findOne({ invitationToken: token });

    if (!invitation) {
      console.log('❌ Invitation not found');
      return res.status(404).json({ message: 'Invitation not found' });
    }

    if (invitation.status !== 'pending') {
      console.log('⚠️ Invitation already processed');
      return res.status(400).json({ message: 'Invitation already processed' });
    }

    invitation.status = 'accepted';
    await invitation.save();

    console.log('✅ Invitation accepted');

    res.status(200).json({
      message: 'Invitation accepted successfully',
      invitation
    });

  } catch (error) {
    console.error('❌ Error accepting invitation:', error);
    res.status(500).json({ 
      message: 'Error accepting invitation', 
      error: error.message 
    });
  }
};