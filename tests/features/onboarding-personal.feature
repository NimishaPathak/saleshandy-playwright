@onboarding @personal
Feature: Saleshandy Onboarding - Personal Use
  As a new Personal Use user
  I want to complete the onboarding wizard
  So that my experience is shaped for personal cold emailing

  Background:
    Given I have signed up and reached the onboarding page

  # ════════════════════════════════════════════════════════════════
  # POSITIVE SCENARIOS
  # ════════════════════════════════════════════════════════════════

  @smoke @regression @positive
  Scenario: Complete Personal Use onboarding flow end to end
    When I select "Personal Use" as account type
    And I select "Freelancer" as my occupation
    And I select "Cold Outreach" as my usage mode
    And I select "0 - 30K" as my email volume
    Then the welcome modal should be displayed
    When I click "Let's Start"
    Then I should land on the Saleshandy dashboard

  @regression @positive
  Scenario: Onboarding modal shows personalized greeting
    Then the greeting should contain my first name
    And the modal title should be "Let's shape your experience"
    And the subtitle should be "Whom you are going to use it for?"

  @regression @positive
  Scenario: All 3 account type options are visible on Step 1
    Then I should see the "Clients" option with text "I want to outreach for my clients"
    And I should see the "Business" option with text "I want to grow my business using cold emails"
    And I should see the "Personal Use" option with text "I want to do cold emailing for personal use"

  @regression @positive
  Scenario: Selected account type option shows blue highlight
    When I select "Personal Use" as account type
    Then the "Personal Use" option should have a blue border highlight

  @regression @positive
  Scenario Outline: All Personal Use occupation options are selectable
    When I select "Personal Use" as account type
    Then I should see the occupation option "<occupation>"
    When I select "<occupation>" as my occupation
    Then I should be on the usage mode step

    Examples:
      | occupation            |
      | Freelancer            |
      | Influencer            |
      | Consultant / Advisor  |
      | Other                 |

  @regression @positive
  Scenario Outline: All usage mode options are selectable
    When I select "Personal Use" as account type
    And I select "Freelancer" as my occupation
    Then I should see the usage option "<usageMode>"

    Examples:
      | usageMode                    |
      | Cold Outreach                |
      | Lead Finder                  |
      | Find Leads & Cold Outreach   |

  @regression @positive
  Scenario Outline: All email volume options are selectable
    When I select "Personal Use" as account type
    And I select "Freelancer" as my occupation
    And I select "Cold Outreach" as my usage mode
    Then I should see the email volume option "<volume>"

    Examples:
      | volume          |
      | 0 - 30K         |
      | 30K - 100K      |
      | 100K - 250K     |
      | More than 250K  |

  @regression @positive
  Scenario: Welcome modal shows correct buttons
    When I complete the Personal Use onboarding steps
    Then the welcome modal should show "Welcome to Saleshandy!"
    And the "Explore Demo Account" button should be visible
    And the "Let's Start" button should be visible

  @regression @positive
  Scenario: Personal Use onboarding has exactly 5 steps
    When I select "Personal Use" as account type
    Then the progress bar should start filling
    When I complete all Personal Use onboarding steps
    Then the onboarding should complete in exactly 5 steps

  # ════════════════════════════════════════════════════════════════
  # NEGATIVE SCENARIOS
  # ════════════════════════════════════════════════════════════════

  @regression @negative
  Scenario: Forward arrow is disabled until option is selected
    When I am on onboarding Step 1
    Then the forward arrow should be disabled
    When I select "Personal Use" as account type
    Then I should automatically advance to Step 2

  @regression @negative
  Scenario: Personal Use flow does not show discovery source step
    When I complete Personal Use steps through email volume
    Then I should NOT see the "How did you find us?" step
    And the welcome modal should appear directly

  # ════════════════════════════════════════════════════════════════
  # NAVIGATION SCENARIOS
  # ════════════════════════════════════════════════════════════════

  @regression @navigation
  Scenario: Back arrow navigates to previous step
    When I select "Personal Use" as account type
    And I select "Freelancer" as my occupation
    And I click the back arrow
    Then I should be back on the account type selection step

  @regression @navigation
  Scenario: Changing account type from Personal Use to Business resets flow
    When I select "Personal Use" as account type
    And I click the back arrow
    And I select "Business" as account type
    Then I should see the primary goal question for Business
    And I should NOT see the occupation question
