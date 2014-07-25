#JIRA PRIMERO-302
#JIRA PRIMERO-329

@javascript @primero
Feature: Other Violation Form
  As a User, I want to be able to select a 'cause' for violation types 
  so that I can collect more detailed information about the incident.

  Scenario: As a logged in user, I will create a incident for other violation information
    Given I am logged in as an admin with username "primero" and password "primero"
    When I access "incidents page"
    And I press the "Create a New Incident" button
    And I press the "Other Violation" button
    And I update in the 1st "Other Violation Section" subform with the follow:
      | Other Violation Type        | <Select> Denial of Civil Rights |
      | Other Violation Description | Some Violation Description      |
      | Number of victims: boys     | 1 |
      | Number of victims: girls    | 2 |
      | Number of victims: unknown  | 3 |
      | Number of total victims     | 6 |
    And I fill in the 2nd "Other Violation Section" subform with the follow:
      | Other Violation Type        | <Select> Access Violations |
      | Other Violation Description | Some Violation Description |
      | Number of victims: boys     | 2 |
      | Number of victims: girls    | 3 |
      | Number of victims: unknown  | 4 |
      | Number of total victims     | 9 |
    And I press "Save"
    Then I should see "Incident record successfully created" on the page
    And I should see in the 1st "Other Violation" subform with the follow:
      | Other Violation Type        | Denial of Civil Rights     |
      | Other Violation Description | Some Violation Description |
      | Number of victims: boys     | 1 |
      | Number of victims: girls    | 2 |
      | Number of victims: unknown  | 3 |
      | Number of total victims     | 6 |
    And I should see in the 2nd "Other Violation" subform with the follow:
      | Other Violation Type        | Access Violations          |
      | Other Violation Description | Some Violation Description |
      | Number of victims: boys     | 2 |
      | Number of victims: girls    | 3 |
      | Number of victims: unknown  | 4 |
      | Number of total victims     | 9 |
