# JIRA PRIMERO-514

@search @javascript @primero
Feature: Cases Index Page
  The cases index page should display only "Open" cases by default

  Scenario: As a logged in user, I create a case by entering something in the survivor information form.
    The cases index page should only display Open cases by default.
    Given I am logged in as an admin with username "primero_gbv" and password "primero"
    When I access "cases page"
    And I press the "New Case" button
    And I press the "Survivor Information" button
    And I fill in the following:
      | Case Status | <Select> Transferred   |
      | Name        | Tiki Thomas Taliaferro |
    And I press "Save"
    Then I should see "Case record successfully created" on the page
    And I should see a value for "Case Status" on the show page with the value of "Transferred"
    And I access "cases page"
    And I should not see "Tiki Thomas Taliaferro"
    And I press the "New Case" button
    And I press the "Survivor Information" button
    And I fill in the following:
      | Case Status | <Select> Open    |
      | Name        | Xaro Xhoan Daxos |
    And I press "Save"
    Then I should see "Case record successfully created" on the page
    And I should see a value for "Case Status" on the show page with the value of "Open"
    And I access "cases page"
    And I should not see "Tiki Thomas Taliaferro"
    And I should see "Xaro Xhoan Daxos"
