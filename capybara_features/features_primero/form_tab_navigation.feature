# JIRA PRIMERO-139

@javascript @primero @search
Feature: Form Tab Navigation
  As an administrator, I want to be able to return to last viewed tab after creating a case. I also want to return
  to the last viewed tab on edit from the show page.

  Scenario: As a logged in user, I create a case and return to the last viewed tab.
    Given I am logged in as an admin with username "primero_cp" and password "primero"
    When I access "cases page"
    And I press the "Create a New Case" button
    And I press the "Photos and Audio" button
    And I attach a photo "capybara_features/resources/jorge.jpg"
    And I press "Save"
    Then I should see "Case record successfully created" on the page
    And I should stay on the "Photos and Audio" tab on the case "show" page

  Scenario: As a logged in user, I view the photos and audio tab and click edit
    Given I am logged in as an admin with username "primero_cp" and password "primero"
    And the following cases exist in the system:
      | name     | created_by | age | sex    | registration_date      | status | unique_identifier                    |
      | andreas  | primero    | 10  | male   | 03-Feb-2004            | open   | 21c4cba8-b410-4af6-b349-68c557af3aa9 |
    When I press the "CASES" button
    And I should see an id "7af3aa9" link on the page
    And I press the "7af3aa9" link
    And I press the "Photos and Audio" button
    And I press the "Edit" button
    And I should stay on the "Photos and Audio" tab on the case "edit" page
