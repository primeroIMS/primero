# JIRA PRIMERO-42

@javascript @primero
Feature: Basic Identity Form
  As an administrator, I want to be able to create a case with a auto generated case id, short id, and registration date.
  I also want the case status to default to open leaving the option to set it another status by the user.

  Scenario: As a logged in user, I create a case with some values in the basic identity form
    Given I am logged in as an admin with username "primero" and password "primero"
    When I access "cases page"
    And I press the "Create a New Case" button
    Then I should see the following fields:
    | Name              |
    | Age               |
    | Sex               |
    | Registration Date |
    | Status            |

    And I fill in the following:
      | Name              | Tiki Thomas Taliaferro               |
      | Age               | 22                                   |
    And I select "Male" from "Sex"
    And I press "Save"
    Then I should see "Case record successfully created" on the page
    And I should see a value for "Case ID" on the show page
    And I should see a value for "Short ID" on the show page
    And I should see a value for "Registration Date" on the show page with the value of "today's date"

  Scenario: As a logged in user, I create a case with no values in the basic identity form
    Given I am logged in as an admin with username "primero" and password "primero"
    When I access "cases page"
    And I press the "Create a New Case" button
    And I press the "Photos and Audio" button
    And I attach a photo "capybara_features/resources/jorge.jpg"
    And I press "Save"
    Then I should see "Case record successfully created" on the page
    And I should see a value for "Case ID" on the show page
    And I should see a value for "Short ID" on the show page
    And I should see a value for "Registration Date" on the show page with the value of "today's date"