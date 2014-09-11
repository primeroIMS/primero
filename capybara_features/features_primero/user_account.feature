# JIRA PRIMERO-46
@javascript @primero
Feature: Primero user account
 As a product owner I want logged in users to be able to accurately maintain user profiles so that they are not dependent upon an administrator to change their profile details.

 Scenario: The My Account link exists
    Given I am logged in as an admin with username "primero" and password "primero"
    When I see the header
    Then I should have a "My Account" link which will lead me to the "Account Details" page

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
    And I press "Save"
    Then I should see "User was successfully updated"
    And I should see "George Harrison"
    And I should see "abcd@unicef.com"
    And I should see "Charleston"

