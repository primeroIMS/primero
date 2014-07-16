# JIRA PRIMERO-268

@javascript @primero
Feature: Individual Details Form
  As a social worker/data entry person, I want to to enter information about the survivor in Primero.

  Scenario: As a logged in user, I create a new incident
    Given I am logged in as an admin with username "primero" and password "primero"
    When I access "incidents page"
    And I press the "Create a New Incident" button
    And I press the "Individual Details" button
    And I fill in the following:
      | Survivor Code                      | SRV1001     |
      | What is the child's Date of Birth? | 10/Jun/1993 |
    And I select "Female" from "What is the sex of the child?"
    And I select "Yes" for "Is the age estimated?" radio button
    And I select "Ethnicity1" from "What is the ethnic affiliation of the Victim/Survivor?"
    And I select "Nationality1" from "What is the national affiliation of the Victim/Survivor?"
    And I select "Religion1" from "What is the religious affiliation of the Victim/Survivor?"
    And I select "Country1" from "Country of Origin"
    And I select "IDP" from "What was the status of the child at the time of the violation?"
    And I select "Resident" from "Displacement Status at time of report"
    And I select "Both Parents" from "What were the care arrangements for the child at the time of the incident/violation(s)?"
    And I select "Anonymous" from "With whom is the child and/or adult caregive willing to share their name and other personal details?"
    And I select "No" for "Is the child and/or adult caregiver willing to be contacted again about the violations?" radio button
    And I select "Yes" for "Does the Child/Adult Caregiver consent to their personal details being passed to another humanitarian agency willing and able to provide long term support?" radio button
    And I select "Yes" for "Should a case be created for this child to receive further services?" radio button
    And I select "Single" from "Current civil/marital status"
    And I select "Physical Disability" from "Disability Type"
    And I select "No" from "Is the client an Unaccompanied Minor, Separated Child, or Other Vulnerable Child?"
    And I fill in the 1st "Individual Details Subform Section" subform with the follow:
      | Survivor Code                                                                                                                                               | SRV1001                      |
      | What is the child's Date of Birth?                                                                                                                          | 02/May/1993                  |
      | What is the sex of the child?                                                                                                                               | <Select> Female              |
      | Is the age estimated?                                                                                                                                       | <Radio> No                   |
      | What is the ethnic affiliation of the Victim/Survivor?                                                                                                      | <Select> Ethnicity2          |
      | What is the national affiliation of the Victim/Survivor?                                                                                                    | <Select> Nationality2        |
      | What is the religious affiliation of the Victim/Survivor?                                                                                                   | <Select> Religion2           |
      | Country of Origin                                                                                                                                           | <Select> Country2            |
      | What was the status of the child at the time of the violation?                                                                                              | <Select> IDP                 |
      | Displacement Status at time of report                                                                                                                       | <Select> Resident            |
      | What were the care arrangements for the child at the time of the incident/violation(s)?                                                                     | <Select> Both Parents        |
      | With whom is the child and/or adult caregive willing to share their name and other personal details?                                                        | <Select> Anonymous           |
      | Is the child and/or adult caregiver willing to be contacted again about the violations?                                                                     | <Radio> Yes                  |
      | Does the Child/Adult Caregiver consent to their personal details being passed to another humanitarian agency willing and able to provide long term support? | <Radio> No                   |
      | Should a case be created for this child to receive further services?                                                                                        | <Radio> No                   |
      | Current civil/marital status                                                                                                                                | <Select> Single              |
      | Disability Type                                                                                                                                             | <Select> Physical Disability |
      | Is the client an Unaccompanied Minor, Separated Child, or Other Vulnerable Child?                                                                           | <Select> No                  |
    And I press "Save"
    Then I should see "Incident record successfully created" on the page
    And I should see a value for "Survivor Code" on the show page with the value of "SRV1001"
    And I should see a value for "What is the child's Date of Birth?" on the show page with the value of "10-Jun-1993"
    Then I should see the calculated Age for "What is the child's age?" of a child born in "1993"
    And I should see a value for "What is the sex of the child?" on the show page with the value of "Female"
    And I should see a value for "Is the age estimated?" on the show page with the value of "Yes"
    And I should see a value for "What is the ethnic affiliation of the Victim/Survivor?" on the show page with the value of "Ethnicity1"
    And I should see a value for "What is the national affiliation of the Victim/Survivor?" on the show page with the value of "Nationality1"
    And I should see a value for "What is the religious affiliation of the Victim/Survivor?" on the show page with the value of "Religion1"
    And I should see a value for "Country of Origin" on the show page with the value of "Country1"
    And I should see a value for "What was the status of the child at the time of the violation?" on the show page with the value of "IDP"
    And I should see a value for "Displacement Status at time of report" on the show page with the value of "Resident"
    And I should see a value for "What were the care arrangements for the child at the time of the incident/violation(s)?" on the show page with the value of "Both Parents"
    And I should see a value for "With whom is the child and/or adult caregive willing to share their name and other personal details?" on the show page with the value of "Anonymous"
    And I should see a value for "Is the child and/or adult caregiver willing to be contacted again about the violations?" on the show page with the value of "No"
    And I should see a value for "Does the Child/Adult Caregiver consent to their personal details being passed to another humanitarian agency willing and able to provide long term support?" on the show page with the value of "Yes"
    And I should see a value for "Should a case be created for this child to receive further services?" on the show page with the value of "Yes"
    And I should see a value for "Current civil/marital status" on the show page with the value of "Single"
    And I should see a value for "Disability Type" on the show page with the value of "Physical Disability"
    And I should see a value for "Is the client an Unaccompanied Minor, Separated Child, or Other Vulnerable Child?" on the show page with the value of "No"
    And I should see in the 1st "Individual Detail" subform with the follow:
      | Survivor Code                                                                                                                                               | SRV1001             |
      | What is the child's Date of Birth?                                                                                                                          | 02-May-1993         |
      | What is the sex of the child?                                                                                                                               | Female              |
      | Is the age estimated?                                                                                                                                       | No                  |
      | What is the ethnic affiliation of the Victim/Survivor?                                                                                                      | Ethnicity2          |
      | What is the national affiliation of the Victim/Survivor?                                                                                                    | Nationality2        |
      | What is the religious affiliation of the Victim/Survivor?                                                                                                   | Religion2           |
      | Country of Origin                                                                                                                                           | Country2            |
      | What was the status of the child at the time of the violation?                                                                                              | IDP                 |
      | Displacement Status at time of report                                                                                                                       | Resident            |
      | What were the care arrangements for the child at the time of the incident/violation(s)?                                                                     | Both Parents        |
      | With whom is the child and/or adult caregive willing to share their name and other personal details?                                                        | Anonymous           |
      | Is the child and/or adult caregiver willing to be contacted again about the violations?                                                                     | Yes                 |
      | Does the Child/Adult Caregiver consent to their personal details being passed to another humanitarian agency willing and able to provide long term support? | No                  |
      | Should a case be created for this child to receive further services?                                                                                        | No                  |
      | Current civil/marital status                                                                                                                                | Single              |
      | Disability Type                                                                                                                                             | Physical Disability |
      | Is the client an Unaccompanied Minor, Separated Child, or Other Vulnerable Child?                                                                           | No                  |