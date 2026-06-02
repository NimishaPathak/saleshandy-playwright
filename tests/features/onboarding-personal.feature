@onboarding @personal
Feature: Saleshandy Onboarding - Personal Use
  As a new Personal Use user
  I want to complete the onboarding wizard
  So that my experience is shaped for personal cold emailing

  Background:
    Given I navigate to the Saleshandy dashboard

  # ════════════════════════════════════════════════════════════════
  # POSITIVE SCENARIOS
  # ════════════════════════════════════════════════════════════════

  @smoke @regression @positive @personal
  Scenario: Personal Use dashboard loads correctly after onboarding
    Then I should land on the Saleshandy dashboard
    And the email verification banner should be visible
    And the trial expiry banner should show 7 days remaining

  @regression @positive @personal
  Scenario: Personal Use dashboard shows 4-step checklist
    Then I should land on the Saleshandy dashboard
    And the checklist should contain "Generate AI Sequence"
    And the checklist should contain "Add Prospects"
    And the checklist should contain "Add Email Account"
    And the checklist should contain "Launch Sequence"

  @regression @positive @personal
  Scenario: Personal Use dashboard does NOT show Add Clients step
    Then I should land on the Saleshandy dashboard
    And the checklist should NOT contain "Add Clients"

  @regression @positive @personal
  Scenario: Personal Use dashboard shows Create Sequence button
    Then I should land on the Saleshandy dashboard
    And the "Create Sequence" button should be visible

  @regression @positive @personal
  Scenario: Personal Use dashboard shows Skip Onboarding link
    Then I should land on the Saleshandy dashboard
    And the "Skip Onboarding" link should be visible on the dashboard
