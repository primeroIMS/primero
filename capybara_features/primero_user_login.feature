# JIRA PRIMERO-25
Feature: As a logged out user, I can not access content until I log in

  Scenario: I am a logged out user who tries to access the register new child page
    Given I am on new child page
    Then I should see "Login details" on the page
    Then I should not see "Register New Child" on the page

  Scenario: I am a logged out user who tries to access the system settings page
    Given I am on new system settings page
    Then I should see "Login details" on the page
    Then I should not see "System settings" on the page

  Scenario: I am a logged out user who tries to access create form section page
    Given I am on new create form section page
    Then I should see "Login details" on the page
    Then I should not see "Visible" on the page

  Scenario: I log in successfully
    Given a user "primero" with a password "primero"
    When I log in as user "primero" using password "primero"
    Then I am redirected to the dashboard
    And there is a visual cue in the header showing me logged in as "primero"