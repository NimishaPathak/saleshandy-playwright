import { faker } from '@faker-js/faker';

export type AccountType = 'personal' | 'business' | 'clients';

export interface SignupData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
}

export interface OnboardingData {
    accountType: AccountType;
    step2Option: string;
    step3Option: string;
    step4Option?: string;
    step5Option?: string;
}

/**
 * Generates a unique email with timestamp to avoid duplicate account errors.
 * Format: qatest+<timestamp>@gmail.com
 */
export function generateUniqueEmail(prefix = 'qatest'): string {
    const timestamp = Date.now();
    return `${prefix}+${timestamp}@gmail.com`;
}

/**
 * Generates a valid signup payload for a given account type.
 */
export function generateSignupData(accountType: AccountType): SignupData {
    const prefix = `qa${accountType}`;
    return {
        firstName: 'QA',
        lastName: accountType.charAt(0).toUpperCase() + accountType.slice(1),
        email: generateUniqueEmail(prefix),
        phone: '',                  // optional field — left blank intentionally
        password: 'Test@1234',
    };
}

/**
 * Returns the onboarding selections for each account type.
 * All values match the exact text visible in the UI.
 */
export function getOnboardingData(accountType: AccountType): OnboardingData {
    const map: Record<AccountType, OnboardingData> = {
        personal: {
            accountType: 'personal',
            step2Option: 'Freelancer',                  // occupation
            step3Option: 'Cold Outreach',               // usage mode
            step4Option: '0 - 30K',                     // email volume
        },
        business: {
            accountType: 'business',
            step2Option: 'Generate B2B Leads / Book Meetings',  // primary goal
            step3Option: 'No, I have not',                      // prior tool experience
            step4Option: 'Cold Outreach',                       // usage mode
            step5Option: 'Google',                              // how did you find us
        },
        clients: {
            accountType: 'clients',
            step2Option: 'Digital Marketing Agency',    // agency type
            step3Option: '6 - 20',                      // how many clients
            step4Option: '0 - 30K',                     // email volume
            step5Option: 'Google',                      // how did you find us
        },
    };

    return map[accountType];
}

/**
 * Random helpers for edge case and negative test data.
 */
export const TestData = {
    invalidEmails: [
        'notanemail',
        'missing@',
        '@nodomain.com',
        'spaces in@email.com',
        '',
    ],
    weakPasswords: [
        'short',          // less than 8 chars
        'nouppercase1',   // no uppercase
        'NOLOWERCASE1',   // no lowercase
        'NoNumbers!',     // no number
        '',               // empty
    ],
    validPassword: 'Test@1234',
    sqlInjection: "' OR '1'='1",
    xssPayload: '<script>alert(1)</script>',
    longString: 'A'.repeat(101),
};