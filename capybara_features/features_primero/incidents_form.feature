# JIRA PRIMERO-271
# JIRA PRIMERO-407
# JIRA PRIMERO-366

@javascript @primero
Feature: Incidents Form
  As a Social Worker / Data Entry Person, I want to create an incident record in Primero 
  so that I can enter supporting details about a GBV incident for reporting purposes.

  Scenario: As a logged in user, I create a new incident
    Given I am logged in as an admin with username "primero" and password "primero"
    When I access "incidents page"
    And I press the "Create a New Incident" button
    And I press the "Incident" button
    And I choose from "Violation Category":
      |  Abduction    |
      |  Other        |
    And I fill in "Date of First Report or Interview" with "14-Jul-2014"
    And I select "Afternoon (noon to sunset)" from "Time of day that the Incident took place"
    And I fill in "Incident Total Victims/Survivors:Boys" with "3"
    And I fill in "Incident Total Victims/Survivors:Girls" with "2"
    And I fill in the following:
      | Date of Incident | <Date Range>from: '15-Jan-2013', to: '22-Feb-2013' |
    And I press "Save"
    Then I should see "Incident record successfully created" on the page
    And I should see a value for "Date of Incident" on the show page with the value of "<Date Range> From: 15-Jan-2013 To: 22-Feb-2013"

  Scenario: As a logged in user, I create a new incident and I should be able to enter a date or a date range for the date of incident
    Given I am logged in as an admin with username "primero" and password "primero"
    When I access "incidents page"
    And I press the "Create a New Incident" button
    And I press the "Incident" button
    And I fill in the following:
      | Case Worker                       | Case worker code               |
      | Agency                            | Agency name                    |
      | Date of First Report or Interview | 06-Aug-2014                    |
      | Date of Incident                  | <Date Range><Date> 10-Aug-2014 |
      | Are these dates estimated?        | <Radio> No                     |
    And I press "Save"
    Then I should see "Incident record successfully created" on the page
    And I should see a value for "Case Worker" on the show page with the value of "Case worker code"
    And I should see a value for "Agency" on the show page with the value of "Agency name"
    And I should see a value for "Date of First Report or Interview" on the show page with the value of "06-Aug-2014"
    And I should see a value for "Date of Incident" on the show page with the value of "10-Aug-2014"
    And I should see a value for "Are these dates estimated?" on the show page with the value of "No"
    And I press the "Edit" button
    And I fill in the following:
      | Date of Incident                  | <Date Range><Range> from: '10-Aug-2014', to: '22-Aug-2014'|
      | Are these dates estimated?        | <Radio> Yes                                                    |
    And I press "Save"
    And I should see "Incident was successfully updated" on the page
    And I should see a value for "Date of Incident" on the show page with the value of "<Date Range> From: 10-Aug-2014 To: 22-Aug-2014"
    And I should see a value for "Are these dates estimated?" on the show page with the value of "Yes"