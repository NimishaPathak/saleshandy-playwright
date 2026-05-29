@onboarding @clients
Feature: Saleshandy Onboarding - Clients (Agency)
  As a new Agency user
  I want to complete the onboarding wizard
  So that my experience is shaped for managing client outreach

  Background:
    Given I have signed up and reached the onboarding page

  # ════════════════════════════════════════════════════════════════
  # POSITIVE SCENARIOS
  # ════════════════════════════════════════════════════════════════

  @smoke @regression @positive
  Scenario: Complete Clients onboarding flow end to end
    When I select "Clients" as account type
    And I select "Digital Marketing Agency" as my agency type
    And I select "6 - 20" as my client count
    And I select "0 - 30K" as my email volume
    And I select "Google" as my discovery source
    Then the welcome modal should be displayed
    When I click "Let's Start"
    Then I should land on the Saleshandy dashboard

  @regression @positive
  Scenario: Clients Step 2 shows agency type question
    When I select "Clients" as account type
    Then I should see the question "What type of agency are you?"

  @regression @positive
  Scenario Outline: All agency type options are selectable
    When I select "Clients" as account type
    Then I should see the agency type option "<agencyType>"

    Examples:
      | agencyType                  |
      | Lead Generation Agency      |
      | Sales Agency                |
      | Digital Marketing Agency    |
      | Social Media Agency         |
      | Recruitment Agency          |
      | Other                       |

  @regression @positive
  Scenario: Clients Step 3 shows client count question
    When I select "Clients" as account type
    And I select "Digital Marketing Agency" as my agency type
    Then I should see the question "How many clients do you serve?"

  @regression @positive
  Scenario Outline: All client count options are selectable
    When I select "Clients" as account type
    And I select "Digital Marketing Agency" as my agency type
    Then I should see the client count option "<count>"

    Examples:
      | count           |
      | 0 - 5           |
      | 6 - 20          |
      | 21 - 50         |
      | More than 50    |

  @regression @positive
  Scenario: Clients Step 4 shows email volume question
    When I select "Clients" as account type
    And I select "Digital Marketing Agency" as my agency type
    And I select "6 - 20" as my client count
    Then I should see the question "How many emails are you likely to send every month?"

  @regression @positive
  Scenario: Clients Step 5 shows discovery source question
    When I select "Clients" as account type
    And I select "Digital Marketing Agency" as my agency type
    And I select "6 - 20" as my client count
    And I select "0 - 30K" as my email volume
    Then I should see the question "How did you find us?"

  @regression @positive
  Scenario: Clients welcome modal shows agency-specific video
    When I complete the entire Clients onboarding flow
    Then the welcome modal should show "Welcome to Saleshandy!"
    And the welcome video should show "Welcome to Saleshandy for Agency!"

  @regression @positive
  Scenario: Clients onboarding has exactly 6 steps
    When I complete the entire Clients onboarding flow
    Then the onboarding should complete in exactly 6 steps

  # ════════════════════════════════════════════════════════════════
  # DASHBOARD VALIDATIONS — Clients Specific
  # ════════════════════════════════════════════════════════════════

  @smoke @regression @positive
  Scenario: Clients dashboard shows Add Clients step in checklist
    When I complete the Clients onboarding flow
    And I click "Let's Start"
    Then the onboarding checklist should show "0/5 steps completed"
    And the checklist should include the "Add Clients" step

  @regression @positive
  Scenario: Clients dashboard shows All Clients filter dropdown
    When I complete the Clients onboarding flow
    And I click "Let's Start"
    Then the sequences list should show the "All clients" filter dropdown

  @regression @positive
  Scenario: Email verification banner shown on Clients dashboard
    When I complete the Clients onboarding flow
    And I click "Let's Start"
    Then the email verification banner should be visible
    And the trial expiry banner should show 7 days remaining

  # ════════════════════════════════════════════════════════════════
  # NEGATIVE SCENARIOS
  # ════════════════════════════════════════════════════════════════

  @regression @negative
  Scenario: Clients flow does not show occupation question
    When I select "Clients" as account type
    Then I should NOT see the question "Please select your occupation"

  @regression @negative
  Scenario: Clients flow does not show primary goal question
    When I select "Clients" as account type
    Then I should NOT see the question "What is your primary goal for using Saleshandy?"

  @regression @negative
  Scenario: Clients flow does not show tool experience question
    When I select "Clients" as account type
    Then I should NOT see "Have you used a cold outreach tool like Saleshandy before?"

  @regression @negative
  Scenario: Clients flow does not show usage mode question
    When I select "Clients" as account type
    Then I should NOT see the question "How would you use Saleshandy?"

  # ════════════════════════════════════════════════════════════════
  # NAVIGATION SCENARIOS
  # ════════════════════════════════════════════════════════════════

  @regression @navigation
  Scenario: Back arrow returns to account type selection from agency step
    When I select "Clients" as account type
    And I click the back arrow
    Then I should be back on the account type selection step

  @regression @navigation
  Scenario: Skip Onboarding link is visible on Clients dashboard
    When I complete the Clients onboarding flow
    And I click "Let's Start"
    Then the "Skip Onboarding" link should be visible on the dashboard
