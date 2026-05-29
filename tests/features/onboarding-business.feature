@onboarding @business
Feature: Saleshandy Onboarding - Business
  As a new Business user
  I want to complete the onboarding wizard
  So that my experience is shaped for growing my business using cold emails

  Background:
    Given I have signed up and reached the onboarding page

  # ════════════════════════════════════════════════════════════════
  # POSITIVE SCENARIOS
  # ════════════════════════════════════════════════════════════════

  @smoke @regression @positive
  Scenario: Complete Business onboarding flow end to end
    When I select "Business" as account type
    And I select "Generate B2B Leads / Book Meetings" as my primary goal
    And I select "No, I have not" as my tool experience
    And I select "Cold Outreach" as my usage mode
    And I select "Google" as my discovery source
    Then the welcome modal should be displayed
    When I click "Let's Start"
    Then I should land on the Saleshandy dashboard

  @regression @positive
  Scenario: Business Step 2 shows primary goal question
    When I select "Business" as account type
    Then I should see the question "What is your primary goal for using Saleshandy?"

  @regression @positive
  Scenario: Business Step 2 is different from Personal Use Step 2
    When I select "Business" as account type
    Then I should see "What is your primary goal for using Saleshandy?"
    And I should NOT see "Please select your occupation"

  @regression @positive
  Scenario Outline: All primary goal options are selectable
    When I select "Business" as account type
    Then I should see the primary goal option "<goal>"

    Examples:
      | goal                                |
      | Generate B2B Leads / Book Meetings  |
      | Promote Products / Services         |
      | One-time Email Outreach             |
      | Outreach Candidates                 |
      | Link Building                       |
      | Other                               |

  @regression @positive
  Scenario: Business Step 3 shows tool experience question
    When I select "Business" as account type
    And I select "Generate B2B Leads / Book Meetings" as my primary goal
    Then I should see the question "Have you used a cold outreach tool like Saleshandy before?"

  @regression @positive
  Scenario Outline: All experience options are selectable
    When I select "Business" as account type
    And I select "Generate B2B Leads / Book Meetings" as my primary goal
    Then I should see the experience option "<experience>"

    Examples:
      | experience                                             |
      | Yes, I have                                            |
      | No, I have not                                         |
      | Not exactly, but I've used an email marketing tool     |

  @regression @positive
  Scenario: Business Step 4 shows usage mode question
    When I select "Business" as account type
    And I select "Generate B2B Leads / Book Meetings" as my primary goal
    And I select "No, I have not" as my tool experience
    Then I should see the question "How would you use Saleshandy?"

  @regression @positive
  Scenario: Business Step 5 shows discovery source question
    When I select "Business" as account type
    And I select "Generate B2B Leads / Book Meetings" as my primary goal
    And I select "No, I have not" as my tool experience
    And I select "Cold Outreach" as my usage mode
    Then I should see the question "How did you find us?"

  @regression @positive
  Scenario Outline: All discovery source options are selectable
    When I reach the Business discovery step
    Then I should see the discovery option "<source>"

    Examples:
      | source          |
      | LinkedIn        |
      | Blog            |
      | Google          |
      | Ads             |
      | YouTube         |
      | Recommendation  |

  @regression @positive
  Scenario: Discovery Other option reveals free text input
    When I reach the Business discovery step
    Then I should see the free text input "Other, write here.."
    When I type "X (Twitter)" in the other discovery input
    Then the text should be accepted

  @regression @positive
  Scenario: Business onboarding has exactly 6 steps
    When I complete the entire Business onboarding flow
    Then the onboarding should complete in exactly 6 steps

  # ════════════════════════════════════════════════════════════════
  # NEGATIVE SCENARIOS
  # ════════════════════════════════════════════════════════════════

  @regression @negative
  Scenario: Business flow does not show occupation question
    When I select "Business" as account type
    Then I should NOT see the question "Please select your occupation"

  @regression @negative
  Scenario: Business flow does not show client count question
    When I select "Business" as account type
    Then I should NOT see the question "How many clients do you serve?"

  # ════════════════════════════════════════════════════════════════
  # NAVIGATION SCENARIOS
  # ════════════════════════════════════════════════════════════════

  @regression @navigation
  Scenario: Back arrow works from each Business step
    When I select "Business" as account type
    And I select "Generate B2B Leads / Book Meetings" as my primary goal
    And I click the back arrow
    Then I should be back on the account type selection step
