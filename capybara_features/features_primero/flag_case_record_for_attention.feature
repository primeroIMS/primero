# JIRA PRIMERO-76
@javascript @primero
Feature: Flag Case Record For Attention
  As a Administrator / supervisor, I want to to be able to flag case records that have issues 
  so that the social worker for the case will know there is an issue that needs to be corrected.

  Background:
    Given I am logged in as an admin with username "primero" and password "primero"
    And the following children exist in the system:
      | name   | unique_id |
      | Shaggy  | id_1      |
    And I am on the child record page for "Shaggy"
    #TODO: And I am on the case record page for "Shaggy"

  Scenario: I should have a Flag Record button on the case record 
    Then I should see a "Flag Record" button on the page

  Scenario: I should be able to see a Flag Reason text box
    When I press the "Flag Record" button
    Then I should see "Flag Reason"

  Scenario: I should be able to enter a Flag Reason
    When I press the "Flag Record" button
    Then I fill in "Flag Reason" with "Just Because"
    And I press "Flag"
    Then I should see "Flagged as suspect record by primero"
    And I should see "Just Because"
    And the record history should log "Record was flagged by primero belonging to UNICEF because: Just Because"

  Scenario: I should not be able to flag a record without entering a Flag Reason
    When I press the "Flag Record" button
    And I press "Flag"
    And I click OK in the browser popup
    Then I should not see "Flagged as suspect record by"
    And I should not see "Just Because"
    And I should see "Flag Reason"