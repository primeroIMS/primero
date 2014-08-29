# JIRA PRIMERO-165
# JIRA PRIMERO-192
# JIRA PRIMERO-232
# JIRA PRIMERO-353
# JIRA PRIMERO-363
# JIRA PRIMERO-244

@javascript @primero
Feature: Care Arrangement
  As a Social Worker, I want to fill in form information for children (individuals) in particular circumstances,
  so that we can track and report on areas of particular concern.

  Background:
    Given I am logged in as an admin with username "primero_cp" and password "primero"
    When I access "cases page"
    And I press the "Create a New Case" button
    And I press the "Services / Follow Up" button
    And I press the "Care Arrangement" button

  Scenario: As a logged in user, I create a case with care arrangement information
    And I select "Yes" for "Is this a same caregiver as was previously entered for the child?" radio button
    And I select "Education" from "If this is a new caregiver, give the reason for the change"
    And I select "Residential Care Center" from "What are the child's current care arrangements?"
    And I select "Grandmother" from "Relationship of the Caregiver to the Child"
    And I select "No" for "Is caregiver willing to continue taking care of the child?" radio button
    And I fill in the following:
      | Care Arrangement Notes                                                  | Some Care Arrangement Notes               |
      | Name of Current Caregiver                                               | Some Name of Current Caregiver            |
      | Caregiver's Identification - Type and Number                            | Type and Number                           |
      | Caregiver's Age                                                         | 40                                        |
      | Other information from the caregiver about the child and his/her family | Some other information from the caregiver |
    And I press "Save"
    Then I should see "Case record successfully created" on the page
    And I press the "Care Arrangement" button
    And I should see a value for "Is this a same caregiver as was previously entered for the child?" on the show page with the value of "Yes"
    And I should see a value for "If this is a new caregiver, give the reason for the change" on the show page with the value of "Education"
    And I should see a value for "What are the child's current care arrangements?" on the show page with the value of "Residential Care Center"
    And I should see a value for "Relationship of the Caregiver to the Child" on the show page with the value of "Grandmother"
    And I should see a value for "Is caregiver willing to continue taking care of the child?" on the show page with the value of "No"
    And I should see a value for "Care Arrangement Notes" on the show page with the value of "Some Care Arrangement Notes"
    And I should see a value for "Name of Current Caregiver" on the show page with the value of "Some Name of Current Caregiver"
    And I should see a value for "Caregiver's Identification - Type and Number" on the show page with the value of "Type and Number"
    And I should see a value for "Caregiver's Age" on the show page with the value of "40"
    And I should see a value for "If yes, what is the future address?" on the show page with the value of ""
    And I should see a value for "What is the future location?" on the show page with the value of ""
    And I should see a value for "Other information from the caregiver about the child and his/her family" on the show page with the value of "Some other information from the caregiver"

  Scenario: As a logged in user When I enter an invalid number in 'Age' field I should see a validation message
    And I fill in the following:
      | Caregiver's Age   | SS  |
    And I press "Save"
    Then I should see "There were problems with the following fields:" on the page
    And I should see "Care Arrangements: Caregiver's Age must be a valid number" on the page

  Scenario: As a logged in user When I enter an invalid number in 'Age' field I should see a validation message range
    And I fill in the following:
      | Caregiver's Age   | 160  |
    And I press "Save"
    Then I should see "There were problems with the following fields:" on the page
    And I should see "Care Arrangements: Caregiver's Age must be between 0 and 130" on the page
