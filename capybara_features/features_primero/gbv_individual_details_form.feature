#JIRA PRIMERO-479

@javascript @primero
Feature: GBV Individual Details Form
  As a social worker/data entry person, I want to to enter information about the survivor in Primero.

  Scenario: As a logged in user, I create a new incident
    Given I am logged in as an admin with username "primero_gbv" and password "primero"
    When I access "incidents page"
    And I press the "New Incident" button
    And I press the "GBV Individual Details" button
    And I fill in the following:
      | Survivor Code                      | SRV1001     |
      | What is the survivor's Date of Birth? | 10-Jun-1993 |
    And I press "Save"
    Then I should see "Incident record successfully created" on the page
    And I should see a value for "Survivor Code" on the show page with the value of "SRV1001"
    And I should see a value for "What is the survivor's Date of Birth?" on the show page with the value of "10-Jun-1993"
