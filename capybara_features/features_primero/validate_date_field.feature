# JIRA Primero-150
# JIRA Primero-245
# JIRA Primero-258


@javascript @primero
Feature: Validate Date Field
  As an administrator, I want to validate that the date is a valid date even if in the correct format.
  
  Background:
    Given I am logged in as an admin with username "primero" and password "primero"
    When I access "cases page"
    And I press the "Create a New Case" button

  Scenario: As a logged in user, I create a case and validate the date field with invalid values
    And I press the "Protection Concern" button  
    And I fill in the following:
      | Intervention needed by     | 12/May/14         |
    And I press "Save"
		Then I should see "Please enter the date in a valid format (dd-mmm-yyyy)" on the page

  Scenario: As a logged in user, I create a case and validate the date field with valid values
    And I press the "Protection Concern" button  
		And I fill in the following:
      | Intervention needed by     | 12-May-2014         |
    And I press "Save"
		Then I should see "Case record successfully created" on the page
    And I should see a value for "Intervention needed by" on the show page with the value of "12-May-2014"

  Scenario: As a logged in user, I create a case and validate the date field with invalid values in a subform 
    And I press the "Services" button
    And I fill in the 1st "Services Section" subform with the follow:
      | Type of Service                            | <Select> Safehouse    |
      | Did you refer the client for this service? | <Select> Referred     |
      | Appointment Date                           | invalid date          |
      | Appointment Time                           | 8                     |
      | Service Provider                           | IRC                   |
      | Service Location                           | Kenya                 |
      | Notes                                      | No notes at this time |
    And I press "Save"
    Then I should see "Services: Please enter the date in a valid format (dd-mmm-yyyy)" on the page

  Scenario: As a logged in user, I create a case and validate the date field with invalid values in a subform 
    And I press the "Services" button
    And I fill in the 1st "Services Section" subform with the follow:
      | Type of Service                            | <Select> Safehouse    |
      | Did you refer the client for this service? | <Select> Referred     |
      | Appointment Date                           | 30-May-2014           |
      | Appointment Time                           | 8                     |
      | Service Provider                           | IRC                   |
      | Service Location                           | Kenya                 |
      | Notes                                      | No notes at this time |
    And I press "Save"
    Then I should not see "Please enter the date in a valid format (dd-mmm-yyyy)" on the page
    Then I should see "Case record successfully created" on the page
    And I should see a value for "Appointment Date" on the show page with the value of "30-May-2014"
