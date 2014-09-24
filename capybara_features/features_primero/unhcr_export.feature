@javascript @primero
Feature: UNHCR CSV Export

  Scenario: Export completes successfully
    Given I am logged in as an admin with username "primero_cp" and password "primero"
    And the following lookups exist in the system:
      | name           | lookup_values                                          |
      | country        | Country1, Country2, Country3, Country4                 |
      | nationality    | Nationality1, Nationality2, Nationality3, Nationality4 |
      | ethnicity      | Ethnicity1, Ethnicity2, Ethnicity3, Ethnicity4         |
      | language       | Language1, Language2, Language3, Language4             |
      | religion       | Religion1, Religion2, Religion3, Religion4             |
    When I access "cases page"
    And I press the "New Case" button
    And I press the "Other Identity Details" button
    And I fill in the following:
      | Nationality            | <Choose>Nationality1<Choose>Nationality3 |
      | Birth Country          | <Select> Country1                        |
      | Country of Origin      | <Select> Country2                        |
      | Ethnicity/Clan/Tribe   | <Choose>Ethnicity1<Choose>Ethnicity2     |
      | Sub Ethnicity 1        | <Choose>Ethnicity3                       |
      | Language               | <Choose>Language1<Choose>Language2       |
      | Religion               | <Choose>Religion1<Choose>Religion2       |
    And I press "Save"
    Then I should see "Case record successfully created" on the page
    When I press the "Actions" button
    And I press the "Export" button
    And I press the "UNHCR" button
    When I fill in "password-prompt-field" with "abcd"
    And I press the "OK" button
    Then I should not see a stacktrace

