# JIRA Primero-150

@javascript @primero
Feature: Validate Date Field
  As an administrator, I want to validate that the date is a valid date even if in the correct format.
  
  Background:
    Given I am logged in as an admin with username "primero" and password "primero"
    When I access "cases page"
    And I press the "Create a New Case" button
    And I press the "Protection Concern" button

  Scenario: As a logged in user, I create a case and validate the date field with invalid values  
    And I fill in the following:
      | Intervention needed by     | 12/May/14         |
    And I press "Save"
		Then I should see "Please enter the date in a valid format (dd-mm-yyyy)" on the page

  Scenario: As a logged in user, I create a case and validate the date field with valid values  
		And I fill in the following:
      | Intervention needed by     | 12/May/2014         |
    And I press "Save"
		Then I should see "Case record successfully created" on the page
    And I should see a value for "Intervention needed by" on the show page with the value of "12/May/2014"
