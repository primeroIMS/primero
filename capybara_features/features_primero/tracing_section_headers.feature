# JIRA PRIMERO-137
# JIRA PRIMERO-429

@javascript @primero
Feature: Tracing Section Headers
  As a Social Worker I want the Tracing form sections to have headers
  so that the users can easily identify the related form sections

  Scenario: As a logged in user, I should be able see section headers in the new Tracing Form
    Given I am logged in as an admin with username "primero" and password "primero"
    When I access "cases page"
    And I press the "Create a New Case" button
    And I press the "Tracing" button
    And I should see "Separation History" on the page
    And I should see "Tracing Actions" on the page
    And I should see "Reunification Details" on the page

  Scenario:  As a logged in user, I should be able see section headers in the show Tracing Form
    Given I am logged in as an admin with username "primero" and password "primero"
    And the following cases exist in the system:
      | name     | created_by | age | sex    | registration_date      | status | unique_identifier                    |
      | andreas  | primero    | 10  | male   | 03-Feb-2004            | open   | 21c4cba8-b410-4af6-b349-68c557af3aa9 |
    When I press the "CASES" button
    And I should see an id "7af3aa9" link on the page
    And I press the "7af3aa9" link
    And I press the "Tracing" button
    And I should see "Separation History" on the page
    And I should see "Tracing Actions" on the page
    And I should see "Reunification Details" on the page
