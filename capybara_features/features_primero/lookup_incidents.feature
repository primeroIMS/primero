#JIRA PRIMERO-243

@javascript @primero
Feature: Lookup Incidents
  As a User I want to be able to choose values that are configurable using lookup tables

  Background:
    Given I am logged in as an admin with username "primero_mrm" and password "primero"
    And the following lookups exist in the system:
      | name           | lookup_values                                          |
      | country        | Country1, Country2, Country3, Country4                 |
      | nationality    | Nationality1, Nationality2, Nationality3, Nationality4 |
      | ethnicity      | Ethnicity1, Ethnicity2, Ethnicity3, Ethnicity4         |
      | language       | Language1, Language2, Language3, Language4             |
      | religion       | Religion1, Religion2, Religion3, Religion4             |
    When I access "incidents page"
    And I press the "Create a New Incident" button

  Scenario: As a logged in user, I will select lookup values from Group Details
    And I press the "Group Details" button
    And I fill in the 1st "Group Details Section" subform with the follow:
      | What were the ethnic affiliations of the children involved?                 | <Select> Ethnicity1    |
      | What was the nationality of the children involved?                          | <Select> Nationality2  |
      | What was the religious affiliation of the children involved?                | <Select> Religion3     |
    And I fill in the 2nd "Group Details Section" subform with the follow:
      | What were the ethnic affiliations of the children involved?                 | <Select> Ethnicity2    |
      | What was the nationality of the children involved?                          | <Select> Nationality1  |
      | What was the religious affiliation of the children involved?                | <Select> Religion2     |
    And I press "Save"
    Then I should see "Incident record successfully created" on the page
    And I should see in the 1st "Group Details Section" subform with the follow:
      | What were the ethnic affiliations of the children involved?                 | Ethnicity1       |
      | What was the nationality of the children involved?                          | Nationality2     |
      | What was the religious affiliation of the children involved?                | Religion3        |
    And I should see in the 2nd "Group Details Section" subform with the follow:
      | What were the ethnic affiliations of the children involved?                 | Ethnicity2       |
      | What was the nationality of the children involved?                          | Nationality1     |
      | What was the religious affiliation of the children involved?                | Religion2        |

  Scenario: As a logged in user, I will select lookup values from Individual Details
    And I press the "Individual Details" button
    And I fill in the following:
      | What is the ethnic affiliation of the individual?    | <Select> Ethnicity1     |
      | What is the national affiliation of the individual?  | <Select> Nationality1   |
      | What is the religious affiliation of the individual? | <Select> Religion1      |
      | Country of Origin                                    | <Select> Country1       |
    And I press "Save"
    Then I should see "Incident record successfully created" on the page
    And I should see in the 1st "Individual Details Subform Section" subform with the follow:
      | What is the ethnic affiliation of the individual?         | Ethnicity1          |
      | What is the national affiliation of the individual?       | Nationality1        |
      | What is the religious affiliation of the individual?      | Religion1           |
      | Country of Origin                                         | Country1            |
    And I should see 1 subform on the show page for "Individual Details Subform Section"

  Scenario: As a logged in user, I will select lookup values from Perpetrator
    And I press the "Perpetrator" button
    And I fill in the 1st "Perpetrator Subform Section" subform with the follow:
      | Nationality of alleged perpetrator | <Select> Nationality1 |
      | Clan or Ethnicity of alleged perpetrator | <Select> Ethnicity3 |
    And I fill in the 2nd "Perpetrator Subform Section" subform with the follow:
      | Nationality of alleged perpetrator | <Select> Nationality2 |
    And I press "Save"
    And I should see "Incident record successfully created." on the page
    Then I should see in the 1st "Perpetrator Subform Section" subform with the follow:
      | Nationality of alleged perpetrator | Nationality1 |
      | Clan or Ethnicity of alleged perpetrator | Ethnicity3 |
    Then I should see in the 2nd "Perpetrator Subform Section" subform with the follow:
      | Nationality of alleged perpetrator | Nationality2 |