# JIRA PRIMERO-289
# JIRA PRIMERO-523

@javascript @primero @search
Feature: Edit and View Incident Record
  As a admin user, I want to be able to edit a incident record and view the incident record

  Scenario: I edit a incident record
    Given I am logged in as an admin with username "primero_mrm" and password "primero"
    And the following incidents exist in the system:
      | created_by  | date_of_first_report    | status   | unique_identifier                    |
      | primero_mrm | 03-Feb-2004             | active   | 21c4cba8-b410-4af6-b349-68c557af3aa9 |
      | primero_mrm | 03-Feb-2004             | Inactive | 31c4cba8-b410-4af6-b349-68c557af3aa8 |
    When I press the "INCIDENTS" button
    And I press the "7af3aa9" link
    And I press the "Edit" button
    And I fill in "Date of First Report" with "14-Jul-2014"
    And I select "Afternoon (noon to sunset)" from "Time of day that the Incident took place"
    And I fill in the following:
      | Incident Total Victims/Survivors    | <Tally>Boys:3<Tally>Girls:2     |
    And I press "Save"
    Then I should see "Incident was successfully updated" on the page
    And I should see a value for "Date of First Report" on the show page with the value of "14-Jul-2014"
    And I should see a value for "Time of day that the Incident took place" on the show page with the value of "Afternoon (noon to sunset)"
    And I should see a value for "Incident Total Victims/Survivors" on the show page with the value of "<Tally> Boys:3 Girls:2 Unknown: Total incident total victims/survivors:5"

  Scenario: I view a incident record
    Given I am logged in as an admin with username "primero_mrm" and password "primero"
    And the following incidents exist in the system:
      | created_by  | date_of_first_report    | status   | unique_identifier                    | incident_total_boys | incident_timeofday         |
      | primero_mrm | 03-Feb-2004             | active   | 21c4cba8-b410-4af6-b349-68c557af3aa9 | 3                   | Afternoon (noon to sunset) |
    When I press the "INCIDENTS" button
    And I press the "7af3aa9" link
    And I should see a value for "Date of First Report" on the show page with the value of "03-Feb-2004"
    And I should see a value for "Time of day that the Incident took place" on the show page with the value of "Afternoon (noon to sunset)"
    And I should see a value for "Incident Total Victims/Survivors" on the show page with the value of "<Tally> Boys:3 Girls: Unknown: Total incident total victims/survivors:3"

