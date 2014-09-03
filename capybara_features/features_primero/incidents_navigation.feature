# JIRA PRIMERO-278

Feature: Incidents Navigation
  As a Social Worker/Data Entry user, I want to view my open Incident records so that I can easily find the incidents I am currently managing

  Scenario Outline: The incidents link exists
    Given I am logged in as an admin with username "primero_mrm" and password "primero"
    When I access <page>
    Then I should see a "INCIDENTS" button on the page
    Examples:
      | page              |
      | incidents page    |
      | new incident page |

  Scenario: New incidents exists on incidents list and navigates to form
    Given I am logged in as an admin with username "primero" and password "primero"
    When I access "incidents page"
    Then I should see "Create a  New Incident"
    And I press the "Create a New Incident" button
    Then I should see "Incidents > Create a New Incident" on the page
