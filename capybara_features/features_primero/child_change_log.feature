Feature: Child change log
  Test weather each child has a proper change log attached to it.

  @javascript @primero
  Scenario: Validate child creating and initial setting of field

    Given "bob" logs in with "Register Child,Edit Child" permissions
    And someone has entered a child with the name "automation"

    When I press the "Change Log" button
    Then I should see change log of creation by user "bob"
    And I follow "Back"
    And I press the "Edit" button
    And I fill in "Age" with "32"
    And I submit the form
    And I press the "Change Log" button
    And I should see change log for initially setting the field "Age" to value "32" by "bob"

  @primero
  Scenario: Access the Change Log Feature From Case Page
    Given "bob" logs in with "Register Child,Edit Child" permissions
    And someone has entered a child with the name "automation"
    Then I should see a "Change Log" button on the page

  @primero
  Scenario: Access the Change Log Feature
    Given "bob" logs in with "Register Child,Edit Child" permissions
    And someone has entered a child with the name "automation"
    And I press the "Edit" button
    Then I should see a "Change Log" button on the page

  @primero
  Scenario Outline: Change log is in the correct order
    Given "bob" logs in with "Register Child,Edit Child" permissions
    And someone has entered a child with the name "automation"
    And I press the "Edit" button
    And I fill in "Age" with "32"
    And I submit the form
    And I press the "Change Log" button
    Then I see the list is in order with this <item>
    Examples:
    | item                                            |
    | Age initially set to 32 by bob belonging to N/A |
    | Record created by bob belonging to N/A          |