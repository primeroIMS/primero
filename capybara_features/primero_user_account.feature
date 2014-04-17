# JIRA PRIMERO-46

@javascript
Feature: As a logged in social worker, I want to be able to view and edit my account page

  Scenario: I am a logged in social worker and I want to edit some information on the account page
    Given an admin "primero" with a password "primero"
    When I log in as user "primero" using password "primero"
    When I access edit user page for primero
    And I fill in the following:
      | Full Name         | George Harrison     |
      | Email             | abcd@unicef.com     |
      | Location          | Charleston          |
    And I press "Update"
    Then I should see "User was successfully updated"
    And I should see "George Harrison"
    And I should see "abcd@unicef.com"
    And I should see "Charleston"

