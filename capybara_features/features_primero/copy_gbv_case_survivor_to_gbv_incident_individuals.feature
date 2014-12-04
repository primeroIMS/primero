# JIRA PRIMERO-474
# JIRA PRIMERO-520
# JIRA PRIMERO-474
# JIRA PRIMERO-547
# JIRA PRIMERO-548
# JIRA PRIMERO-736
# JIRA PRIMERO-823

@javascript @primero @search
Feature: Copy GBV Case Survivor to GBV Incident Individuals.
  From GBV Cases form with Survivor Information, the user should see a button labeled 'Create Incident' on the same line with the Edit/Cancel/Save button
  and should be able to create GBV incidents.

  Background:
    Given I am logged in as an admin with username "primero_gbv" and password "primero"
    And the following lookups exist in the system:
      | name                           | lookup_values                                                    |
      | country                        | Country1, Country2                                               |
      | nationality                    | Nationality1, Nationality2                                       |
      | ethnicity                      | Ethnicity1, Ethnicity2                                           |
      | religion                       | Religion1, Religion2                                             |
      | unaccompanied_separated_status | No, Unaccompanied Minor, Separated Child, Other Vulnerable Child |
      | displacement_status            | Resident, IDP, Refugee, Stateless Person, Returnee, Foreign National, Asylum Seeker |
    When I access "cases page"
    And I press the "New Case" button
    And I press the "Survivor Information" button
    And I fill in the following:
      | Survivor Code       | SRV1001                              |
      | Date of Birth       | 23-Sep-2007                          |
      | Sex                 | <Radio> Female                       |
      | Clan or Ethnicity   | <Select> Ethnicity1                  |
      | Country of Origin   | <Select> Country1                    |
      | Nationality (if different than country of origin) | <Select> Nationality1  |
      | Religion                                          | <Select> Religion1     |
      | Current Civil/Marital Status              | <Select> Single            |
      | Displacement Status at time of report     | <Select> Refugee           |
      | Is the Survivor a Person with Disabilities? | <Select> Mental Disability |
      | Is the Survivor an Unaccompanied Minor, Separated Child, or Other Vulnerable Child? | <Select> Unaccompanied Minor |
    And I press "Save"

  Scenario: As a logged in user, I create an GBV Incident from a GBV Cases with Survivor Information when editing.
    And I press the "Edit" button
    And I press "Create Incident"
    And I press "Save"
    Then I should see a success message for new Incident
    And I press the "GBV Individual Details" button
    And I should see a value for "Survivor Code" on the show page with the value of "SRV1001"
    And I should see a value for "What is the survivor's Date of Birth?" on the show page with the value of "23-Sep-2007"
    And I should see a value for "What is the sex of the survivor?" on the show page with the value of "Female"
    And I should see a value for "What is the ethnic affiliation of the survivor?" on the show page with the value of "Ethnicity1"
    And I should see a value for "Country of Origin" on the show page with the value of "Country1"
    And I should see a value for "What is the national affiliation of the survivor?" on the show page with the value of "Nationality1"
    And I should see a value for "What is the religious affiliation of the survivor?" on the show page with the value of "Religion1"
    And I should see a value for "Current civil/marital status" on the show page with the value of "Single"
    And I should see a value for "Displacement Status at time of report" on the show page with the value of "Refugee"
    And I should see a value for "Is the survivor an Unaccompanied Minor, Separated Child, or Other Vulnerable Child?" on the show page with the value of "Unaccompanied Minor"
    And I should see a value for "Disability Type" on the show page with the value of "Mental Disability"

  Scenario: As a logged in user, I create an GBV Incident from a GBV Cases with Survivor Information when viewing.
    And I press the "Create Incident" button
    And I press "Save"
    Then I should see a success message for new Incident
    And I press the "GBV Individual Details" button
    And I should see a value for "Survivor Code" on the show page with the value of "SRV1001"
    And I should see a value for "What is the survivor's Date of Birth?" on the show page with the value of "23-Sep-2007"
    And I should see a value for "What is the sex of the survivor?" on the show page with the value of "Female"
    And I should see a value for "What is the ethnic affiliation of the survivor?" on the show page with the value of "Ethnicity1"
    And I should see a value for "Country of Origin" on the show page with the value of "Country1"
    And I should see a value for "What is the national affiliation of the survivor?" on the show page with the value of "Nationality1"
    And I should see a value for "What is the religious affiliation of the survivor?" on the show page with the value of "Religion1"
    And I should see a value for "Current civil/marital status" on the show page with the value of "Single"
    And I should see a value for "Displacement Status at time of report" on the show page with the value of "Refugee"
    And I should see a value for "Is the survivor an Unaccompanied Minor, Separated Child, or Other Vulnerable Child?" on the show page with the value of "Unaccompanied Minor"
    And I should see a value for "Disability Type" on the show page with the value of "Mental Disability"

  Scenario: As a logged in user and I have GBV Cases with validation issues, I should see validation errors messages and stay on the GBV Cases form.
    And I press the "Edit" button
    And I fill in the following:
      | Date of Birth  | 21-21-2007 |
    And I press "Create Incident"
    And I press the "Survivor Information" button
    Then I should see "There were problems with the following fields:" on the page
    And I should see "Survivor Information: Please enter the date in a valid format (dd-mmm-yyyy)" on the page
    
  Scenario: As a logged in user, I create an GBV Incident from a GBV Cases, I should see the Incident Links populated.
    And I press the "Create Incident" button
    And I press "Save"
    And I access "cases page"
    And I click the case
    And I press the "Edit" button
    And I press the "Action Plan" button
    Then I should see incident links
    