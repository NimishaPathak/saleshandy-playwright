# 🎯 Saleshandy QA Automation Framework

> **Playwright TypeScript · BDD Cucumber · Page Object Model · API Testing · Storage State Auth**

A production-grade test automation framework built for the [Saleshandy](https://my.saleshandy.com) platform, covering sign-up flows, onboarding wizards, and dashboard validations across all 3 account types — **Personal Use**, **Business**, and **Clients (Agency)**.

---

## 📋 Table of Contents

- [About the Assignment](#about-the-assignment)
- [Tech Stack](#tech-stack)
- [Framework Architecture](#framework-architecture)
- [Folder Structure](#folder-structure)
- [Key Design Decisions](#key-design-decisions)
- [Test Coverage Summary](#test-coverage-summary)
- [Getting Started](#getting-started)
- [Running Tests](#running-tests)
- [Reports](#reports)
- [Environment Variables](#environment-variables)
- [Automation Coverage](#automation-coverage)

---

## 🎯 About the Assignment

This framework was built as a take-home QA assignment for **Saleshandy**, covering:

| Deliverable | Status |
|---|---|
| Manual test cases (Google Sheets) | ✅ 86 test cases across 8 modules |
| Playwright TypeScript BDD framework | ✅ Full BDD with Cucumber |
| Parameterized sign-up flow (all 3 account types) | ✅ Single reusable function |
| Storage state auth (no repeated login) | ✅ Per-account-type session reuse |
| GitHub repository with clean structure | ✅ This repo |
| API testing for faster coverage | ✅ 3 API spec files |

### Application Under Test

**URL:** `https://my.saleshandy.com`

The application has 3 account types, each with a distinct onboarding flow:

| Account Type | Onboarding Steps | Unique Elements |
|---|---|---|
| **Personal Use** | 5 steps | Occupation selector |
| **Business** | 6 steps | Primary goal + Experience + Discovery |
| **Clients (Agency)** | 6 steps | Agency type + Client count + "Add Clients" dashboard step |

---

## 🛠 Tech Stack

| Tool | Version | Purpose |
|---|---|---|
| [Playwright](https://playwright.dev) | ^1.44.0 | Browser automation engine |
| [TypeScript](https://www.typescriptlang.org) | ^5.4.5 | Type-safe automation |
| [@cucumber/cucumber](https://cucumber.io) | ^10.8.0 | BDD layer — Gherkin feature files |
| [@faker-js/faker](https://fakerjs.dev) | ^8.4.1 | Unique test data generation |
| [Allure](https://allurereport.org) | ^3.0.0 | Rich HTML test reporting |
| [dotenv](https://github.com/motdotla/dotenv) | ^16.4.5 | Environment variable management |

---

## 🏗 Framework Architecture

```
┌─────────────────────────────────────────────────┐
│                  Feature Files (.feature)        │
│         BDD Gherkin — readable by all            │
└────────────────────┬────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────┐
│              Step Definitions (.steps.ts)        │
│      Maps Gherkin steps to TypeScript code       │
└────────────────────┬────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────┐
│                Helpers (signupHelper,            │
│                onboardingHelper)                 │
│    Parameterized flows — single function         │
│    accepts accountType, drives correct path      │
└────────────────────┬────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────┐
│           Page Objects (POM Layer)               │
│  BasePage → SignupPage, OnboardingPage,          │
│  LoginPage, DashboardPage                        │
│  Locators as Locator getters (Pramod's pattern)  │
└────────────────────┬────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────┐
│         Fixtures + Storage State Auth            │
│  baseFixtures: pre-initialized page objects      │
│  auth.setup.ts: generates session per account    │
│  → Login happens ONCE, reused across all tests   │
└─────────────────────────────────────────────────┘
```

---

## 📁 Folder Structure

```
saleshandy-playwright/
├── playwright.config.ts          # Playwright + API project config
├── package.json                  # Dependencies + Cucumber config + npm scripts
├── tsconfig.json                 # TypeScript config with path aliases
├── .env.example                  # Environment variable template
├── README.md
│
├── src/
│   ├── pages/                    # Page Object Model
│   │   ├── BasePage.ts           # Base class: navigation, interactions, assertions
│   │   ├── LoginPage.ts          # Login page locators and actions
│   │   ├── SignupPage.ts         # Signup form — all 5 fields + SSO buttons
│   │   ├── OnboardingPage.ts     # All 3 onboarding paths (parameterized)
│   │   └── DashboardPage.ts     # Post-onboarding dashboard validations
│   │
│   ├── helpers/                  # Flow orchestrators
│   │   ├── signupHelper.ts       # Signup with generated or custom data
│   │   └── onboardingHelper.ts   # completeOnboarding(accountType) — one call drives all paths
│   │
│   ├── fixtures/                 # Playwright custom fixtures
│   │   ├── baseFixtures.ts       # Pre-initialized page objects + helpers
│   │   └── pageFixtures.ts       # Auth state injection per account type
│   │
│   ├── hooks/
│   │   └── auth.setup.ts         # Generates storageState.*.json files (runs once)
│   │
│   ├── api/                      # API client layer
│   │   ├── apiClient.ts          # Base HTTP wrapper (GET/POST/PUT/DELETE)
│   │   ├── sequencesApi.ts       # /v1/sequences endpoints
│   │   ├── prospectsApi.ts       # /v1/prospects endpoints
│   │   └── userApi.ts            # /v1/user endpoints
│   │
│   └── utils/
│       ├── randomData.ts         # Unique email generator + onboarding data maps
│       └── logger.ts             # Structured step/info/error/API logging
│
├── tests/
│   ├── features/                 # Gherkin BDD feature files
│   │   ├── signup.feature
│   │   ├── onboarding-personal.feature
│   │   ├── onboarding-business.feature
│   │   ├── onboarding-clients.feature
│   │   └── dashboard.feature
│   │
│   ├── step-definitions/         # TypeScript step implementations
│   │   ├── signup.steps.ts
│   │   ├── onboarding.steps.ts
│   │   └── dashboard.steps.ts
│   │
│   ├── api-tests/               # Playwright-native API specs (no browser)
│   │   ├── sequences.api.spec.ts
│   │   ├── prospects.api.spec.ts
│   │   └── user.api.spec.ts
│   │
│   ├── data/                    # Centralized test data
│   │   ├── signupData.ts
│   │   ├── onboardingData.ts
│   │   └── apiPayloads.ts
│   │
│   └── support/                 # Cucumber world + hooks
│       ├── world.ts             # CustomWorld: browser/page shared across steps
│       └── hooks.ts             # Before/After: open browser, screenshot on fail
│
└── auth/                        # Generated session files (gitignored)
    ├── storageState.personal.json
    ├── storageState.business.json
    └── storageState.clients.json
```

---

## 🔑 Key Design Decisions

### 1. Parameterized Onboarding Flow
A single `completeOnboarding(accountType)` method drives all 3 account paths internally. No duplicate code — the correct path is resolved at runtime:

```typescript
// One call — handles Personal Use, Business, or Clients automatically
await onboardingHelper.completeOnboarding('clients');
```

### 2. Storage State Auth (No Repeated Login)
`auth.setup.ts` runs once per account type, creates a real account, completes onboarding, and saves the browser session to `auth/storageState.*.json`. All subsequent tests load this state — login is skipped entirely.

```typescript
// auth.setup.ts — runs once
const storageState = await context.storageState();
fs.writeFileSync(`auth/storageState.${accountType}.json`, JSON.stringify(storageState));
```

### 3. Hybrid Locator Strategy
All locators are `Locator` objects returned from getter methods — never raw strings scattered in test code:

```typescript
// Getter returns Locator object
get firstNameInput(): Locator {
  return this.page.locator('input[placeholder="John"]');
}

// Semantic locators where meaningful
get signUpButton(): Locator {
  return this.page.getByRole('button', { name: /sign up/i });
}
```

### 4. API Tests as Fast Smoke Layer
API tests run without a browser and complete in seconds. They validate auth, schema, status codes, and response times — catching backend issues before the slower UI suite runs.

### 5. BDD with Cucumber
Feature files are written in plain Gherkin — readable by non-technical stakeholders. Tags (`@smoke`, `@regression`, `@positive`, `@negative`, `@edge`) allow selective test execution.

---

## 📊 Test Coverage Summary

### Manual Test Cases: 86 Total

| Module | Test Cases | Coverage |
|---|---|---|
| Signup Form | 24 | Positive, Negative, Edge (XSS, SQLi, validation) |
| Onboarding Step 1 | 6 | Account type selection, visual states |
| Onboarding — Personal Use | 10 | Full 5-step flow, all options |
| Onboarding — Business | 10 | Full 6-step flow, unique steps |
| Onboarding — Clients | 9 | Full 6-step flow, agency-specific |
| Dashboard | 10 | Account-type differences, banners |
| Navigation | 7 | Back/forward, progress bar, URL |
| Account Validations | 10 | UI differences across 3 account types |

### Automated BDD Scenarios

| Feature File | Scenarios | Tags |
|---|---|---|
| signup.feature | 16 | @smoke @regression @positive @negative @edge |
| onboarding-personal.feature | 14 | @smoke @regression @positive @negative @navigation |
| onboarding-business.feature | 13 | @smoke @regression @positive @negative @navigation |
| onboarding-clients.feature | 14 | @smoke @regression @positive @negative @navigation |
| dashboard.feature | 10 | @smoke @regression @positive |

### API Tests

| Spec File | Tests | Coverage |
|---|---|---|
| sequences.api.spec.ts | 7 | List, schema, auth, pagination, 404, perf |
| prospects.api.spec.ts | 5 | List, schema, auth errors, 404, perf |
| user.api.spec.ts | 5 | Profile, schema, auth variants, perf |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm 9+
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/NimishaPathak/saleshandy-playwright.git
cd saleshandy-playwright

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install chromium firefox
```

### Environment Setup

```bash
# Copy the example env file
cp .env.example .env

# Fill in your credentials in .env
# PERSONAL_EMAIL, PERSONAL_PASSWORD
# BUSINESS_EMAIL, BUSINESS_PASSWORD
# CLIENTS_EMAIL, CLIENTS_PASSWORD
# API_KEY (from my.saleshandy.com/settings/api-keys)
```

---

## ▶️ Running Tests

### Generate Auth State (Run Once First)

```bash
npm run auth:setup
```

This creates `auth/storageState.*.json` for all 3 account types.

### Run All BDD Tests

```bash
npm test
```

### Run by Account Type

```bash
npm run test:personal   # Personal Use scenarios only
npm run test:business   # Business scenarios only
npm run test:clients    # Clients scenarios only
```

### Run by Tag

```bash
npm run test:smoke       # @smoke — critical path only
npm run test:regression  # @regression — full suite
```

### Run API Tests Only

```bash
npm run test:api
```

### Run Specific Feature

```bash
npx cucumber-js tests/features/signup.feature
npx cucumber-js tests/features/onboarding-clients.feature
```

---

## 📈 Reports

### Allure Report (Rich HTML)

```bash
# Generate and open
npm run allure:report

# Or separately
npm run allure:generate
npm run allure:open
```

### Cucumber HTML Report

After running tests, open:
```
cucumber-report/cucumber-report.html
```

---

## 🔐 Environment Variables

| Variable | Required | Description |
|---|---|---|
| `BASE_URL` | ✅ | `https://my.saleshandy.com` |
| `PERSONAL_EMAIL` | ✅ | Email for Personal Use test account |
| `PERSONAL_PASSWORD` | ✅ | Password for Personal Use account |
| `BUSINESS_EMAIL` | ✅ | Email for Business test account |
| `BUSINESS_PASSWORD` | ✅ | Password for Business account |
| `CLIENTS_EMAIL` | ✅ | Email for Clients test account |
| `CLIENTS_PASSWORD` | ✅ | Password for Clients account |
| `API_KEY` | ✅ | Saleshandy open API key |
| `API_BASE_URL` | ❌ | Defaults to `https://open-api.saleshandy.com/v1` |
| `HEADLESS` | ❌ | `true` (default) or `false` for headed mode |
| `DEFAULT_TIMEOUT` | ❌ | Default `30000` ms |

> ⚠️ Never commit `.env` to version control. It is gitignored.

---

## 👩‍💻 Author

**Nimisha Pathak**
QA Automation Engineer · Playwright · TypeScript · BDD

---

## 📝 Notes

- All onboarding flows were mapped from direct observation of the live Saleshandy application
- The parameterized flow design ensures adding a new account type requires changes in only one place
- API tests use `x-api-key` authentication against Saleshandy's open API (`open-api.saleshandy.com/v1`)
- Screenshots are automatically captured and attached to Cucumber reports on test failure