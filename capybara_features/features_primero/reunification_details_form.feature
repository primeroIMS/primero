#JIRA PRIMERO-839

@javascript @primero
Feature: Reunification Details Form

  Scenario: Reunification Details Form
    Given I am logged in as an admin with username "primero_cp" and password "primero"
    When I access "cases page"
    And I press the "New Case" button
    And I press the "Tracing" button
    And I click on "Reunification Details" in form group "Tracing"
    And I fill in the 1st "Reunification Details Section" subform with the follow:
      | Name of adult child was reunified with               | Verma Webol |
      | Relationship of adult to child                       | Father      |
    And I fill in the 2nd "Reunification Details Section" subform with the follow:
      | Name of adult child was reunified with               | Vivian Nelson |
      | Relationship of adult to child                       | Mother        |
    And I press "Save"
    And I should see in the 1st "Reunification Details Section" subform with the follow:
      | Name of adult child was reunified with               | Verma Webol |
      | Relationship of adult to child                       | Father      |
    And I should see in the 2nd "Reunification Details Section" subform with the follow:
      | Name of adult child was reunified with               | Vivian Nelson |
      | Relationship of adult to child                       | Mother        |