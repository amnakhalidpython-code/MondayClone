// scripts/seedNonprofitTemplates.js
import mongoose from 'mongoose';
import Template from '../models/Template.js';
import dotenv from 'dotenv';

dotenv.config();

const nonprofitTemplates = [
  {
    templateId: 'donor-management',
    name: 'Donor Management',
    category: 'Nonprofits',
    description: 'Centralize all donor data for easy management and donor engagement.',
    thumbnail: 'https://dapulse-res.cloudinary.com/image/upload/v1673356827/template_center/nonprofit/fundraising_crm/thumbnail/Fundraising_CRM.png',
    downloads: '11.1K',
    creator: 'monday.com',
    integrations: [
      { name: 'Gmail', icon: 'https://dapulse-res.cloudinary.com/image/upload/monday_platform/template-store/integrations/gmail.png' },
      { name: 'Excel', icon: 'https://dapulse-res.cloudinary.com/image/upload/monday_platform/template-store/integrations/excel.png' }
    ],
    boardStructure: {
      name: 'Donor Management Board',
      columns: {
        owner: true,
        status: true,
        dueDate: true,
        priority: false,
        lastUpdated: true,
        timeline: false,
        notes: true,
        budget: true,
        files: false
      },
      sampleItems: [
        {
          title: 'John Anderson - $5,000 Donation',
          group: 'Major Donors',
          data: {
            owner: 'Sarah M.',
            status: 'Active',
            dueDate: '2025-01-15',
            notes: 'Long-term supporter',
            budget: 5000
          }
        }
      ],
      settings: {
        backgroundColor: '#ffffff',
        isPublic: false,
        allowComments: true
      }
    }
  },
  
  {
    templateId: 'grants-management',
    name: 'Grants Management',
    category: 'Nonprofits',
    description: 'Manage your grant pipeline from A-Z and easily generate reports.',
    thumbnail: 'https://dapulse-res.cloudinary.com/image/upload/v1673356908/template_center/nonprofit/grants_management/thumbnail/Grants_Management.png',
    downloads: '12.5K',
    creator: 'monday.com',
    integrations: [
      { name: 'Outlook', icon: 'https://dapulse-res.cloudinary.com/image/upload/monday_platform/template-store/integrations/outlook.png' },
      { name: 'Gmail', icon: 'https://dapulse-res.cloudinary.com/image/upload/monday_platform/template-store/integrations/gmail.png' }
    ],
    boardStructure: {
      name: 'Grants Management Board',
      columns: {
        owner: true,
        status: true,
        dueDate: true,
        priority: true,
        lastUpdated: true,
        timeline: true,
        notes: true,
        budget: true,
        files: true
      },
      sampleItems: [
        {
          title: 'Community Development Grant 2025',
          group: 'Active Applications',
          data: {
            owner: 'Team Lead',
            status: 'In Progress',
            dueDate: '2025-03-15',
            priority: 'High',
            budget: 50000
          }
        }
      ]
    }
  },
  
  {
    templateId: 'fundraising-pipeline',
    name: 'monday Fundraising',
    category: 'Nonprofits',
    description: 'Streamline fundraising processes to build stronger donor relationships.',
    thumbnail: 'https://dapulse-res.cloudinary.com/image/upload/v1673356827/template_center/nonprofit/fundraising_crm/thumbnail/Fundraising_CRM.png',
    downloads: '3.4K',
    creator: 'monday.com',
    integrations: [
      { name: 'Gmail', icon: 'https://dapulse-res.cloudinary.com/image/upload/monday_platform/template-store/integrations/gmail.png' }
    ],
    boardStructure: {
      name: 'Fundraising Pipeline',
      columns: {
        owner: true,
        status: true,
        dueDate: true,
        priority: false,
        lastUpdated: true,
        timeline: true,
        notes: true,
        budget: true,
        files: false
      },
      sampleItems: [
        {
          title: 'Annual Gala 2025',
          group: 'Major Campaigns',
          data: {
            owner: 'Events Team',
            status: 'Active',
            dueDate: '2025-02-15',
            budget: 100000
          }
        }
      ]
    }
  },
  
  {
    templateId: 'volunteer-management',
    name: 'Volunteer Registration Management',
    category: 'Nonprofits',
    description: 'Capture, connect, and manage all volunteer data in one place.',
    thumbnail: 'https://dapulse-res.cloudinary.com/image/upload/v1673357012/template_center/nonprofit/volunteer_registration_management/thumbnail/Volunteer_Registration_Man....png',
    downloads: '33.3K',
    creator: 'monday.com',
    integrations: [
      { name: 'Survey Monkey', icon: 'https://dapulse-res.cloudinary.com/image/upload/monday_platform/template-store/integrations/survey_monkey.png' }
    ],
    boardStructure: {
      name: 'Volunteer Management Board',
      columns: {
        owner: true,
        status: true,
        dueDate: true,
        priority: false,
        lastUpdated: true,
        timeline: false,
        notes: true,
        budget: false,
        files: false
      },
      sampleItems: [
        {
          title: 'Emily Johnson - Event Planning',
          group: 'Regular Volunteers',
          data: {
            owner: 'Volunteer Coordinator',
            status: 'Active',
            dueDate: '2025-01-15',
            notes: 'Excellent with children'
          }
        }
      ]
    }
  }
];

const seedTemplates = async () => {
  try {
    // FIXED: Changed MONGODB_URI to MONGO_URI to match your .env file
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
    
    if (!mongoUri) {
      throw new Error('MongoDB URI not found in environment variables. Check your .env file.');
    }

    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Clear existing templates
    await Template.deleteMany({ category: 'Nonprofits' });
    console.log('🗑️  Cleared existing Nonprofit templates');

    // Insert new templates
    await Template.insertMany(nonprofitTemplates);
    console.log('✅ Nonprofit templates seeded successfully');
    console.log(`📊 Total templates inserted: ${nonprofitTemplates.length}`);

    mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error seeding templates:', error);
    mongoose.connection.close();
    process.exit(1);
  }
};

seedTemplates();