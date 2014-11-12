# JIRA Primero-145
# JIRA Primero-202
# JIRA PRIMERO-353
# JIRA PRIMERO-363
# JIRA PRIMERO-455
# JIRA PRIMERO-736

@javascript @primero
Feature: Shared Fields
  As an administrator, I want to be able to allow fields to be shared between forms

  Scenario: As a logged in user, I create a case and I should see shared fields populated with the same value
    Given I am logged in as an admin with username "primero_cp" and password "primero"
    When I access "cases page"
    And I press the "New Case" button
    And I press the "Family / Partner Details" button
    And I click on "Partner/Spouse Details" in form group "Family / Partner Details"
    And I select "Single" from "Current Civil/Marital Status"
    And the value of "Current Civil/Marital Status" should be "Single"
    And I press the "Identification / Registration" button
    And I press the "Basic Identity" button
    And the value of "Current Civil/Marital Status" should be "Single"
    And I press "Save"
    Then I should see a success message for new Case
    And I should see a value for "Current Civil/Marital Status" on the show page with the value of "Single"
    And I press the "Family / Partner Details" button
    And I click on "Partner/Spouse Details" in form group "Family / Partner Details"
    And I should see a value for "Current Civil/Marital Status" on the show page with the value of "Single"