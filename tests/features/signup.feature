@signup
Feature: Saleshandy Sign Up
  As a new user
  I want to create a Saleshandy account
  So that I can access the platform

  Background:
    Given I am on the Saleshandy signup page

  # ════════════════════════════════════════════════════════════════
  # POSITIVE SCENARIOS
  # ════════════════════════════════════════════════════════════════

  @smoke @regression @positive
  Scenario: Successful signup with all valid fields
    When I fill in the signup form with valid details
      | firstName | lastName   | email                          | password    |
      | QA        | Automation | qatest+{timestamp}@gmail.com   | Test@1234   |
    And I click the Sign up button
    Then I should be redirected to the onboarding page
    And the onboarding modal should be visible

  @smoke @regression @positive
  Scenario: Successful signup without phone number
    When I fill in the signup form without phone number
      | firstName | lastName | email                        | password  |
      | QA        | Test     | qatest+{timestamp}@gmail.com | Test@1234 |
    And I click the Sign up button
    Then I should be redirected to the onboarding page

  @regression @positive
  Scenario: Password strength indicator shows green on valid password
    When I enter a valid password "Test@1234"
    Then the password secured message should be visible

  @regression @positive
  Scenario Outline: Sign up page loads with all required elements
    Then the signup page should display the "<element>" element

    Examples:
      | element               |
      | First name field      |
      | Last name field       |
      | Work email field      |
      | Password field        |
      | Sign up button        |
      | Sign up with Google   |
      | Sign up with Microsoft|

  @regression @positive
  Scenario: Personal Gmail accepted as work email
    When I fill in the signup form with valid details
      | firstName | lastName | email                       | password  |
      | QA        | Gmail    | qatest+{timestamp}@gmail.com | Test@1234 |
    And I click the Sign up button
    Then I should be redirected to the onboarding page

  # ════════════════════════════════════════════════════════════════
  # NEGATIVE SCENARIOS
  # ════════════════════════════════════════════════════════════════

  @regression @negative
  Scenario: Signup with empty first name shows validation error
    When I submit the signup form with empty first name
    Then I should see the error message "First name is required."

  @regression @negative
  Scenario: Signup with empty last name shows validation error
    When I submit the signup form with empty last name
    Then I should see a validation error for last name

  @regression @negative
  Scenario: Signup with empty email shows validation error
    When I submit the signup form with empty email
    Then I should see a validation error for email

  @regression @negative
  Scenario: Signup with empty password shows validation error
    When I submit the signup form with empty password
    Then I should see a validation error for password

  @regression @negative
  Scenario Outline: Signup with invalid email format shows error
    When I enter an invalid email "<invalidEmail>"
    And I click the Sign up button
    Then I should see a validation error for email

    Examples:
      | invalidEmail        |
      | notanemail          |
      | missing@            |
      | @nodomain.com       |
      | spaces in@email.com |

  @regression @negative
  Scenario: Signup with already registered email shows error
    When I fill in the signup form with an already registered email
    And I click the Sign up button
    Then I should see an error that the email is already registered

  @regression @negative
  Scenario Outline: Signup with weak password shows validation
    When I enter a weak password "<password>"
    Then the password strength indicator should show a requirement not met

    Examples:
      | password      |
      | short1A       |
      | nouppercase1  |
      | NOLOWERCASE1  |
      | NoNumbers!    |

  # ════════════════════════════════════════════════════════════════
  # EDGE CASES
  # ════════════════════════════════════════════════════════════════

  @regression @edge
  Scenario: SQL injection in email field is handled safely
    When I enter "' OR '1'='1" in the email field
    And I click the Sign up button
    Then the application should not crash or expose database errors

  @regression @edge
  Scenario: XSS payload in first name field is sanitized
    When I enter "<script>alert(1)</script>" in the first name field
    And I click the Sign up button
    Then the script should not be executed

  @regression @edge
  Scenario: Password toggle eye icon shows and hides password
    When I enter a password "Test@1234"
    And I click the password toggle icon
    Then the password text should be visible
    When I click the password toggle icon again
    Then the password text should be masked

  @regression @edge
  Scenario: No email verification required after signup
    When I fill in the signup form with valid details
      | firstName | lastName | email                        | password  |
      | QA        | Test     | qatest+{timestamp}@gmail.com | Test@1234 |
    And I click the Sign up button
    Then I should be redirected to the onboarding page directly
    And no email verification screen should be shown
