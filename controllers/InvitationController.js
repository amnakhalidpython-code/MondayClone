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

        // Dynamic invitation URL
        const invitationUrl = `https://monday-frontend-one.vercel.app/one?ref=invitation&token=${invitationToken}&account=${accountName}`;
        
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
            </head>
            <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f7fa; line-height: 1.6;">
              <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f5f7fa;">
                <tr>
                  <td style="padding: 40px 20px;">
                    <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07); overflow: hidden;">
                      
                      <!-- Header with gradient -->
                      <tr>
                        <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 48px 40px; text-align: center;">
                          <h1 style="margin: 0 0 8px 0; font-size: 36px; font-weight: 700; color: #ffffff; letter-spacing: -0.5px;">Futures</h1>
                          <p style="margin: 0; font-size: 15px; color: rgba(255, 255, 255, 0.9); font-weight: 300;">Work Smarter, Together</p>
                        </td>
                      </tr>

                      <!-- Main content -->
                      <tr>
                        <td style="padding: 48px 40px;">
                          <!-- Greeting -->
                          <h2 style="margin: 0 0 24px 0; font-size: 28px; font-weight: 600; color: #1a202c;">You're Invited! 🎉</h2>
                          
                          <!-- Message -->
                          <p style="margin: 0 0 24px 0; font-size: 16px; color: #4a5568; line-height: 1.8;">
                            <strong style="color: #2d3748;">${inviterName}</strong> has invited you to join 
                            <strong style="color: #667eea;">${accountName}</strong> workspace on Futures. 
                            Start collaborating with your team and bring your projects to life!
                          </p>

                          <!-- CTA Button -->
                          <table role="presentation" style="margin: 32px 0;">
                            <tr>
                              <td style="text-align: center;">
                                <a href="${invitationUrl}" style="display: inline-block; padding: 16px 48px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4); transition: transform 0.2s;">
                                  Accept Invitation →
                                </a>
                              </td>
                            </tr>
                          </table>

                          <!-- Info Box -->
                          <table role="presentation" style="width: 100%; background: linear-gradient(135deg, #f6f8fb 0%, #e9ecef 100%); border-left: 4px solid #667eea; border-radius: 8px; margin: 32px 0;">
                            <tr>
                              <td style="padding: 24px;">
                                <table role="presentation" style="width: 100%;">
                                  <tr>
                                    <td style="padding-bottom: 12px;">
                                      <p style="margin: 0 0 4px 0; font-size: 13px; color: #718096; font-weight: 500;">Workspace</p>
                                      <p style="margin: 0; font-size: 15px; color: #2d3748; font-weight: 600;">${accountName}.futures.com</p>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td style="padding-bottom: 12px;">
                                      <p style="margin: 0 0 4px 0; font-size: 13px; color: #718096; font-weight: 500;">Your Login Email</p>
                                      <p style="margin: 0; font-size: 15px; color: #2d3748; font-weight: 600;">${email}</p>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>
                                      <p style="margin: 0 0 4px 0; font-size: 13px; color: #718096; font-weight: 500;">Role</p>
                                      <p style="margin: 0; font-size: 15px; color: #2d3748; font-weight: 600;">${role}</p>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                          </table>

                          <!-- Divider -->
                          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 32px 0;">

                          <!-- Features -->
                          <table role="presentation" style="width: 100%;">
                            <tr>
                              <td style="padding: 8px 0;">
                                <table role="presentation">
                                  <tr>
                                    <td style="vertical-align: top; padding-right: 12px;">
                                      <div style="width: 24px; height: 24px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 14px; font-weight: bold;">✓</div>
                                    </td>
                                    <td style="vertical-align: top;">
                                      <p style="margin: 0; font-size: 14px; color: #4a5568; line-height: 1.6;">
                                        <strong style="color: #2d3748;">Collaborate in Real-Time</strong><br>
                                        Work together seamlessly with your team members
                                      </p>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                            <tr>
                              <td style="padding: 8px 0;">
                                <table role="presentation">
                                  <tr>
                                    <td style="vertical-align: top; padding-right: 12px;">
                                      <div style="width: 24px; height: 24px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 14px; font-weight: bold;">✓</div>
                                    </td>
                                    <td style="vertical-align: top;">
                                      <p style="margin: 0; font-size: 14px; color: #4a5568; line-height: 1.6;">
                                        <strong style="color: #2d3748;">Powerful Project Management</strong><br>
                                        Track progress, assign tasks, and hit deadlines
                                      </p>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                            <tr>
                              <td style="padding: 8px 0;">
                                <table role="presentation">
                                  <tr>
                                    <td style="vertical-align: top; padding-right: 12px;">
                                      <div style="width: 24px; height: 24px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 14px; font-weight: bold;">✓</div>
                                    </td>
                                    <td style="vertical-align: top;">
                                      <p style="margin: 0; font-size: 14px; color: #4a5568; line-height: 1.6;">
                                        <strong style="color: #2d3748;">Stay Organized</strong><br>
                                        Keep all your work in one centralized platform
                                      </p>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>

                      <!-- Footer -->
                      <tr>
                        <td style="background-color: #f7fafc; padding: 32px 40px; border-top: 1px solid #e2e8f0; text-align: center;">
                          <p style="margin: 0 0 12px 0; font-size: 13px; color: #718096; line-height: 1.6;">
                            This invitation was sent by <strong>${inviterName}</strong> (${inviterEmail})
                          </p>
                          <p style="margin: 0 0 20px 0; font-size: 13px; color: #718096;">
                            <a href="#" style="color: #667eea; text-decoration: none; font-weight: 500;">Need help?</a> • 
                            <a href="#" style="color: #667eea; text-decoration: none; font-weight: 500;">Contact support</a>
                          </p>
                          <p style="margin: 0; font-size: 12px; color: #a0aec0;">
                            © 2024 Futures. All rights reserved.
                          </p>
                        </td>
                      </tr>

                    </table>
                  </td>
                </tr>
              </table>
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

    res.status(200).json({
      message: 'Invitation accepted successfully',
      invitation,
      redirectUrl: 'https://monday-frontend-one.vercel.app/one',
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