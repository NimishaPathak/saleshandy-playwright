@dashboard
Feature: Saleshandy Post-Onboarding Dashboard
  As a newly onboarded user
  I want to see the correct dashboard
  So that I can start using Saleshandy immediately

  Background:
    Given I navigate to the Saleshandy dashboard

  # ════════════════════════════════════════════════════════════════
  # PERSONAL USE DASHBOARD
  # ════════════════════════════════════════════════════════════════

  @smoke @regression @positive @personal
  Scenario: Personal Use dashboard has correct checklist without Add Clients
    Then I should land on the Saleshandy dashboard
    And the checklist should NOT contain "Add Clients"

  # ════════════════════════════════════════════════════════════════
  # BUSINESS DASHBOARD
  # ════════════════════════════════════════════════════════════════

  @smoke @regression @positive @business
  Scenario: Business dashboard has correct checklist without Add Clients
    Then I should land on the Saleshandy dashboard
    And the checklist should NOT contain "Add Clients"

  # ════════════════════════════════════════════════════════════════
  # CLIENTS DASHBOARD
  # ════════════════════════════════════════════════════════════════

  @smoke @regression @positive @clients
  Scenario: Clients dashboard uniquely shows Add Clients step
    Then I should land on the Saleshandy dashboard
    And the checklist should contain "Add Clients"

  @regression @positive @clients
  Scenario: Clients dashboard shows All Clients filter
    Then I should land on the Saleshandy dashboard
    And the sequences list should show the "All clients" filter dropdown
