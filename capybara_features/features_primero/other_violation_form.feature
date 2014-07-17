#JIRA PRIMERO-302

@javascript @primero
Feature: Other Violation Form
  As a User, I want to be able to select a 'cause' for violation types 
  so that I can collect more detailed information about the incident.

  Scenario: As a logged in user, I will create a incident for other violation information
    Given I am logged in as an admin with username "primero" and password "primero"
    When I access "incidents page"
    And I press the "Create a New Incident" button
    And I press the "Other Violation" button
    And I fill in the following:
      | Other Violation Type        | <Select> Denial of Civil Rights |
      | Other Violation Description | Some Violation Description      |
      | Number of victims: boys     | 1 |
      | Number of victims: girls    | 2 |
      | Number of victims: unknown  | 3 |
      | Number of total victims     | 6 |
    And I press "Save"
    Then I should see "Incident record successfully created" on the page
    And I should see a value for "Number of victims: boys" on the show page with the value of "1"
    And I should see a value for "Number of victims: girls" on the show page with the value of "2"
    And I should see a value for "Number of victims: unknown" on the show page with the value of "3"
    And I should see a value for "Number of total victims" on the show page with the value of "6"
    And I should see a value for "Other Violation Type" on the show page with the value of "Denial of Civil Rights"
    And I should see a value for "Other Violation Description" on the show page with the value of "Some Violation Description"
