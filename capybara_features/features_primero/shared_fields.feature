# JIRA Primero-145
# JIRA Primero-202

@javascript @primero
Feature: Shared Fields
  As an administrator, I want to be able to allow fields to be shared between forms

  Scenario: As a logged in user, I create a case and I should see shared fields populated with the same value
    Given I am logged in as an admin with username "primero" and password "primero"
    When I access "cases page"
    And I press the "Create a New Case" button
    And I press the "Partner Details" button
    And I select "Single" from "Current Civil/Marital Status"
    And the value of "Current Civil/Marital Status" should be "Single"
    And I press the "Basic Identity" button 
    And the value of "Current Civil/Marital Status" should be "Single"
    And I press "Save"
    Then I should see "Case record successfully created" on the page
    And I should stay on the "Basic Identity" tab on the case "show" page
    And I should see a value for "Current Civil/Marital Status" on the show page with the value of "Single"
    And I press the "Partner Details" button
    And I should see a value for "Current Civil/Marital Status" on the show page with the value of "Single"