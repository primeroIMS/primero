Feature: Child change log
  Test weather each child has a proper change log attached to it.

  # TODO: Add back after demo deploy. Nationality removed and change log link hidden
  @javascript @wip
  Scenario: Validate child creating and initial setting of field

    Given "bob" logs in with "Register Child,Edit Child" permissions
    And someone has entered a child with the name "automation"

    When I press the "Change Log" button
    Then I should see change log of creation by user "bob"
    And I follow "Back"
    Then I press the "Edit" button
    And I fill in "Nationality" with "India"
    And I submit the form
    And I press the "Change Log" button
    Then I should see change log for initially setting the field "Nationality" to value "India" by "bob"

  # TODO: Add back after demo deploy. Change log link hidden
  @javascript @wip
  Scenario: Validate editing a child record

    Given "bob" logs in with "Register Child,Edit Child" permissions
    And someone has entered a child with the name "automation"

    Then I press the "Edit" button
    # And I fill in "Birthplace" with "India"
    And I submit the form
    And I press the "Change Log" button
    Then I should see change log for changing value of field "Birthplace" from "Haiti" to value "India" by "bob"

  # TODO: Add back after demo deploy. Change log link hidden
  @javascript @wip
  Scenario: Flagging a record

    Given "bob" logs in with "Register Child,Edit Child" permissions
    And someone has entered a child with the name "automation"


    And I flag as suspect with the following reason:
    """
      He is a bad guy.
    """

    And I press the "Change Log" button
    Then I should see change log for record flag by "bob" for "He is a bad guy."

#  @javascript
  @run @wip
  Scenario: Adding an image

    Given "bob" logs in with "Register Child,Edit Child" permissions
    And someone has entered a child with the name "automation"

    When I follow "Edit"
    And I follow "Photos and Audio"
    And I should blah
#    And I wait for 5 seconds
    And I attach a photo "capybara_features/resources/jorge.jpg"
    And I submit the form
