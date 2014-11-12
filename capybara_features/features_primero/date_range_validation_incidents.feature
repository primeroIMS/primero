# JIRA PRIMERO-475
# JIRA PRIMERO-684
# JIRA PRIMERO-798

@javascript @primero
Feature: Date Range Validation Incidents
  As a user, I want to validate date range.

  Background:
    Given I am logged in as an admin with username "primero_mrm" and password "primero"
    When I access "incidents page"
    And I press the "New Incident" button
    And I press the "Incident" button

  Scenario: As a logged in user and create an Incident with invalid date range, I want to see the error message
    And I fill in the following:
      | Date of Incident | <Date Range><Range> from: '22-Aug-2014', to: '10-Aug-2014'|
    And I press "Save"
    Then I should see "There were problems with the following fields:" on the page
    And I should see "Date of Incident: Please enter a valid date range 'From:' should be earlier than 'To:'" on the page

  Scenario: As a logged in user and create an Incident with invalid 'From:' value, I want to see the error message
    And I fill in the following:
      | Date of Incident | <Date Range><Range> from: '22-21-2014', to: '10-Aug-2014'|
    And I press "Save"
    Then I should see "There were problems with the following fields:" on the page
    And I should see "Date of Incident: Please enter a valid date range 'From:' should be earlier than 'To:'" on the page

  Scenario: As a logged in user and create an Incident with invalid 'To:' date value, I want to see the error message
    And I fill in the following:
      | Date of Incident | <Date Range><Range> from: '10-Aug-2014', to: '22-21-2014'|
    And I press "Save"
    Then I should see "There were problems with the following fields:" on the page
    And I should see "Date of Incident: Please enter a valid date range 'From:' should be earlier than 'To:'" on the page

  Scenario: As a logged in user and create an Incident with only 'From:' value, I want to see the error message
    And I fill in the following:
      | Date of Incident | <Date Range><Range> from: '10-Aug-2014', to: ''|
    And I press "Save"
    Then I should see "There were problems with the following fields:" on the page
    And I should see "Date of Incident: Please enter a valid date range 'From:' should be earlier than 'To:'" on the page

  Scenario: As a logged in user and create an Incident with only 'To:' value, I want to see the error message
    And I fill in the following:
      | Date of Incident | <Date Range><Range> from: '', to: '10-Aug-2014'|
    And I press "Save"
    Then I should see "There were problems with the following fields:" on the page
    And I should see "Date of Incident: Please enter a valid date range 'From:' should be earlier than 'To:'" on the page

  Scenario: As a logged in user and create an Incident with date range single value invalid, I want to see the error message
    And I fill in the following:
      | Date of Incident | <Date Range><Date>addfdsfafsadf|
    And I press "Save"
    Then I should see "There were problems with the following fields:" on the page
    And I should see "Incident: Please enter the date in a valid format (dd-mmm-yyyy)" on the page

  Scenario: As a logged in user and create an Incident and enter dates with invalid values, I want to see the error message
    And I fill in the following:
      | Date of Incident | <Date Range><Date>addfdsfafsadf|
    And I press "Save"
    And I should see "There were problems with the following fields:" on the page
    And I should see "Incident: Please enter the date in a valid format (dd-mmm-yyyy)" on the page
    And I fill in the following:
      | Date of Incident | <Date Range><Range> from: 'afdsafdsfa', to: 'dsafsafdsafsd'|
    And I press "Save"
    Then I should see "There were problems with the following fields:" on the page
    And I should see "Incident: Please enter the date in a valid format (dd-mmm-yyyy)" on the page
