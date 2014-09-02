# JIRA Primero-150
# JIRA Primero-245
# JIRA Primero-258
# JIRA PRIMERO-353
# JIRA PRIMERO-363
# JIRA PRIMERO-365


@javascript @primero
Feature: Validate Date Field
  As an administrator, I want to validate that the date is a valid date even if in the correct format.
  
  Background:
    Given I am logged in as an admin with username "primero" and password "primero"
    When I access "cases page"
    And I press the "New Case" button

  Scenario: As a logged in user, I create a case and validate the date field with invalid values
    And I press the "Basic Identity" button  
    And I fill in the following:
      | Date of Birth     | Invalid Date         |
    And I press "Save"
    Then I should see "Please enter the date in a valid format (dd-mmm-yyyy)" on the page

  Scenario: As a logged in user, I create a case and validate the date field and allow different formats
    And I press the "Basic Identity" button  
    And I fill in "Date of Birth" with "12/02/2014"
    And the value of "Date of Birth" should be "12-Feb-2014"
    And I press the "Assessment" button
    And I press the "Best Interest" button  
    And I fill in "Date of Recommendation" with "12 02 2014"
    And I fill in "Date of submission" with "12-02-2014"
    And I fill in "Date of Implementation" with "12/Feb/2014"
    And I fill in "Proposed Support" with "None"
    And the value of "Date of Recommendation" should be "12-Feb-2014"
    And the value of "Date of submission" should be "12-Feb-2014"
    And the value of "Date of Implementation" should be "12-Feb-2014"
    And I press "Save"
    Then I should see "Case record successfully created" on the page
    And I press the "Identification / Registration" button
    And I press the "Basic Identity" button  
    And I should see a value for "Date of Birth" on the show page with the value of "12-Feb-2014"
    And I press the "Assessment" button
    And I press the "Best Interest" button 
    And I should see a value for "Date of Recommendation" on the show page with the value of "12-Feb-2014"
    And I should see a value for "Date of submission" on the show page with the value of "12-Feb-2014"
    And I should see a value for "Date of Implementation" on the show page with the value of "12-Feb-2014"


  Scenario: As a logged in user, I create a case and validate the date field with invalid values in a subform
    And I press the "Services / Follow Up" button
    And I click on "Services" in form group "Services / Follow Up"
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
    And I press the "Services / Follow Up" button 
    And I click on "Services" in form group "Services / Follow Up"
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
    And I should see in the 1nd "Services Section" subform with the follow:
      | Appointment Date | 30-May-2014 |
