@onboarding @clients
Feature: Saleshandy Onboarding - Clients (Agency)
  As a new Agency user
  I want to complete the onboarding wizard
  So that my experience is shaped for managing client outreach

  Background:
    Given I navigate to the Saleshandy dashboard

  # ════════════════════════════════════════════════════════════════
  # POSITIVE SCENARIOS
  # ════════════════════════════════════════════════════════════════

  @smoke @regression @positive @clients
  Scenario: Clients dashboard loads correctly after onboarding
    Then I should land on the Saleshandy dashboard
    And the email verification banner should be visible
    And the trial expiry banner should show 7 days remaining

  @smoke @regression @positive @clients
  Scenario: Clients dashboard shows Add Clients step in checklist
    Then I should land on the Saleshandy dashboard
    And the checklist should contain "Add Clients"

  @regression @positive @clients
  Scenario: Clients dashboard shows 5-step checklist
    Then I should land on the Saleshandy dashboard
    And the checklist should contain "Generate AI Sequence"
    And the checklist should contain "Add Prospects"
    And the checklist should contain "Add Email Account"
    And the checklist should contain "Launch Sequence"
    And the checklist should contain "Add Clients"

  @regression @positive @clients
  Scenario: Clients dashboard shows All Clients filter
    Then I should land on the Saleshandy dashboard
    And the sequences list should show the "All clients" filter dropdown

  @regression @positive @clients
  Scenario: Clients dashboard shows Create Sequence button
    Then I should land on the Saleshandy dashboard
    And the "Create Sequence" button should be visible
