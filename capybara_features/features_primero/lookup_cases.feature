#JIRA PRIMERO-243

@javascript @primero
Feature: Lookup Cases
  As a User I want to be able to choose values that are configurable using lookup tables

  Background:
    Given I am logged in as an admin with username "primero" and password "primero"
    And the following lookups exist in the system:
      | name           | lookup_values                                          |
      | country        | Country1, Country2, Country3, Country4                 |
      | nationality    | Nationality1, Nationality2, Nationality3, Nationality4 |
      | ethnicity      | Ethnicity1, Ethnicity2, Ethnicity3, Ethnicity4         |
      | language       | Language1, Language2, Language3, Language4             |
      | religion       | Religion1, Religion2, Religion3, Religion4             |
    When I access "cases page"
    And I press the "Create a New Case" button

  Scenario: As a logged in user, I will select lookup values from Other Identity Details
    And I press the "Other Identity Details" button
    And I fill in the following:
      | Nationality            | <Choose>Nationality1<Choose>Nationality3 |
      | Birth Country          | <Select> Country1                        |
      | Country of Origin      | <Select> Country2                        |
      | Ethnicity/Clan/Tribe   | <Choose>Ethnicity1<Choose>Ethnicity2     |
      | Sub Ethnicity 1        | <Choose>Ethnicity1                       |
      | Sub Ethnicity 2        | <Choose>Ethnicity3                       |
      | Language               | <Choose>Language1<Choose>Language2       |
      | Religion               | <Choose>Religion1<Choose>Religion2       |
    And I press "Save"
    Then I should see "Case record successfully created" on the page
    And I should see values on the page for the following:
      |Nationality             | Nationality1, Nationality3 |
      |Birth Country           | Country1                   |
      |Country of Origin       | Country2                   |
      |Ethnicity/Clan/Tribe    | Ethnicity1, Ethnicity2     |
      |Sub Ethnicity 1         | Ethnicity1                 |
      |Sub Ethnicity 2         | Ethnicity3                 |
      |Language                | Language1, Language2       |
      |Religion                | Religion1, Religion2       |

  Scenario: As a logged in user, I will select lookup values from Family Details
    And I press the "Family / Partner Details" button
    And I click on "Family Details" in form group "Family / Partner Details"
    And I fill in the 1st "Family Details Section" subform with the follow:
      |Language                                              | <Choose>Language1<Choose>Language2         |
      |Religion                                              | <Choose>Religion1<Choose>Religion2         |
      |Ethnicity                                             | <Select> Ethnicity1                        |
      |Sub Ethnicity 1                                       | <Select> Ethnicity1                        |
      |Sub Ethnicity 2                                       | <Select> Ethnicity2                        |
      |Nationality                                           | <Choose>Nationality1<Choose>Nationality2   |
    And I fill in the 2st "Family Details Section" subform with the follow:
      |Name                                                  | Pedro                                      |
      |Language                                              | <Choose>Language2                          |
      |Religion                                              | <Choose>Religion2                          |
      |Ethnicity                                             | <Select> Ethnicity2                        |
      |Sub Ethnicity 1                                       | <Select> Ethnicity2                        |
      |Sub Ethnicity 2                                       | <Select> Ethnicity1                        |
      |Nationality                                           | <Choose>Nationality2                       |
    And I press "Save"
    Then I should see "Case record successfully created" on the page
    And I should see in the 1st "Family Details Section" subform with the follow:
      |Language                                              | Language1, Language2         |
      |Religion                                              | Religion1, Religion2         |
      |Ethnicity                                             | Ethnicity1                   |
      |Sub Ethnicity 1                                       | Ethnicity1                   |
      |Sub Ethnicity 2                                       | Ethnicity2                   |
      |Nationality                                           | Nationality1, Nationality2   |
    And I should see in the 2nd "Family Details Section" subform with the follow:
      |Name                                                  | Pedro                        |
      |Language                                              | Language2                    |
      |Religion                                              | Religion2                    |
      |Ethnicity                                             | Ethnicity2                   |
      |Sub Ethnicity 1                                       | Ethnicity2                   |
      |Sub Ethnicity 2                                       | Ethnicity1                   |
      |Nationality                                           | Nationality2                 |