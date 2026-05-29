/**
 * OnboardingData — centralized reference for all onboarding step options.
 * Used for validation and parameterization across all 3 account types.
 */

export const accountTypeLabels = {
    personal: 'Personal Use',
    business: 'Business',
    clients: 'Clients',
};

export const personalUseOptions = {
    occupations: ['Freelancer', 'Influencer', 'Consultant / Advisor', 'Other'],
    usageModes: ['Cold Outreach', 'Lead Finder', 'Find Leads & Cold Outreach'],
    emailVolumes: ['0 - 30K', '30K - 100K', '100K - 250K', 'More than 250K'],
};

export const businessOptions = {
    primaryGoals: [
        'Generate B2B Leads / Book Meetings',
        'Promote Products / Services',
        'One-time Email Outreach',
        'Outreach Candidates',
        'Link Building',
        'Other',
    ],
    experience: ['Yes, I have', 'No, I have not', 'Not exactly, but I\'ve used an email marketing tool'],
    usageModes: ['Cold Outreach', 'Lead Finder', 'Find Leads & Cold Outreach'],
    discoverySources: ['LinkedIn', 'Blog', 'Google', 'Ads', 'YouTube', 'Recommendation', 'Other'],
};

export const clientsOptions = {
    agencyTypes: [
        'Lead Generation Agency',
        'Sales Agency',
        'Digital Marketing Agency',
        'Social Media Agency',
        'Recruitment Agency',
        'Other',
    ],
    clientCounts: ['0 - 5', '6 - 20', '21 - 50', 'More than 50'],
    emailVolumes: ['0 - 30K', '30K - 100K', '100K - 250K', 'More than 250K'],
    discoverySources: ['LinkedIn', 'Blog', 'Google', 'Ads', 'YouTube', 'Recommendation', 'Other'],
};

export const defaultSelections = {
    personal: {
        occupation: 'Freelancer',
        usageMode: 'Cold Outreach',
        emailVolume: '0 - 30K',
    },
    business: {
        primaryGoal: 'Generate B2B Leads / Book Meetings',
        experience: 'No, I have not',
        usageMode: 'Cold Outreach',
        discovery: 'Google',
    },
    clients: {
        agencyType: 'Digital Marketing Agency',
        clientCount: '6 - 20',
        emailVolume: '0 - 30K',
        discovery: 'Google',
    },
};