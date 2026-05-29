import { Given, When, Then, DataTable } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { getPage } from '../support/world.ts';
import { SignupPage } from '@pages/SignupPage';
import { SignupHelper } from '@helpers/signupHelper';
import { generateUniqueEmail } from '@utils/randomData';
import { logger } from '@utils/logger';

// ── Page object instances resolved lazily via world ──────────
let signupPage: SignupPage;
let signupHelper: SignupHelper;

Given('I am on the Saleshandy signup page', async function () {
    const page = getPage(this);
    signupPage = new SignupPage(page);
    signupHelper = new SignupHelper(page);
    await signupPage.navigate();
    await signupPage.assertSignupPageLoaded();
});

// ── FILL FORM ────────────────────────────────────────────────

When('I fill in the signup form with valid details', async function (dataTable: DataTable) {
    const data = dataTable.hashes()[0];
    const email = generateUniqueEmail('qatest');
    await signupPage.fillSignupForm({
        firstName: data.firstName,
        lastName: data.lastName,
        email,
        phone: '',
        password: data.password,
    });
    // Store email for later assertions
    this.testEmail = email;
});

When('I fill in the signup form without phone number', async function (dataTable: DataTable) {
    const data = dataTable.hashes()[0];
    const email = generateUniqueEmail('qatest');
    await signupPage.fillSignupForm({
        firstName: data.firstName,
        lastName: data.lastName,
        email,
        phone: '',
        password: data.password,
    });
    this.testEmail = email;
});

When('I fill in the signup form with an already registered email', async function () {
    await signupPage.fillSignupForm({
        firstName: 'QA',
        lastName: 'Test',
        email: process.env.PERSONAL_EMAIL || 'nimishapathak29@gmail.com',
        phone: '',
        password: 'Test@1234',
    });
});

When('I submit the signup form with empty first name', async function () {
    await signupPage.fillSignupForm({
        firstName: '',
        lastName: 'Test',
        email: generateUniqueEmail('qatest'),
        phone: '',
        password: 'Test@1234',
    });
    await signupPage.submitForm();
});

When('I submit the signup form with empty last name', async function () {
    await signupPage.fillSignupForm({
        firstName: 'QA',
        lastName: '',
        email: generateUniqueEmail('qatest'),
        phone: '',
        password: 'Test@1234',
    });
    await signupPage.submitForm();
});

When('I submit the signup form with empty email', async function () {
    await signupPage.fillSignupForm({
        firstName: 'QA',
        lastName: 'Test',
        email: '',
        phone: '',
        password: 'Test@1234',
    });
    await signupPage.submitForm();
});

When('I submit the signup form with empty password', async function () {
    await signupPage.fillSignupForm({
        firstName: 'QA',
        lastName: 'Test',
        email: generateUniqueEmail('qatest'),
        phone: '',
        password: '',
    });
    await signupPage.submitForm();
});

// ── BUTTON CLICKS ────────────────────────────────────────────

When('I click the Sign up button', async function () {
    await signupPage.submitForm();
});

// ── PASSWORD FIELD ────────────────────────────────────────────

When('I enter a valid password {string}', async function (password: string) {
    await signupPage.fillField(signupPage.passwordInput, password);
});

When('I enter a weak password {string}', async function (password: string) {
    await signupPage.fillField(signupPage.passwordInput, password);
});

When('I enter an invalid email {string}', async function (email: string) {
    await signupPage.fillSignupForm({
        firstName: 'QA',
        lastName: 'Test',
        email,
        phone: '',
        password: 'Test@1234',
    });
});

When('I enter {string} in the email field', async function (value: string) {
    await signupPage.fillField(signupPage.workEmailInput, value);
});

When('I enter {string} in the first name field', async function (value: string) {
    await signupPage.fillField(signupPage.firstNameInput, value);
    await signupPage.fillField(signupPage.lastNameInput, 'Test');
    await signupPage.fillField(signupPage.workEmailInput, generateUniqueEmail('qatest'));
    await signupPage.fillField(signupPage.passwordInput, 'Test@1234');
});

When('I enter a password {string}', async function (password: string) {
    await signupPage.fillField(signupPage.passwordInput, password);
});

When('I click the password toggle icon', async function () {
    const page = getPage(this);
    // Eye icon locator — toggles password visibility
    const eyeIcon = page.locator('[class*="eye"], [class*="toggle"], input[type="password"] + *').first();
    await eyeIcon.click();
});

When('I click the password toggle icon again', async function () {
    const page = getPage(this);
    const eyeIcon = page.locator('[class*="eye"], [class*="toggle"], input[type="password"] + *').first();
    await eyeIcon.click();
});

// ── ASSERTIONS ───────────────────────────────────────────────

Then('I should be redirected to the onboarding page', async function () {
    await signupPage.assertRedirectedToOnboarding();
});

Then('I should be redirected to the onboarding page directly', async function () {
    await signupPage.assertRedirectedToOnboarding();
});

Then('the onboarding modal should be visible', async function () {
    const page = getPage(this);
    await expect(page.getByText("Let's shape your experience")).toBeVisible();
});

Then('the password secured message should be visible', async function () {
    await signupPage.assertPasswordSecured();
});

Then('I should see the error message {string}', async function (message: string) {
    const page = getPage(this);
    await expect(page.getByText(message)).toBeVisible();
});

Then('I should see a validation error for last name', async function () {
    const page = getPage(this);
    const error = page.locator('[class*="error"]').first();
    await expect(error).toBeVisible();
});

Then('I should see a validation error for email', async function () {
    const page = getPage(this);
    const error = page.locator('[class*="error"]').first();
    await expect(error).toBeVisible();
});

Then('I should see a validation error for password', async function () {
    const page = getPage(this);
    const error = page.locator('[class*="error"]').first();
    await expect(error).toBeVisible();
});

Then('I should see an error that the email is already registered', async function () {
    const page = getPage(this);
    const errorText = page.getByText(/already registered|already exists|account.*exist/i);
    await expect(errorText).toBeVisible();
});

Then('the password strength indicator should show a requirement not met', async function () {
    const page = getPage(this);
    // Green message should NOT appear for weak passwords
    const securedMsg = page.getByText("Your password is secured & You're all set!");
    await expect(securedMsg).not.toBeVisible();
});

Then('the signup page should display the {string} element', async function (element: string) {
    const page = getPage(this);
    const elementMap: Record<string, () => Promise<void>> = {
        'First name field': async () => await expect(signupPage.firstNameInput).toBeVisible(),
        'Last name field': async () => await expect(signupPage.lastNameInput).toBeVisible(),
        'Work email field': async () => await expect(signupPage.workEmailInput).toBeVisible(),
        'Password field': async () => await expect(signupPage.passwordInput).toBeVisible(),
        'Sign up button': async () => await expect(signupPage.signUpButton).toBeVisible(),
        'Sign up with Google': async () => await expect(signupPage.googleSignupButton).toBeVisible(),
        'Sign up with Microsoft': async () => await expect(signupPage.microsoftSignupButton).toBeVisible(),
    };
    const assertion = elementMap[element];
    if (!assertion) throw new Error(`Unknown element: ${element}`);
    await assertion();
});

Then('the application should not crash or expose database errors', async function () {
    const page = getPage(this);
    const url = page.url();
    // Should still be on signup page or show an error, not crash
    const hasServerError = await page.locator('text=/500|server error|database error/i').isVisible();
    expect(hasServerError).toBeFalsy();
});

Then('the script should not be executed', async function () {
    const page = getPage(this);
    // If XSS executed, an alert would appear — we verify no dialog fired
    let alertFired = false;
    page.on('dialog', () => { alertFired = true; });
    await page.waitForTimeout(1000);
    expect(alertFired).toBeFalsy();
});

Then('the password text should be visible', async function () {
    const page = getPage(this);
    const passwordField = page.locator('input[name="password"], input[placeholder*="Character"]');
    const fieldType = await passwordField.getAttribute('type');
    expect(fieldType).toBe('text');
});

Then('the password text should be masked', async function () {
    const page = getPage(this);
    const passwordField = page.locator('input[name="password"], input[placeholder*="Character"]');
    const fieldType = await passwordField.getAttribute('type');
    expect(fieldType).toBe('password');
});

Then('no email verification screen should be shown', async function () {
    const page = getPage(this);
    // Should be on onboarding URL, not on a verification page
    const url = page.url();
    expect(url).toContain('sequence?signup=completed');
    expect(url).not.toContain('verify');
    expect(url).not.toContain('confirm');
});