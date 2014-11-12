# JIRA PRIMERO-354
# JIRA PRIMERO-353
# JIRA PRIMERO-363
# JIRA PRIMERO-736

@javascript @primero
Feature: Interview Details Form
  We want to break up Basic Identity into multiple forms so it will be easier for users to navigate and also so
  that it's easier for users to opt to not use certain sections (like protection or care concerns)

  Scenario: As a logged in user, I create a case by entering other identity details information
    Given I am logged in as an admin with username "primero_cp" and password "primero"
    And the following location country exist in the system:
      | placename            |
      | A Location Country   |
    When I access "cases page"
    And I press the "New Case" button
    And I press the "Other Identity Details" button
    And I fill in the following:
      | Place of Birth         | Boston                                   |
      | Last Address           | 222 1st Ave, Mooresville NC, 28117       |
      | Last Landmark          | Roller Coaster Hill                      |
      | Last Location          | <Choose>A Location Country               |
      | Last Telephone         | 828-555-1414                             |
    And I press "Save"
    Then I should see a success message for new Case
    And I should see a value for "Place of Birth" on the show page with the value of "Boston"
    And I should see a value for "Last Address" on the show page with the value of "222 1st Ave, Mooresville NC, 28117"
    And I should see a value for "Last Landmark" on the show page with the value of "Roller Coaster Hill"
    And I should see a value for "Last Location" on the show page with the value of "A Location Country"
    And I should see a value for "Last Telephone" on the show page with the value of "828-555-1414"
