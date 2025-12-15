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
      
      // ✅ VIEWS ADDED
      views: [
        {
          id: 'donor-pipeline',
          name: 'Donor Pipeline',
          icon: 'board',
          type: 'main',
          isDefault: true,
          settings: {
            groupBy: 'status',
            sortBy: 'budget'
          }
        },
        {
          id: 'getting-started',
          name: 'Getting Started',
          icon: 'document',
          type: 'table',
          isDefault: false,
          settings: {
            description: 'Welcome guide for donor management'
          }
        },
        {
          id: 'donor-list',
          name: 'All Donors',
          icon: 'board',
          type: 'table',
          isDefault: false,
          settings: {
            columns: ['name', 'contact', 'totalDonations', 'lastContact']
          }
        },
        {
          id: 'donor-dashboard',
          name: 'Donor Dashboard',
          icon: 'chart',
          type: 'dashboard',
          isDefault: false,
          settings: {
            widgets: ['totalDonors', 'monthlyRevenue', 'topDonors']
          }
        }
      ],
      
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
      { name: 'Gmail', icon: 'https://dapulse-res.cloudinary.com/image/upload/monday_platform/template-store/integrations/gmail.png' },
      { name: 'Google Drive', icon: 'https://dapulse-res.cloudinary.com/image/upload/monday_platform/template-store/integrations/google_drive.png' }
    ],
    boardStructure: {
      name: 'Grants Management',
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
      
      // ✅ VIEWS CONFIGURATION
      views: [
        {
          id: 'grants-pipeline',
          name: 'Grants Pipeline',
          icon: 'board',
          type: 'main',
          isDefault: true,
          settings: {
            groupBy: 'status',
            sortBy: 'dueDate'
          }
        },
        {
          id: 'getting-started',
          name: 'Getting Started',
          icon: 'document',
          type: 'table',
          isDefault: false,
          settings: {
            description: 'Welcome guide and setup instructions'
          }
        },
        {
          id: 'grant-providers',
          name: 'Grant Providers',
          icon: 'board',
          type: 'table',
          isDefault: false,
          settings: {
            columns: ['providerName', 'contact', 'focus', 'deadline']
          }
        },
        {
          id: 'grants-dashboard',
          name: 'Grants Dashboard',
          icon: 'chart',
          type: 'dashboard',
          isDefault: false,
          settings: {
            widgets: ['totalGrants', 'upcomingDeadlines', 'statusChart']
          }
        }
      ],
      
      sampleItems: [
        {
          title: 'Community Development Grant 2025',
          group: 'Active Applications',
          data: {
            owner: 'Grant Team',
            status: 'In Progress',
            dueDate: '2025-03-15',
            priority: 'High',
            notes: 'Letter of intent submitted',
            budget: 50000
          }
        },
        {
          title: 'Education Initiative Fund',
          group: 'Research Phase',
          data: {
            owner: 'Research Team',
            status: 'Planning',
            dueDate: '2025-04-01',
            priority: 'Medium',
            notes: 'Gathering requirements',
            budget: 25000
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
      
      // ✅ VIEWS ADDED
      views: [
        {
          id: 'campaign-pipeline',
          name: 'Campaign Pipeline',
          icon: 'board',
          type: 'main',
          isDefault: true,
          settings: {
            groupBy: 'status',
            sortBy: 'dueDate'
          }
        },
        {
          id: 'getting-started',
          name: 'Getting Started',
          icon: 'document',
          type: 'table',
          isDefault: false,
          settings: {
            description: 'Setup guide for fundraising campaigns'
          }
        },
        {
          id: 'calendar-view',
          name: 'Campaign Calendar',
          icon: 'calendar',
          type: 'calendar',
          isDefault: false,
          settings: {
            dateField: 'dueDate'
          }
        },
        {
          id: 'fundraising-dashboard',
          name: 'Fundraising Dashboard',
          icon: 'chart',
          type: 'dashboard',
          isDefault: false,
          settings: {
            widgets: ['totalRaised', 'activeCampaigns', 'goalProgress']
          }
        }
      ],
      
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
      ],
      settings: {
        backgroundColor: '#ffffff',
        isPublic: false,
        allowComments: true
      }
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
      
      // ✅ VIEWS ADDED
      views: [
        {
          id: 'volunteer-list',
          name: 'All Volunteers',
          icon: 'board',
          type: 'main',
          isDefault: true,
          settings: {
            groupBy: 'status',
            sortBy: 'name'
          }
        },
        {
          id: 'getting-started',
          name: 'Getting Started',
          icon: 'document',
          type: 'table',
          isDefault: false,
          settings: {
            description: 'Volunteer management setup guide'
          }
        },
        {
          id: 'volunteer-schedule',
          name: 'Schedule',
          icon: 'calendar',
          type: 'calendar',
          isDefault: false,
          settings: {
            dateField: 'dueDate'
          }
        },
        {
          id: 'volunteer-dashboard',
          name: 'Volunteer Dashboard',
          icon: 'chart',
          type: 'dashboard',
          isDefault: false,
          settings: {
            widgets: ['totalVolunteers', 'activeVolunteers', 'upcomingEvents']
          }
        }
      ],
      
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
      ],
      settings: {
        backgroundColor: '#ffffff',
        isPublic: false,
        allowComments: true
      }
    }
  }
];

const seedTemplates = async () => {
  try {
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