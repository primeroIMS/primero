# JIRA PRIMERO-114

@javascript @primero
Feature: Tracing Subforms

  Scenario: As a logged in user, I should access the form section tracing and create nested forms
    Given I am logged in as an admin with username "primero" and password "primero"
    When I access "cases page"
    And I press the "Create a New Case" button
    And I press the "Tracing" button
    And I fill in the 1st "Tracing Actions Section" subform with the follow:
      | Date of tracing                                      | 30/May/2014               |
      | Action taken and remarks                             | Test remarks              |
      | Address/Village where the tracing action took place  | Test Village              |
      | Outcome of tracing action                            | <Select> Pending          |
      | Place of tracing                                     | <Select> Kenya            |
      | Type of action taken                                 | <Select> Photo Tracing    |
    And I fill in the 2nd "Tracing Actions Section" subform with the follow:
      | Date of tracing                                      | 30/June/2014              |
      | Action taken and remarks                             | Test remarks2             |
      | Address/Village where the tracing action took place  | Test Village2             |
      | Outcome of tracing action                            | <Select> Unsuccessful     |
      | Place of tracing                                     | <Select> Nepal            |
      | Type of action taken                                 | <Select> Mass Tracing     |
    And I press "Save"
    Then I should see "Case record successfully created" on the page
    And I press the "Tracing" button
    And I should see a value for "Place of tracing " on the show page with the value of "Kenya"
    And I should see a value for "Place of tracing " on the show page with the value of "Nepal"
    And I should see a value for "Type of action taken  " on the show page with the value of "Photo Tracing"
    And I should see a value for "Type of action taken" on the show page with the value of "Mass Tracing"