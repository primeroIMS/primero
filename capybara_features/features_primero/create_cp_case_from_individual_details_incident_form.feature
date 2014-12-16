# JIRA PRIMERO-693

@javascript @primero @search
Feature: Create a CP Case from Individual Details Incident Form.

  Scenario: The user can create CP Cases
    When I am logged in as an admin with username "primero" and password "primero"
    And the following lookups exist in the system:
      | name                           | lookup_values                                                    |
      | country                        | Country1, Country2, Country3, Country4                           |
      | nationality                    | Nationality1, Nationality2                                       |
      | ethnicity                      | Ethnicity1, Ethnicity2, Ethnicity3                               |
      | religion                       | Religion1, Religion2                                             |
      | displacement_status            | Resident, IDP, Refugee, Stateless Person, Returnee, Foreign National, Asylum Seeker |
    And I access "incidents page"
    And I press the "New Incident" button
    And I press the "MRM" link
    And I press the "Individual Details" button
    And I fill in the following:
      | Survivor Code                      | SRV1001     |
      | What is the child's Date of Birth? | 10-Jun-1993 |
    And I select "Female" for "What is the sex of the child?" radio button
    And I select "Yes" for "Is the age estimated?" radio button
    And I select "Ethnicity3" from "What is the ethnic affiliation of the individual?"
    And I select "Nationality2" from "What is the national affiliation of the individual?"
    And I select "Religion2" from "What is the religious affiliation of the individual?"
    And I select "Country4" from "Country of Origin"
    And I select "Nationality2" from "What is the national affiliation of the individual?"
    And I select "Resident" from "Displacement Status at time of report"
    And I select "Yes" for "Should a case be created for this child to receive further services?" radio button
    And I select "Physical Disability" for "Disability Type" radio button
    And I press "Save"
    And I should see a success message for new Incident
    And I create a CP Case from the 1st individual details subform
    And I should see "New Case" on the page
    And I press "Save"
    And I should see a success message for new Case
    And I should see a value for "Date of Birth" on the show page with the value of "10-Jun-1993"
    And I should see a value for "Sex" on the show page with the value of "Female"
    And I should see a value for "Is the age estimated?" on the show page with the value of "Yes"
    And I press the "Protection Concerns" link
    And I should see a value for "Displacement Status" on the show page with the value of "Resident"
    And I should see a value for "Disability Type" on the show page with the value of "Physical Disability"
    And I press the "Other Identity Details" link
    And I should see a value for "Nationality" on the show page with the value of "Nationality2"
    And I should see a value for "Country of Origin" on the show page with the value of "Country4"
    And I should see a value for "Ethnicity/Clan/Tribe" on the show page with the value of "Ethnicity3"
    And I should see a value for "Religion" on the show page with the value of "Religion2"

  Scenario: The user can't create CP Cases
    And I am logged in as an admin with username "primero_mrm" and password "primero"
    And I access "incidents page"
    And I press the "New Incident" button
    And I press the "Individual Details" button
    And I fill in the following:
      | Survivor Code                      | SRV1001     |
      | What is the child's Date of Birth? | 10-Jun-1993 |
    And I select "Female" for "What is the sex of the child?" radio button
    And I select "Yes" for "Is the age estimated?" radio button
    And I select "Ethnicity3" from "What is the ethnic affiliation of the individual?"
    And I select "Nationality2" from "What is the national affiliation of the individual?"
    And I select "Religion2" from "What is the religious affiliation of the individual?"
    And I select "Country4" from "Country of Origin"
    And I select "Nationality2" from "What is the national affiliation of the individual?"
    And I select "Resident" from "Displacement Status at time of report"
    And I select "Yes" for "Should a case be created for this child to receive further services?" radio button
    And I select "Physical Disability" for "Disability Type" radio button
    And I press "Save"
    And I should see a success message for new Incident
    And I should not see a "Create Case" button on the page