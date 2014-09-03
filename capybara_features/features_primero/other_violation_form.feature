#JIRA PRIMERO-302
#JIRA PRIMERO-329
#JIRA PRIMERO-352
#JIRA PRIMERO-363
#JIRA PRIMERO-373
#JIRA PRIMERO-365
#JIRA PRIMERO-283

@javascript @primero
Feature: Other Violation Form
  As a User, I want to be able to select a 'cause' for violation types
  so that I can collect more detailed information about the incident.

  Scenario: As a logged in user, I will create a incident for other violation information
    Given I am logged in as an admin with username "primero_mrm" and password "primero"
    When I access "incidents page"
    And I press the "Create a New Incident" button
    And I press the "Violations" button
    And I press the "Other Violation" button
    And I update in the 1st "Other Violation" subform with the follow:
      | Other Violation Type        | <Select> Denial of Civil Rights |
      | Other Violation Description | Some Violation Description      |
      | Number of survivors: boys   | 1 |
      | Number of survivors: girls  | 2 |
      | Number of survivors: unknown| 3 |
    And I fill in the 2nd "Other Violation" subform with the follow:
      | Other Violation Type        | <Select> Access Violations |
      | Other Violation Description | Some Violation Description |
      | Number of survivors: boys   | 2 |
      | Number of survivors: girls  | 3 |
      | Number of survivors: unknown| 4 |
    And the value of "Number of total survivors" in the 1st "Other Violation" subform should be "6"
    And the value of "Number of total survivors" in the 2nd "Other Violation" subform should be "9"
    And I press "Save"
    Then I should see "Incident record successfully created" on the page
    And I should see in the 1st "Other Violation" subform with the follow:
      | Other Violation Type        | Denial of Civil Rights     |
      | Other Violation Description | Some Violation Description |
      | Number of survivors: boys   | 1 |
      | Number of survivors: girls  | 2 |
      | Number of survivors: unknown| 3 |
      | Number of total survivors   | 6 |
    And I should see in the 2nd "Other Violation" subform with the follow:
      | Other Violation Type        | Access Violations          |
      | Other Violation Description | Some Violation Description |
      | Number of survivors: boys   | 2 |
      | Number of survivors: girls  | 3 |
      | Number of survivors: unknown| 4 |
      | Number of total survivors   | 9 |
