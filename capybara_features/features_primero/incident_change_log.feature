#JIRA PRIMERO-338

@javascript @primero @search
Feature: Incident change log
  Test weather each incident has a proper change log attached to it.

  Scenario: Validate incident creating and initial setting of field
    Given I am logged in as an admin with username "primero" and password "primero"
    And the following incidents exist in the system:
      | created_by  | date_of_first_report    | status   | unique_identifier                    |
      | primero     | 03-Feb-2004             | active   | 21c4cba8-b410-4af6-b349-68c557af3aa9 |
    When I press the "INCIDENTS" button
    And I press the "7af3aa9" link
    When I press the "Change Log" button
    Then I should see change log of creation by user "primero"
    And I follow "Back"
    And I press the "Edit" button
    And I fill in "Case Worker" with "Bob"
    And I press "Save"
    And I press the "Change Log" button
    And I should see change log for initially setting the field "Caseworker code" to value "Bob" by "primero"

  @javascript @primero
  Scenario: Access the Change Log Feature From Case Page
    Given I am logged in as an admin with username "primero" and password "primero"
    And the following incidents exist in the system:
      | created_by  | date_of_first_report    | status   | unique_identifier                    |
      | primero     | 03-Feb-2004             | active   | 21c4cba8-b410-4af6-b349-68c557af3aa9 |
    When I press the "INCIDENTS" button
    And I press the "7af3aa9" link
    Then I should see a "Change Log" button on the page

  @javascript @primero
  Scenario: Access the Change Log Feature
    Given I am logged in as an admin with username "primero" and password "primero"
    And the following incidents exist in the system:
      | created_by  | date_of_first_report    | status   | unique_identifier                    |
      | primero     | 03-Feb-2004             | active   | 21c4cba8-b410-4af6-b349-68c557af3aa9 |
    When I press the "INCIDENTS" button
    And I press the "7af3aa9" link
    And I press the "Edit" button
    Then I should see a "Change Log" button on the page

  @javascript @primero
  Scenario Outline: Change log is in the correct order
    Given I am logged in as an admin with username "primero" and password "primero"
    And the following incidents exist in the system:
      | created_by  | date_of_first_report    | status   | unique_identifier                    |
      | primero     | 03-Feb-2004             | active   | 21c4cba8-b410-4af6-b349-68c557af3aa9 |
    When I press the "INCIDENTS" button
    And I press the "7af3aa9" link
    And I press the "Edit" button
    And I fill in "Case Worker" with "Bob"
    And I press "Save"
    And I press the "Change Log" button
    Then I see the list is in order with this <item>
    Examples:
    | item                                            |
    | Case Worker initially set to Bob by Primero belonging to N/A |
    | Record created by primero belonging to N/A          |