@dashboard
Feature: Saleshandy Post-Onboarding Dashboard
  As a newly onboarded user
  I want to see the correct dashboard
  So that I can start using Saleshandy immediately

  # ════════════════════════════════════════════════════════════════
  # COMMON DASHBOARD ELEMENTS - All Account Types
  # ════════════════════════════════════════════════════════════════

  @smoke @regression @positive
  Scenario Outline: Dashboard loads correctly for each account type
    Given I have completed "<accountType>" onboarding and clicked Let's Start
    Then the dashboard should show the welcome message with my first name
    And the email verification banner should be visible
    And the trial expiry banner should show 7 days remaining
    And the "Create Sequence" button should be visible

    Examples:
      | accountType  |
      | personal     |
      | business     |
      | clients      |

  @regression @positive
  Scenario: Left sidebar renders all navigation icons
    Given I am on the dashboard
    Then the sidebar should show the "Sequences" icon
    And the sidebar should show the "Lead Finder" icon
    And the sidebar should show the "Settings" icon

  @regression @positive
  Scenario: Skip Onboarding link is visible
    Given I am on the dashboard
    Then the "Skip Onboarding" link should be visible
    When I click "Skip Onboarding"
    Then the onboarding checklist should be dismissed

  # ════════════════════════════════════════════════════════════════
  # ACCOUNT TYPE SPECIFIC DASHBOARD DIFFERENCES
  # ════════════════════════════════════════════════════════════════

  @smoke @regression @positive
  Scenario: Clients dashboard has 5-step checklist including Add Clients
    Given I have completed "clients" onboarding and clicked Let's Start
    Then the checklist should show "0/5 steps completed"
    And the checklist should contain "Generate AI Sequence"
    And the checklist should contain "Add Prospects"
    And the checklist should contain "Add Email Account"
    And the checklist should contain "Launch Sequence"
    And the checklist should contain "Add Clients"

  @smoke @regression @positive
  Scenario: Personal Use dashboard has 4-step checklist without Add Clients
    Given I have completed "personal" onboarding and clicked Let's Start
    Then the checklist should show "0/4 steps completed"
    And the checklist should NOT contain "Add Clients"

  @smoke @regression @positive
  Scenario: Business dashboard has 4-step checklist without Add Clients
    Given I have completed "business" onboarding and clicked Let's Start
    Then the checklist should show "0/4 steps completed"
    And the checklist should NOT contain "Add Clients"

  @regression @positive
  Scenario: Clients dashboard shows All Clients filter
    Given I have completed "clients" onboarding and clicked Let's Start
    Then the "All clients" dropdown filter should be visible in the sequences list
    And the "All clients" filter should NOT be visible for Personal Use accounts

  @regression @positive
  Scenario: Dashboard landing URL reflects usage selection
    Given I have completed "business" onboarding with "Lead Finder" usage selection
    Then the dashboard URL should contain "/v2/leads"

  # ════════════════════════════════════════════════════════════════
  # BANNER VALIDATIONS
  # ════════════════════════════════════════════════════════════════

  @regression @positive
  Scenario: Email verification banner shows correct message and links
    Given I am on the dashboard with unverified email
    Then the banner should contain "Check your registered email"
    And the banner should contain "check spam folder" link
    And the banner should contain "send again" link

  @regression @positive
  Scenario: Announcement banner is dismissible
    Given I am on the dashboard
    When I click the X on the announcement banner
    Then the announcement banner should disappear
