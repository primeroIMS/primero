#JIRA PRIMERO-297

@javascript @primero
Feature: Abduction Form
  As a User I want to be able to choose the type of abduction so that I can have that information available for reporting and analysis

  Scenario: As a logged in user, I will create a incident for abduction
    Given I am logged in as an admin with username "primero" and password "primero"
    When I access "incidents page"
    And I press the "Create a New Incident" button
    And I press the "Abduction" button
    And I fill in the following:
      | Number of victims: boys                 | 1                   |
      | Number of victims: girls                | 2                   |
      | Number of victims: unknown              | 3                   |
      | Number of total victims                 | 6                   |
      | Category                                | <Select> Other      |
      | Cross Border                            | <Radio> Yes         |
      | Location where they were abducting from | Some location       |
      | Location where they were held           | Some other location |
    And I press "Save"
    Then I should see "Incident record successfully created" on the page
    And I should see a value for "Number of victims: boys" on the show page with the value of "1"
    And I should see a value for "Number of victims: girls" on the show page with the value of "2"
    And I should see a value for "Number of victims: unknown" on the show page with the value of "3"
    And I should see a value for "Number of total victims" on the show page with the value of "6"
    And I should see a value for "Category" on the show page with the value of "Other"
    And I should see a value for "Cross Border" on the show page with the value of "Yes"
    And I should see a value for "Location where they were abducting from" on the show page with the value of "Some location"
    And I should see a value for "Location where they were held" on the show page with the value of "Some other location"

