#JIRA PRIMERO-429

@javascript @primero
Feature: Closure Form
  As a Social Worker I want to fill in the Closure Form

  Scenario: As a logged in user, I should be able to fill closure form
    Given I am logged in as an admin with username "primero" and password "primero"
    When I access "cases page"
    And I press the "New Case" button
    And I press the "Closure" button
    And I should see the following fields:
      | Date of Closure           |
      | Caregiver Name            |
      | Caregiver Relationship    |
      | Caregiver Address         |
      | Caregiver Location        |
    And I fill in the following:
      | What is the reason for closing the child's file? | <Select> Death of Child |
      | Date of Closure                                  | 04-May-2014             |
      | Caregiver Name                                   | Shabazz Nurendu         |
      | Caregiver Relationship                           | Father                  |
      | Caregiver Address                                | 1900 B. Ave             |
      | Caregiver Location                               | Kenya                   |
    And I press "Save"
    Then I should see "Case record successfully created" on the page
    And I should see a value for "What is the reason for closing the child's file?" on the show page with the value of "Death of Child"
    And I should see a value for "Date of Closure" on the show page with the value of "04-May-2014"
    And I should see a value for "Caregiver Name" on the show page with the value of "Shabazz Nurendu"
    And I should see a value for "Caregiver Relationship" on the show page with the value of "Father"
    And I should see a value for "Caregiver Address" on the show page with the value of "1900 B. Ave"
    And I should see a value for "Caregiver Location" on the show page with the value of "Kenya"

