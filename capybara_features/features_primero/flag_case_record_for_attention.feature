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


  Scenario Outline: I should have a Flag Record button on the case record
    And I am on the <page> for "Shaggy"
    Then I should see a "Flag Record" button on the page

    Examples:
      | page |
      | case record page |
      | case record edit page |

  Scenario Outline: I should be able to see a Flag Reason text box
    And I am on the <page> for "Shaggy"
    When I press the "Flag Record" button
    Then I should see "Flag Reason"

    Examples:
      | page |
      | case record page |
      | case record edit page |

  Scenario Outline: I should be able to enter a Flag Reason
    And I am on the <page> for "Shaggy"
    When I press the "Flag Record" button
    Then I fill in "Flag Reason" with "Just Because"
    And I press "Flag"
    Then I should see "Flagged by primero_cp"
    And I should see "Just Because"
    And the record history should log "Record was flagged by primero_cp belonging to UNICEF because: Just Because"

    Examples:
      | page |
      | case record page |
      | case record edit page |

  Scenario Outline: I should not be able to flag a record without entering a Flag Reason
    And I am on the <page> for "Shaggy"
    When I press the "Flag Record" button
    And I press "Flag"
    And I click OK in the browser popup
    Then I should not see "Flagged by"
    And I should not see "Just Because"
    And I should see "Flag Reason"

    Examples:
      | page |
      | case record page |
      | case record edit page |

  Scenario Outline: I should be able see a flag icon on the page
    And I am on the <page> for "Shaggy"
    When I press the "Flag Record" button
    Then I fill in "Flag Reason" with "Just Because"
    And I press "Flag"
    Then I should see "Flagged by primero_cp"
    And I should see "Just Because"
    Then I press the "Cases" button
    And the record for "Shaggy" should display a "flag" icon beside it

    Examples:
      | page |
      | case record page |
