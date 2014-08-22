#JIRA PRIMERO-315

@javascript @primero @search
Feature: Lookup Violations
  As a User I want to be able to associate different entities with one or more violations when editing an incident

  Background:
    Given I am logged in as an admin with username "primero" and password "primero"
    And the following incidents with violations exist in the system:
      | created_by  | date_of_first_report    | status   | unique_identifier                    | violations                   |
      | primero     | 03-Feb-2004             | active   | 21c4cba8-b410-4af6-b349-68c557af3aa9 | killing, maiming, abduction  |
      | primero     | 03-Feb-2004             | Inactive | 31c4cba8-b410-4af6-b349-68c557af3aa8 |                              |
    When I access "incidents page"

  Scenario: As a logged in user, if the current incident has no violations, the violations select should be empty
    And I press the "7af3aa8" link
    And I press the "Edit" button
    And I press the "Individual Details" button
    And I add a "Individual Details Subform Section" subform
    Then the "Violations" select box should have the following options:
      | label                     | selected? |
      | NONE                      | no        |
    And I press the "Group Details" button
    And I add a "Group Details Section" subform
    Then the "Violations" select box in the 1st "Group Details Section" subform should have the following options:
      | label                     | selected? |
      | NONE                      | no        |
    And I press the "Source" button
    And I add a "Source Subform Section" subform
    Then the "Violations" select box in the 1st "Source Subform Section" subform should have the following options:
      | label                     | selected? |
      | NONE                      | no        |
    And I press the "Perpetrator" button
    And I add a "Perpetrator Subform Section" subform
    Then the "Violations" select box in the 1st "Perpetrator Subform Section" subform should have the following options:
      | label                     | selected? |
      | NONE                      | no        |
    And I press the "Intervention" button
    Then the "Violations" select box should have the following options:
      | label                     | selected? |
      | NONE                      | no        |
      
  Scenario: As a logged in user, if the current incident has multiple violations, the violations select should contain those violations
    And I press the "7af3aa9" link
    And I press the "Edit" button
    And I press the "Individual Details" button
    And I add a "Individual Details Subform Section" subform
    Then the "Violations" select box should have the following options:
      | label                     | selected? |
      | Killing 0                 | no        |
      | Maiming 0                 | no        |
      | Abduction 0               | no        |
    And I press the "Group Details" button
    And I add a "Group Details Section" subform
    Then the "Violations" select box in the 1st "Group Details Section" subform should have the following options:
      | label                     | selected? |
      | Killing 0                 | no        |
      | Maiming 0                 | no        |
      | Abduction 0               | no        |
    And I press the "Source" button
    And I add a "Source Subform Section" subform
    Then the "Violations" select box in the 1st "Source Subform Section" subform should have the following options:
      | label                     | selected? |
      | Killing 0                 | no        |
      | Maiming 0                 | no        |
      | Abduction 0               | no        |
    And I press the "Perpetrator" button
    And I add a "Perpetrator Subform Section" subform
    Then the "Violations" select box in the 1st "Perpetrator Subform Section" subform should have the following options:
      | label                     | selected? |
      | Killing 0                 | no        |
      | Maiming 0                 | no        |
      | Abduction 0               | no        |
    And I press the "Intervention" button
    Then the "Violations" select box should have the following options:
      | label                     | selected? |
      | Killing 0                 | no        |
      | Maiming 0                 | no        |
      | Abduction 0               | no        |