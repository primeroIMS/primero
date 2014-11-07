# JIRA PRIMERO-123
# JIRA PRIMERO-232
# JIRA PRIMERO-353
# JIRA PRIMERO-363
# JIRA PRIMERO-736

@javascript @primero
Feature: Child Under 5
  As a Social Worker, I want to fill in form information for children (individuals) in particular circumstances
  so that we can track and report on areas of particular concern.

  Scenario: As a logged in user, I create a case with child under 5 information
    Given I am logged in as an admin with username "primero_cp" and password "primero"
    And the following location country exist in the system:
      | placename            |
      | A Location Country   |
    When I access "cases page"
    And I press the "New Case" button
    And I press the "Assessment" button
    And I press the "Child Under 5" button
    And I fill in the following:
      | Date child was found                   | 15-Sep-2014                 |
      | Location where child was found         | <Choose>A Location Country  |
      | Found in Village/Area/Physical Address | Village Found Address       |
      | If the child speaks with an accent and if the family separation has been short (few months), from what region do you think the child comes from?                                      | Region child come from    |
      | Please write down any behavior specific to the child that may help a parent identify him/her later on such as child's games, and main interests or specific things he/she likes to do | Child games, Main Interest|
      | Please describe in detail how the child was found or taken in the family/children's center | Details about how the child was found in the family center. |
    And I select "Yes" for "Are there any clothes and belongings the child was found with?" radio button
    And I press "Save"
    Then I should see a success message for new Case
    And I press the "Child Under 5" button
    And I should see a value for "Date child was found" on the show page with the value of "15-Sep-2014"
    And I should see a value for "Location where child was found" on the show page with the value of "A Location Country"
    And I should see a value for "Found in Village/Area/Physical Address" on the show page with the value of "Village Found Address"
    And I should see a value for "If the child speaks with an accent and if the family separation has been short (few months), from what region do you think the child comes from?" on the show page with the value of "Region child come from"
    And I should see a value for "Please write down any behavior specific to the child that may help a parent identify him/her later on such as child's games, and main interests or specific things he/she likes to do" on the show page with the value of "Child games, Main Interest"
    And I should see a value for "Are there any clothes and belongings the child was found with?" on the show page with the value of "Yes"
    And I should see a value for "Please describe in detail how the child was found or taken in the family/children's center" on the show page with the value of "Details about how the child was found in the family center."
