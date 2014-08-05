# JIRA PRIMERO-121

@javascript @primero
Feature: Tracing Closure Details Fields
  As a Social Worker I want to fill in the FTR Closure Form details
  so that I can report on the success (or not) of the reunification and close out the tracing
  and reporting actions associated with the case.

  Scenario: As a logged in user, I should be able to fill in a form with closure details
    Given I am logged in as an admin with username "primero" and password "primero"
    When I access "cases page"
    And I press the "Create a New Case" button
    And I press the "Tracing" button
    And I click on "Tracing" in form group "Tracing"
    And I should see "Closure Details" on the page
    And I should see the following fields:
      | Date of Closure           |
      | Caregiver Name            |
      | Caregiver Relationship    |
      | Caregiver Address         |
      | Caregiver Location        |
    And I fill in the following:
      | Date of Closure        | 04-May-2014                |
      | Caregiver Name         | Shabazz Nurendu            |
      | Caregiver Relationship | Father                     |
      | Caregiver Address      | 1900 B. Ave                |
      | Caregiver Location     | Kenya                      |
    And I press "Save"
    Then I should see "Case record successfully created" on the page
    And I should see "Closure Details" on the page
    And I should see a value for "Date of Closure" on the show page with the value of "04-May-2014"
    And I should see a value for "Caregiver Name" on the show page with the value of "Shabazz Nurendu"
    And I should see a value for "Caregiver Relationship" on the show page with the value of "Father"
    And I should see a value for "Caregiver Address" on the show page with the value of "1900 B. Ave"
    And I should see a value for "Caregiver Location" on the show page with the value of "Kenya"

