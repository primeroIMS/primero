# JIRA PRIMERO-271
# JIRA PRIMERO-407
# JIRA PRIMERO-366
# JIRA PRIMERO-418
# JIRA PRIMERO-283
# JIRA PRIMERO-444
# JIRA PRIMERO-523

@javascript @primero
Feature: Incidents Form
  As a Social Worker / Data Entry Person, I want to create an incident record in Primero
  so that I can enter supporting details about a GBV incident for reporting purposes.

  Scenario: As a logged in user, I create a new incident
    Given I am logged in as an admin with username "primero_mrm" and password "primero"
    When I access "incidents page"
    And I press the "New Incident" button
    And I press the "Incident" button
    And I choose from "Violation Category":
      |  Abduction    |
      |  Other        |
    And I fill in "Date of First Report" with "14-Jul-2014"
    And I select "Afternoon (noon to sunset)" from "Time of day that the Incident took place"
    And I fill in "Incident Total Victims/Survivors:Boys" with "3"
    And I fill in "Incident Total Victims/Survivors:Girls" with "2"
    And I fill in "Incident Total Victims/Survivors:Unknown" with "5"
    And I fill in the following:
      | Date of Incident | <Date Range>from: '15-Jan-2013', to: '22-Feb-2013' |
    And the value of "Incident Total Victims/Survivors:Total" should be "10"
    And I press "Save"
    Then I should see "Incident record successfully created" on the page
    And I should see a value for "Incident Total Victims/Survivors:Total" on the show page with the value of "10"
    And I should see a value for "Date of Incident" on the show page with the value of "<Date Range> From: 15-Jan-2013 To: 22-Feb-2013"

  Scenario: As a logged in user, I create a new incident and I should be able to enter a date or a date range for the date of incident
    Given I am logged in as an admin with username "primero_mrm" and password "primero"
    When I access "incidents page"
    And I press the "New Incident" button
    And I press the "Incident" button
    And I fill in the following:
      | Date of First Report              | 06-Aug-2014                    |
      | Date of Incident                  | <Date Range><Date> 10-Aug-2014 |
      | Is the date estimated?            | <Radio> No                     |
      | Incident Location                 | Incident location              |
      | Notes on Location                 | Notes on location              |
      | Latitude                          | Incident latitude              |
      | Longitude                         | Incident longitude             |
    And I press "Save"
    Then I should see "Incident record successfully created" on the page
    And I should see a value for "Date of First Report" on the show page with the value of "06-Aug-2014"
    And I should see a value for "Date of Incident" on the show page with the value of "10-Aug-2014"
    And I should see a value for "Is the date estimated?" on the show page with the value of "No"
    And I should see a value for "Incident Location" on the show page with the value of "Incident location"
    And I should see a value for "Notes on Location" on the show page with the value of "Notes on location"
    And I should see a value for "Latitude" on the show page with the value of "Incident latitude"
    And I should see a value for "Longitude" on the show page with the value of "Incident longitude"
    And I press the "Edit" button
    And I fill in the following:
      | Date of Incident              | <Date Range><Range> from: '10-Aug-2014', to: '22-Aug-2014'|
      | Is the date estimated?        | <Radio> Yes                                               |
    And I press "Save"
    And I should see "Incident was successfully updated" on the page
    And I should see a value for "Date of Incident" on the show page with the value of "<Date Range> From: 10-Aug-2014 To: 22-Aug-2014"
    And I should see a value for "Is the date estimated?" on the show page with the value of "Yes"