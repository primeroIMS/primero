# JIRA PRIMERO-42

@javascript @primero
Feature: Basic Identity Form

  Scenario: Add something meaningful
    Given I am logged in as an admin with username "primero" and password "primero"
    When I access cases page
    Then I press the "Register New Child" button
    And I should see the following fields:
    | First Name        |
    | Middle Name       |
    | Last Name         |
    | Age               |
    | Sex               |
    | Registration Date |
    | Status            |
    And I fill in the following:
      | First Name      | Tiki                |
      | Middle Name     | Thomas              |
      | Last Name       | Taliaferro          |
      | Age             | 22                  |
    And I select "Male" from "Sex"
    And I press "Save"
    Then I should see "Case record successfully created" on the
#    And I should see "Registered by: <username> on"
    And pause


#  AND: Status defaults to Open but can be changed from a dropdown with the values Open and Closed
#  AND: I select the Save button
#  THEN: The record should be saved in the database
#  AND: The Basic Identity form should remain on the screen showing the information just entered

#  AND: Below the "Case Record successfully created." message, the breadcrumb should be updated to show: Case > name: case ID (existing RapidFTR functionality with Child changed to Case)
#  AND: Below the breadcrumb, the following message should appear "Registered by: <username> on <datestamp> at <timestamp with timezone>" (existing RapidFTR functionality)