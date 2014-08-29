#JIRA PRIMERO-243

@javascript @primero
Feature: Lookup Tracing Requests
  As a User I want to be able to choose values that are configurable using lookup tables

  Background:
    Given I am logged in as an admin with username "primero_cp" and password "primero"
    And the following lookups exist in the system:
      | name           | lookup_values                                          |
      | country        | Country1, Country2, Country3, Country4                 |
      | nationality    | Nationality1, Nationality2, Nationality3, Nationality4 |
      | ethnicity      | Ethnicity1, Ethnicity2, Ethnicity3, Ethnicity4         |
      | language       | Language1, Language2, Language3, Language4             |
      | religion       | Religion1, Religion2, Religion3, Religion4             |
    When I access "tracing requests page"
    And I press the "Create a New Tracing Request" button

  Scenario: As a logged in user, I will select lookup values from Inquirer
    And I press the "Inquirer" button
    And I fill in the following:
      | Language                                | <Choose>Language1     |
      | Religion                                | <Choose>Religion1     |
      | Ethnicity                               | <Select> Ethnicity1   |
      | Sub Ethnicity 1                         | <Select> Ethnicity1   |
      | Sub Ethnicity 2                         | <Select> Ethnicity2   |
      | Nationality                             | <Choose>Nationality1  |
    And I press "Save"
    Then I should see "Tracing Request record successfully created" on the page
    And I should see values on the page for the following:
      |Language                | Language1    |
      |Religion                | Religion1    |
      |Ethnicity               | Ethnicity1   |
      |Sub Ethnicity 1         | Ethnicity1   |
      |Sub Ethnicity 2         | Ethnicity2   |
      |Nationality             | Nationality1 |