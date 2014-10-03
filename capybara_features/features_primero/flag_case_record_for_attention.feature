# JIRA PRIMERO-76
# JIRA PRIMERO-346

@javascript @primero @search
Feature: Flag Case Record For Attention
  As a Administrator / supervisor, I want to to be able to flag case records that have issues
  so that the social worker for the case will know there is an issue that needs to be corrected.

  Background:
    Given I am logged in as an admin with username "primero_cp" and password "primero"
    And the following cases exist in the system:
      | name    | created_by | unique_identifier |
      | Shaggy  | primero_cp | id_1              |


  Scenario Outline: I should have a Flags button on the case record
    And I am on the <page> for "Shaggy"
    Then I should see a "Flags" button on the page

    Examples:
      | page |
      | case record page |
      | case record edit page |

  Scenario Outline: I should be able to see a Flag Reason text box
    And I am on the <page> for "Shaggy"
    When I press the "Flags" button
    Then I should see "Flag Reason"

    Examples:
      | page |
      | case record page |
      | case record edit page |

  #history for flags are different because flags are in an array, should be refactored
  @wip
  Scenario Outline: I should be able to enter a Flag Reason
    And I am on the <page> for "Shaggy"
    When I press the "Flags" button
    Then I fill in "Flag Reason" with "Just Because"
    And I press "Flag"
    And I should see "Just Because"
    And the child record history should log "Flags changed by primero_cp belonging to UNICEF"

    Examples:
      | page |
      | case record page |
      | case record edit page |

  Scenario Outline: I should not be able to flag a record without entering a Flag Reason
    And I am on the <page> for "Shaggy"
    When I press the "Flags" button
    And I press "Flag"
    And I click OK in the browser popup
    And I should not see "Just Because"
    And I should see "Flag Reason"

    Examples:
      | page |
      | case record page |
      | case record edit page |

  Scenario Outline: I should be able see a flag icon on the page
    And I am on the <page> for "Shaggy"
    When I press the "Flags" button
    Then I fill in "Flag Reason" with "Just Because"
    And I press "Flag"
    And I should see "Just Because"
    Then I access "cases page"
    And the record for "Shaggy" should display a "bookmark" icon beside it

    Examples:
      | page |
      | case record page |
