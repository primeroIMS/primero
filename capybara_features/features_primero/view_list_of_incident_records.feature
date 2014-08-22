# JIRA PRIMERO-279
@javascript @primero @search
Feature: Primero View List of Incident Records
  I want to be able to access the record of a incident so that I can find and
  update my incident records with information about my interactions with the incident

  Scenario: I want to see my incidents
    Given I am logged in as an admin with username "primero" and password "primero"
    And the following incidents exist in the system:
      | created_by  | date_of_first_report    | status   | unique_identifier                    |
      | primero     | 03-Feb-2004             | active   | 21c4cba8-b410-4af6-b349-68c557af3aa9 |
      | primero     | 03-Feb-2004             | Inactive | 31c4cba8-b410-4af6-b349-68c557af3aa8 |
      | primero     | 03-Feb-2004             | active   | 41c4cba8-b410-4af6-b349-68c557af3aa7 |
      | primero     | 03-Feb-2004             | Inactive | 51c4cba8-b410-4af6-b349-68c557af3aa6 |
      | primero     | 03-Feb-2004             | active   | 61c4cba8-b410-4af6-b349-68c557af3aa5 |
    When I press the "INCIDENTS" button
    And I should see "Displaying all 5 incidents"
    And I should see an id "7af3aa9" link on the page
    And I press the "7af3aa9" link
    And I should see "Incidents > 7af3aa9"

  Scenario: I want to see my incidents but I do not have any
    Given I am logged in as an admin with username "primero" and password "primero"
    When I press the "INCIDENTS" button
    And I should see "No entries found"