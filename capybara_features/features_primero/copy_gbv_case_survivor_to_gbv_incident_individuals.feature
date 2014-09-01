# JIRA PRIMERO-474

@javascript @primero
Feature: Copy GBV Case Survivor to GBV Incident Individuals.
  From GBV Cases form with Survivor Information, the user should see a button labeled 'Create Incident' on the same line with the Edit/Cancel/Save button
  and should be able to create GBV incidents.

  Background:
    Given I am logged in as an admin with username "primero_gbv" and password "primero"
    And the following lookups exist in the system:
      | name           | lookup_values              |
      | country        | Country1, Country2         |
      | nationality    | Nationality1, Nationality2 |
      | ethnicity      | Ethnicity1, Ethnicity2     |
      | religion       | Religion1, Religion2       |
    When I access "cases page"
    And I press the "Create a New Case" button
    And I press the "Survivor Information" button
    And I fill in the following:
      | Survivor Code       | SRV1001                              |
      | Date of Birth       | 23-Sep-2007                          |
      | Sex                 | <Select> Female                      |
      | Clan or Ethnicity   | <Choose>Ethnicity1<Choose>Ethnicity2 |
      | Country of Origin   | <Select> Country1                    |
      | Nationality (if different than country of origin) | <Choose>Nationality1<Choose>Nationality2  |
      | Religion                                          | <Choose>Religion1<Choose>Religion2        |
      | Current Civil/Marital Status              | <Select> Single            |
      | Displacement Status at time of report     | <Select> Refugee           |
      | Is the Client a Person with Disabilities? | <Select> Mental Disability |
      | Is the client an Unaccompanied Minor, Separated Child, or Other Vulnerable Child? | <Select> Unaccompanied Minor |
    And I press "Save"
    And I press the "Edit" button

  Scenario: As a logged in user, I create an GBV Incident from a GBV Cases with Survivor Information.
    And I press "Create Incident"
    And I press "Save"
    Then I should see "Incident record successfully created" on the page
    And I press the "GBV Individual Details" button
    And I should see a value for "Survivor Code" on the show page with the value of "SRV1001"
    And I should see a value for "What is the child's Date of Birth?" on the show page with the value of "23-Sep-2007"
    And I should see a value for "What is the sex of the child?" on the show page with the value of "Female"
    And I should see a value for "What is the ethnic affiliation of the individual?" on the show page with the value of "Ethnicity1, Ethnicity2"
    And I should see a value for "Country of Origin" on the show page with the value of "Country1"
    And I should see a value for "What is the national affiliation of the individual?" on the show page with the value of "Nationality1, Nationality2"
    And I should see a value for "What is the religious affiliation of the individual?" on the show page with the value of "Religion1, Religion2"
    And I should see a value for "Current civil/marital status" on the show page with the value of "Single"
    And I should see a value for "What was the status of the child at the time of the violation?" on the show page with the value of "Refugee"
    And I should see a value for "Disability Type" on the show page with the value of "Mental Disability"
    And I should see a value for "Is the client an Unaccompanied Minor, Separated Child, or Other Vulnerable Child?" on the show page with the value of "Unaccompanied Minor"

  Scenario: As a logged in user and I have GBV Cases with validation issues, I should see validation errors messages and stay on the GBV Cases form.
    And I fill in the following:
      | Date of Birth  | 21-21-2007 |
    And I press "Create Incident"
    And I press the "Survivor Information" button
    Then I should see "There were problems with the following fields:" on the page
    And I should see "Survivor Information: Please enter the date in a valid format (dd-mmm-yyyy)" on the page
    