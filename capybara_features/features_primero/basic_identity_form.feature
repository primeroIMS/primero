# JIRA PRIMERO-42

@javascript @primero
Feature: Basic Identity Form

  Scenario: As a logged in user, I create a case with some values in the basic identity form
    Given I am logged in as a social worker with username "primero" and password "primero"
    When I access "cases page"
    Then I press the "Register New Child" button
    And I should see the following fields:
    | Name        |
    | Age               |
    | Sex               |
    | Registration Date |
    | Status            |
    And I fill in the following:
      | Name      | Tiki Thomas Taliaferro |
      | Age             | 22                     |
    And I select "Male" from "Sex"
    And I press "Save"
    Then I should see "Case record successfully created" on the page

  Scenario: As a logged in user, I create a case with no values in the basic identity form
    Given I am logged in as a social worker with username "primero" and password "primero"
    When I access "cases page"
    Then I press the "Register New Child" button
    And I press "Save"
    Then I should see "Case record successfully created" on the page