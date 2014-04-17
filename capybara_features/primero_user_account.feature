# JIRA PRIMERO-46

@javascript
Feature: As a logged in social worker, I want to be able to view and edit my account page

  Scenario: I am a logged in user and I want to confirm that fields on the edit account page are present
    Given I am logged in as an admin with username "primero" and password "primero"
    When I access edit user page for "primero"
    Then I should see "Full Name"
    And I should see "User Name"
    And I should see "Password"
    And I should see "Re-enter password"
    And I should see "Phone"
    And I should see "Email"
    And I should see "Organisation"
    And I should see "Position"
    And I should see "Location"

  Scenario: I am a logged in user and I want to edit some information on the account page
    Given I am logged in as an admin with username "primero" and password "primero"
    When I access edit user page for "primero"
    And I fill in the following:
      | Full Name         | George Harrison     |
      | Email             | abcd@unicef.com     |
      | Location          | Charleston          |
    And I press "Update"
    Then I should see "User was successfully updated"
    And I should see "George Harrison"
    And I should see "abcd@unicef.com"
    And I should see "Charleston"

