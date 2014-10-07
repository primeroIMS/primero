#JIRA PRIMERO-524
#JIRA PRIMERO-652

@javascript @primero @search
Feature: Tracing Request change log
  Test weather each tracing request has a proper change log attached to it.

  Background:
    Given I am logged in as an admin with username "primero_cp" and password "primero"
    And the following tracing request exist in the system:
     | unique_identifier                     | module_id        | created_by | owned_by   |
     | 21c4cba8-b410-4af6-b349-68c557af3aa9  | primeromodule-cp | primero_cp | primero_cp |
     | 21c4cba8-b410-4af6-b349-68c557af3aa8  | primeromodule-cp | primero_cp | primero_cp |
     | 21c4cba8-b410-4af6-b349-68c557af3aa7  | primeromodule-cp | primero_cp | primero_cp |
    When I press the "TRACING REQUESTS" button
    And I press the "7af3aa9" link

  Scenario: Validate tracing request creating and initial setting of field
    When I press the "Change Log" link
    Then I should see change log of creation by user "primero_cp"
    And I press the "Edit" button
    And I press the "Record Owner" button
    And I fill in "Field/Case/Social Worker" with "Bob"
    And I press "Save"
    And I press the "Change Log" link
    And I should see change log for initially setting the field "Caseworker name" to value "Bob" by "primero_cp"

  @javascript @primero
  Scenario: Access the Change Log Feature From Tracing Request Page
    Then I should see a "Change Log" link on the page

  @javascript @primero
  Scenario: Access the Change Log Feature
    And I press the "Edit" button
    Then I should see a "Change Log" link on the page

  @javascript @primero
  Scenario Outline: Change log is in the correct order
    And I press the "Edit" button
    And I press the "Record Owner" button
    And I fill in "Field/Case/Social Worker" with "Bob"
    And I press "Save"
    And I press the "Change Log" link
    Then I see the list is in order with this <item>
    Examples:
    | item                                            |
    | Caseworker name initially set to Bob by primero_cp belonging to N/A |
    | Record created by primero_cp belonging to N/A          |