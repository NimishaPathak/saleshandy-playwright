import { generateUniqueEmail, TestData } from '@utils/randomData';

export const signupTestData = {
    validSignup: {
        firstName: 'QA',
        lastName: 'Automation',
        email: generateUniqueEmail('qatest'),
        phone: '+91 9876543210',
        password: TestData.validPassword,
    },

    validSignupNoPhone: {
        firstName: 'QA',
        lastName: 'NoPhone',
        email: generateUniqueEmail('qatest'),
        phone: '',
        password: TestData.validPassword,
    },

    invalidEmails: TestData.invalidEmails,
    weakPasswords: TestData.weakPasswords,
    sqlInjection: TestData.sqlInjection,
    xssPayload: TestData.xssPayload,
    longString: TestData.longString,
};