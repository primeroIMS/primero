# JIRA PRIMERO-524
# JIRA PRIMERO-652

@javascript @primero
Feature: Child change log
  Test weather each child has a proper change log attached to it.

  Background:
    Given I am logged in as an admin with username "primero_cp" and password "primero"
    When I access "cases page"
    And I press the "New Case" button
    And someone has entered a child with the name "automation"

  Scenario: Validate child creating and initial setting of field
    When I press the "show_change_log" link
    Then I should see change log of creation by user "primero_cp"
    And I press the "Edit" button
    And I fill in "Age" with "32"
    And I submit the form
    And I press the "Change Log" link
    And I should see change log for initially setting the field "Age" to value "32" by "primero_cp"

  Scenario: Access the Change Log Feature
    And I press the "Edit" button
    Then I should see a "Change Log" button on the page

  Scenario Outline: Change log is in the correct order
    And I press the "Edit" button
    And I fill in "Age" with "32"
    And I submit the form
    And I press the "Change Log" link
    Then I see the list is in order with this <item>
    Examples:
    | item                                            |
    | Age initially set to 32 by bob belonging to N/A |
    | Record created by bob belonging to N/A          |