# JIRA PRIMERO-140

@javascript @primero
Feature: Form Tab Validation Navigation
  As an administrator, I want to be able to return to the first tab with validation errors

  Scenario: As a logged in user, I create a case with correct Basic Identity data and incorrect Photos and Audio data
    Given I am logged in as an admin with username "primero" and password "primero"
    When I access "cases page"
    And I press the "Create a New Case" button
    And I fill in the following:
      | Name              | Tiki Thomas Taliaferro               |
      | Age               | 22                                   |
    And I press the "Photos and Audio" button
    And I attach a photo "capybara_features/resources/textfile.txt"
    And I press "Save"
    Then I should stay on the "Photos and Audio" tab on the case "index" page
    And I should see "Errors prohibited this record from being saved" on the page
    And I should see "There were problems with the following fields" on the page
    And I should see "Photos and Audio: Please upload a valid photo file (jpg or png) for this case record" on the page

  Scenario: As a logged in user, I create a case with both incorrect Basic Identity and Photos and Audio data
    Given I am logged in as an admin with username "primero" and password "primero"
    When I access "cases page"
    And I press the "Create a New Case" button
    And I fill in the following:
      | Name              | Tiki Thomas Taliaferro                 |
      | Age               | 2223                                   |
    And I press the "Photos and Audio" button
    And I attach a photo "capybara_features/resources/textfile.txt"
    And I press "Save"
    Then I should stay on the "Photos and Audio" tab on the case "index" page
    And I should see "Errors prohibited this record from being saved" on the page
    And I should see "There were problems with the following fields" on the page
    And I should see "Basic Identity: Age must be between 0 and 130" on the page
    And I should see "Photos and Audio: Please upload a valid photo file (jpg or png) for this case record" on the page
