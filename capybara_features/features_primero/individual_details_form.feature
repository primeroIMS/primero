# JIRA PRIMERO-268
# JIRA PRIMERO-316
#JIRA PRIMERO-160
#JIRA PRIMERO-360
#JIRA PRIMERO-373
#JIRA PRIMERO-365
#JIRA PRIMERO-244

@javascript @primero
Feature: Individual Details Form
  As a social worker/data entry person, I want to to enter information about the survivor in Primero.

  Background:
    Given I am logged in as an admin with username "primero_mrm" and password "primero"
    When I access "incidents page"
    And I press the "New Incident" button
    And I press the "Individual Details" button

  Scenario: As a logged in user, I create a new incident
    And I fill in the following:
      | Survivor Code                      | SRV1001     |
      | What is the child's Date of Birth? | 10-Jun-1993 |
    And I select "Female" from "What is the sex of the child?"
    And I select "Yes" for "Is the age estimated?" radio button
    And I select "Both Parents" from "What were the care arrangements for the child at the time of the incident/violation(s)?"
    And I select "Anonymous" from "With whom is the child and/or adult caregiver willing to share their name and other personal details?"
    And I select "No" for "Is the child and/or adult caregiver willing to be contacted again about the violations?" radio button
    And I select "Yes" for "Does the Child/Adult Caregiver consent to their personal details being passed to another humanitarian agency willing and able to provide long term support?" radio button
    And I select "Yes" for "Should a case be created for this child to receive further services?" radio button
    And I select "Single" from "Current civil/marital status"
    And I select "Physical Disability" from "Disability Type"
    And I press "Save"
    Then I should see "Incident record successfully created" on the page
    And I should see in the 1st "Individual Details Subform Section" subform with the follow:
      | Survivor Code                                                                                                                                               | SRV1001             |
      | What is the child's Date of Birth?                                                                                                                          | 10-Jun-1993         |
      | What is the sex of the child?                                                                                                                               | Female              |
      | Is the age estimated?                                                                                                                                       | Yes                 |
      | What were the care arrangements for the child at the time of the incident/violation(s)?                                                                     | Both Parents        |
      | With whom is the child and/or adult caregiver willing to share their name and other personal details?                                                       | Anonymous           |
      | Is the child and/or adult caregiver willing to be contacted again about the violations?                                                                     | No                  |
      | Does the Child/Adult Caregiver consent to their personal details being passed to another humanitarian agency willing and able to provide long term support? | Yes                 |
      | Should a case be created for this child to receive further services?                                                                                        | Yes                 |
      | Current civil/marital status                                                                                                                                | Single              |
      | Disability Type                                                                                                                                             | Physical Disability |
    And I should see 1 subform on the show page for "Individual Details Subform Section"
    And I press the "Edit" button
    And I expanded the 1st "Individual Details Subform Section" subform
    And I select "No" for "Is the age estimated?" radio button
    And I press "Save"
    And I should see in the 1st "Individual Details Subform Section" subform with the follow:
      | Survivor Code                                                                                                                                               | SRV1001             |
      | What is the child's Date of Birth?                                                                                                                          | 10-Jun-1993         |
      | What is the sex of the child?                                                                                                                               | Female              |
      | Is the age estimated?                                                                                                                                       | No                  |
      | What were the care arrangements for the child at the time of the incident/violation(s)?                                                                     | Both Parents        |
      | With whom is the child and/or adult caregiver willing to share their name and other personal details?                                                       | Anonymous           |
      | Is the child and/or adult caregiver willing to be contacted again about the violations?                                                                     | No                  |
      | Does the Child/Adult Caregiver consent to their personal details being passed to another humanitarian agency willing and able to provide long term support? | Yes                 |
      | Should a case be created for this child to receive further services?                                                                                        | Yes                 |
      | Current civil/marital status                                                                                                                                | Single              |
      | Disability Type                                                                                                                                             | Physical Disability |
    And I should see 1 subform on the show page for "Individual Details Subform Section"

   Scenario: As a logged in user and create an incident with invalid age range, I should see the error messages invalid age range
     And I fill in the following:
       | What is the child's age? | 190 |
     And I press "Save"
     And I should see "Errors prohibited this record from being saved" on the page
     And I should see "There were problems with the following fields" on the page
     And I should see "Individual Details: What is the child's age? must be between 0 and 130" on the page
