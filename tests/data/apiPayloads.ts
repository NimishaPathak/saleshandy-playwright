/**
 * ApiPayloads — request/response payload examples for API tests.
 */

export const sequencePayloads = {
    createSimple: {
        name: 'Test Sequence',
        description: 'Automated test sequence',
    },

    createWithTemplate: {
        name: 'Template Sequence',
        templateId: 'template_123',
        description: 'Sequence created from template',
    },
};

export const prospectPayloads = {
    addSingle: {
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        company: 'Test Company',
    },

    addBatch: [
        {
            email: 'prospect1@example.com',
            firstName: 'Alice',
            lastName: 'Smith',
        },
        {
            email: 'prospect2@example.com',
            firstName: 'Bob',
            lastName: 'Jones',
        },
    ],
};

export const userUpdatePayloads = {
    updateProfile: {
        firstName: 'Updated',
        lastName: 'Name',
        phone: '+1 555-0100',
    },

    updateSettings: {
        timezone: 'UTC',
        language: 'en',
    },
};