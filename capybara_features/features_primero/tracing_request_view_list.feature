# JIRA PRIMERO-789

@javascript @primero @search
Feature: Tracing Request View List
  As a Primero user, I want to see the defined fields on the view list

  Background:
   Given I am logged in as an admin with username "primero_cp" and password "primero"
   And the following tracing request exist in the system:
     | unique_identifier                     | created_by | owned_by   | flag  | flag_message | inquiry_date | relation_name | tracing_request   |
     | 21c4cba8-b410-4af6-b349-68c559af3aa7  | primero_cp | primero_cp | true  | message 1    | 2014-11-27   | Luisa         | Pepe, Luis, Pedro |
     | 21c4cba8-b410-4af6-b349-68c559af3aa8  | primero_cp | primero_cp | true  | message 2    | 2014-10-15   | Maria         | Juan              |
     | 21c4cba8-b410-4af6-b349-68c559af3aa9  | primero_cp | primero_cp | true  | message 3    | 2014-01-01   | Josefina      |                   |
   When I access "tracing requests page"

  Scenario: Scenario: As a logged in user and enter to view page, I want to see the defined fields on the view list
    Then all the records on the page should be flagged
    And I should see "9af3aa7" on the page
    And I should see "9af3aa8" on the page
    And I should see "9af3aa9" on the page
    And I should see "Luisa" on the page
    And I should see "Maria" on the page
    And I should see "Josefina" on the page
    And I should see "Pepe" on the page
    And I should see "Luis" on the page
    And I should see "Pedro" on the page
    And I should see "Juan" on the page
    And I should see "27-Nov-2014" on the page
    And I should see "15-Oct-2014" on the page
    And I should see "01-Jan-2014" on the page
