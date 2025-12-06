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

// TEST EMAIL
export const testEmail = async (req, res) => {
  try {
    console.log('📧 Sending test email...');
    console.log('From:', process.env.EMAIL_USER);
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: 'Test Email - Futures Platform',
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

        // Dynamic invitation URL with account name
        const invitationUrl = `https://monday-frontend-one.vercel.app/${accountName}?token=${invitationToken}`;
        
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: email,
          subject: `${inviterName} invited you to join ${accountName} on Futures`,
          html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Team Invitation</title>
              <style>
                * {
                  margin: 0;
                  padding: 0;
                  box-sizing: border-box;
                }
                body {
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                  line-height: 1.6;
                  color: #1a1a1a;
                  background-color: #f5f5f5;
                  padding: 20px;
                }
                .email-container {
                  max-width: 600px;
                  margin: 0 auto;
                  background-color: #ffffff;
                  border-radius: 12px;
                  overflow: hidden;
                  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                }
                .header {
                  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                  padding: 40px 30px;
                  text-align: center;
                }
                .logo {
                  font-size: 32px;
                  font-weight: 700;
                  color: #ffffff;
                  letter-spacing: -0.5px;
                  margin-bottom: 10px;
                }
                .tagline {
                  font-size: 14px;
                  color: rgba(255, 255, 255, 0.9);
                  font-weight: 300;
                }
                .content {
                  padding: 40px 30px;
                }
                .greeting {
                  font-size: 24px;
                  font-weight: 600;
                  color: #1a1a1a;
                  margin-bottom: 20px;
                }
                .message {
                  font-size: 16px;
                  color: #4a5568;
                  line-height: 1.8;
                  margin-bottom: 30px;
                }
                .highlight {
                  color: #667eea;
                  font-weight: 600;
                }
                .cta-button {
                  display: inline-block;
                  padding: 16px 40px;
                  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                  color: #ffffff;
                  text-decoration: none;
                  border-radius: 8px;
                  font-weight: 600;
                  font-size: 16px;
                  transition: transform 0.2s ease, box-shadow 0.2s ease;
                  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
                  text-align: center;
                  margin: 20px 0;
                }
                .cta-button:hover {
                  transform: translateY(-2px);
                  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
                }
                .info-box {
                  background: linear-gradient(135deg, #f6f8fb 0%, #e9ecef 100%);
                  border-left: 4px solid #667eea;
                  padding: 20px;
                  border-radius: 8px;
                  margin: 30px 0;
                }
                .info-item {
                  margin-bottom: 12px;
                  font-size: 14px;
                }
                .info-label {
                  color: #718096;
                  font-weight: 500;
                  display: block;
                  margin-bottom: 4px;
                }
                .info-value {
                  color: #2d3748;
                  font-weight: 600;
                  font-size: 15px;
                }
                .features {
                  margin: 30px 0;
                }
                .feature-item {
                  display: flex;
                  align-items: start;
                  margin-bottom: 16px;
                }
                .feature-icon {
                  width: 24px;
                  height: 24px;
                  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                  border-radius: 50%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  color: white;
                  font-size: 14px;
                  margin-right: 12px;
                  flex-shrink: 0;
                }
                .feature-text {
                  color: #4a5568;
                  font-size: 14px;
                  line-height: 1.6;
                }
                .footer {
                  background-color: #f7fafc;
                  padding: 30px;
                  text-align: center;
                  border-top: 1px solid #e2e8f0;
                }
                .footer-text {
                  color: #718096;
                  font-size: 13px;
                  line-height: 1.6;
                  margin-bottom: 15px;
                }
                .footer-link {
                  color: #667eea;
                  text-decoration: none;
                  font-weight: 500;
                }
                .footer-link:hover {
                  text-decoration: underline;
                }
                .divider {
                  height: 1px;
                  background: linear-gradient(to right, transparent, #e2e8f0, transparent);
                  margin: 30px 0;
                }
                @media only screen and (max-width: 600px) {
                  .content {
                    padding: 30px 20px;
                  }
                  .header {
                    padding: 30px 20px;
                  }
                  .greeting {
                    font-size: 20px;
                  }
                  .message {
                    font-size: 15px;
                  }
                }
              </style>
            </head>
            <body>
              <div class="email-container">
                <div class="header">
                  <div class="logo">Futures</div>
                  <div class="tagline">Work Smarter, Together</div>
                </div>
                
                <div class="content">
                  <div class="greeting">You're Invited! 🎉</div>
                  
                  <div class="message">
                    <strong>${inviterName}</strong> has invited you to join <span class="highlight">${accountName}</span> workspace on Futures. 
                    Start collaborating with your team and bring your projects to life!
                  </div>

                  <div style="text-align: center;">
                    <a href="${invitationUrl}" class="cta-button">Accept Invitation →</a>
                  </div>

                  <div class="info-box">
                    <div class="info-item">
                      <span class="info-label">Workspace</span>
                      <span class="info-value">${accountName}.futures.com</span>
                    </div>
                    <div class="info-item">
                      <span class="info-label">Your Login Email</span>
                      <span class="info-value">${email}</span>
                    </div>
                    <div class="info-item">
                      <span class="info-label">Role</span>
                      <span class="info-value">${role}</span>
                    </div>
                  </div>

                  <div class="divider"></div>

                  <div class="features">
                    <div class="feature-item">
                      <div class="feature-icon">✓</div>
                      <div class="feature-text">
                        <strong>Collaborate in Real-Time</strong><br>
                        Work together seamlessly with your team members
                      </div>
                    </div>
                    <div class="feature-item">
                      <div class="feature-icon">✓</div>
                      <div class="feature-text">
                        <strong>Powerful Project Management</strong><br>
                        Track progress, assign tasks, and hit deadlines
                      </div>
                    </div>
                    <div class="feature-item">
                      <div class="feature-icon">✓</div>
                      <div class="feature-text">
                        <strong>Stay Organized</strong><br>
                        Keep all your work in one centralized platform
                      </div>
                    </div>
                  </div>
                </div>

                <div class="footer">
                  <div class="footer-text">
                    This invitation was sent by ${inviterName} (${inviterEmail})
                  </div>
                  <div class="footer-text">
                    <a href="#" class="footer-link">Need help?</a> • 
                    <a href="#" class="footer-link">Contact support</a>
                  </div>
                  <div class="footer-text" style="margin-top: 20px;">
                    © 2024 Futures. All rights reserved.
                  </div>
                </div>
              </div>
            </body>
            </html>
          `
        };

        console.log(`📧 Sending email to ${email}...`);
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

    // Return account details for redirect
    res.status(200).json({
      message: 'Invitation accepted successfully',
      invitation,
      redirectUrl: 'https://monday-frontend-one.vercel.app/login',
      accountName: invitation.accountName
    });

  } catch (error) {
    console.error('❌ Error accepting invitation:', error);
    res.status(500).json({ 
      message: 'Error accepting invitation', 
      error: error.message 
    });
  }
};