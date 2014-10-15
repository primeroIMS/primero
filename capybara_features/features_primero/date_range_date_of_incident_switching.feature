# JIRA PRIMERO-684

@javascript @primero
Feature: Date Range Date of Incident Switching
  As a user, I want to validate switching of the date of incident.

  Background:
    Given I am logged in as an admin with username "primero_mrm" and password "primero"
    And the following incidents exist in the system:
      | created_by  | date_of_first_report | record_state   | unique_identifier                    |
      | primero_mrm | 03-Feb-2004          | true           | 21c4cba8-b410-4af6-b349-68c557af3aa9 |
    When I press the "INCIDENTS" button

  Scenario: As a logged in user and create an Incident with valid date range and later switch to a single date
    And I press the "7af3aa9" link
    And I press the "Edit" button
    And I fill in the following:
      | Date of Incident | <Date Range><Range> from: '10-Aug-2014', to: '22-Aug-2014'|
    And I press "Save"
    And I should see a value for "Date of Incident" on the show page with the value of "<Date Range> From: 10-Aug-2014 To: 22-Aug-2014"
