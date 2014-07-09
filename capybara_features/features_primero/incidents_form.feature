# JIRA PRIMERO-271

@javascript @primero
Feature: Incidents Form
  As a Social Worker / Data Entry Person, I want to create an incident record in Primero 
  so that I can enter supporting details about a GBV incident for reporting purposes.

  Scenario: As a logged in user, I create a new incident
    Given I am logged in as an admin with username "primero" and password "primero"
    When I access "incident page"
    And I press the "Create a New Incident" button
    And I press the "Incident" button
    And I choose from "Reason for withholding information":
      |  Abduction    |
      |  Other        |
    And I fill in "Date of First Report or Interview" with "14-Jul-2014"
    And I select "Afternoon (noon to sunsets)" from "Time of day that the Incident took place"
    And I fill in "Incident Total Victims/Survivors:Boys" with "3"
    And I fill in "Incident Total Victims/Survivors:Girls" with "2"
    And I press "Save"
    Then I should see "Incident record successfully created" on the page