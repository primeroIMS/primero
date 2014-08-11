#JIRA PRIMERO-297
#JIRA PRIMERO-332
#JIRA PRIMERO-352
#JIRA PRIMERO-363
#JIRA PRIMERO-373
#JIRA PRIMERO-365

@javascript @primero
Feature: Abduction Form
  As a User I want to be able to choose the type of abduction so that I can have that information available for reporting and analysis

  Scenario: As a logged in user, I will create a incident for abduction
    Given I am logged in as an admin with username "primero" and password "primero"
    When I access "incidents page"
    And I press the "Create a New Incident" button
    And I press the "Violations" button
    And I press the "Abduction" button
    And I fill in the following:
      | Number of survivors: boys               | 1                   |
      | Number of survivors: girls              | 2                   |
      | Number of survivors: unknown            | 3                   |
      | Number of total survivors               | 6                   |
      | Category                                | <Select> Other      |
      | Cross Border                            | <Radio> Yes         |
      | Location where they were abducting from | Some location       |
      | Location where they were held           | Some other location |
    And I press "Save"
    Then I should see "Incident record successfully created" on the page
    And I should see 1 subform on the show page for "Abduction Subform Section"
    And I should see in the 1st "Abduction Subform Section" subform with the follow:
      | Number of survivors: boys               | 1                   |
      | Number of survivors: girls              | 2                   |
      | Number of survivors: unknown            | 3                   |
      | Number of total survivors               | 6                   |
      | Category                                | Other               |
      | Cross Border                            | Yes                 |
      | Location where they were abducting from | Some location       |
      | Location where they were held           | Some other location |