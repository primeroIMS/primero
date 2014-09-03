# JIRA PRIMERO-116
# JIRA PRIMERO-353
# JIRA PRIMERO-363

@javascript @primero
Feature: Best Interest
  Social Worker document the best interest determination process we have that information recorded.

  Scenario: As a logged in user, I create a case with best interest information
    Given I am logged in as an admin with username "primero_cp" and password "primero"
    When I access "cases page"
    And I press the "New Case" button
    And I press the "Assessment" button
    And I press the "Best Interest" button
    When I select "Submitted" from "Was the report submitted to the body that decides the best interest of the child?"
    And I select "Local integration" from "Recommendation"
    And I press "Save"
    Then I should see "Case record successfully created" on the page
    When I press the "Best Interest" button
    Then I should see a value for "Was the report submitted to the body that decides the best interest of the child?" on the show page with the value of "Submitted"
    And I should see a value for "Recommendation" on the show page with the value of "Local integration"
