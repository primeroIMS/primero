# JIRA PRIMERO-354
# JIRA PRIMERO-353
# JIRA PRIMERO-363

@javascript @primero
Feature: Interview Details Form
  We want to break up Basic Identity into multiple forms so it will be easier for users to navigate and also so
  that it's easier for users to opt to not use certain sections (like protection or care concerns)

  Scenario: As a logged in user, I create a case by entering other identity details information
    Given I am logged in as an admin with username "primero" and password "primero"
    When I access "cases page"
    And I press the "Create a New Case" button
    And I press the "Other Identity Details" button
    And I fill in the following:
      | Nationality            | <Choose>Nationality1<Choose>Nationality3 |
      | Place of Birth         | Boston                                   |
      | Birth Country          | <Select> Country1                        |
      | Country of Origin      | <Select> Country2                        |
      | Last Address           | 222 1st Ave, Mooresville NC, 28117       |
      | Last Landmark          | Roller Coaster Hill                      |
      | Last Location          | Northwest                                |
      | Last Telephone         | 828-555-1414                             |
      | Ethnicity/Clan/Tribe   | <Choose>Ethnicity1<Choose>Ethnicity2     |
      | Sub Ethnicity 1        | <Choose>Ethnicity1                       |
      | Sub Ethnicity 2        | <Choose>Ethnicity3                       |
      | Language               | <Choose>Language1<Choose>Language2       |
      | Religion               | <Choose>Religion1<Choose>Religion2       |
    And I press "Save"
    Then I should see "Case record successfully created" on the page
    And I should see a value for "Nationality" on the show page with the value of "Nationality1, Nationality3"
    And I should see a value for "Place of Birth" on the show page with the value of "Boston"
    And I should see a value for "Birth Country" on the show page with the value of "Country1"
    And I should see a value for "Country of Origin" on the show page with the value of "Country2"
    And I should see a value for "Last Address" on the show page with the value of "222 1st Ave, Mooresville NC, 28117"
    And I should see a value for "Last Landmark" on the show page with the value of "Roller Coaster Hill"
    And I should see a value for "Last Location" on the show page with the value of "Northwest"
    And I should see a value for "Last Telephone" on the show page with the value of "828-555-1414"
    And I should see a value for "Ethnicity/Clan/Tribe" on the show page with the value of "Ethnicity1, Ethnicity2"
    And I should see a value for "Sub Ethnicity 1" on the show page with the value of "Ethnicity1"
    And I should see a value for "Sub Ethnicity 2" on the show page with the value of "Ethnicity3"
    And I should see a value for "Language" on the show page with the value of "Language1, Language2"
    And I should see a value for "Religion" on the show page with the value of "Religion1, Religion2"
