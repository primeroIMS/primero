# JIRA PRIMERO-617
# JIRA PRIMERO-625

@search @javascript @primero
Feature: Filter Cases
  The case filters that display should depend upon the user login--CP worker, CP manager, GBV worker, GBV manager

  Background:
    Given the following cases exist in the system:
      | name     | created_by   | age | sex    | registration_date | survivor_code_no | unique_identifier                    |
      | andreas  | primero_cp   | 10  | male   | 03-Feb-2014       |                  | 21c4cba8-b410-4af6-b349-68c557af3aa9 |
      | marilyn  | primero_gbv  | 14  | female | 03-Feb-2014       | pqr789           | 72c4cba8-b410-4af6-b349-68c557af3ab5 |

  Scenario: As a CP user, I want to see filters related to my role
    And I am logged in as a social worker with username "primero_cp" and password "primero"
    When I press the "CASES" button
    Then I should see a filter for "Flagged:"
    And I should not see a filter for "Field/Case/Social Worker:"
    And I should see a filter for "Status:"
    And I should see a filter for "Age Range:"
    And I should see a filter for "Sex:"
    And I should see a filter for "Protection Status:"
    And I should see a filter for "Urgent Protection Concern:"
    And I should see a filter for "Risk Level:"
    And I should see a filter for "Current Location"
    And I should see a filter for "Registration Date:"
    And I should see a filter for "Record State:"

  Scenario: As a GBV user, I want to see filters related to my role
    And I am logged in as a social worker with username "primero_gbv" and password "primero"
    When I press the "CASES" button
    Then I should see a filter for "Flagged:"
    And I should not see a filter for "Field/Case/Social Worker:"
    And I should see a filter for "Status:"
    And I should see a filter for "Age Range:"
    And I should see a filter for "Sex:"
    And I should see a filter for "Displacement Status:"
    And I should see a filter for "Protection Status:"
    And I should not see a filter for "Urgent Protection Concern:"
    And I should not see a filter for "Risk Level:"
    And I should not see a filter for "Current Location"
    And I should not see a filter for "Registration Date:"
    And I should see a filter for "Case Open Date:"
    And I should see a filter for "Record State:"

  Scenario: As a CP manager, I want to see filters related to my role
    And I am logged in as a manager with username "primero_mgr_cp" and password "primero"
    When I press the "CASES" button
    Then I should see a filter for "Flagged:"
    And I should see a filter for "Field/Case/Social Worker:"
    And I should see a filter for "Status:"
    And I should see a filter for "Age Range:"
    And I should see a filter for "Sex:"
    And I should see a filter for "Protection Status:"
    And I should see a filter for "Urgent Protection Concern:"
    And I should see a filter for "Risk Level:"
    And I should see a filter for "Current Location"
    And I should see a filter for "Registration Date:"
    And I should see a filter for "Record State:"

  Scenario: As a GBV manager, I want to see filters related to my role
    And I am logged in as a social worker with username "primero_mgr_gbv" and password "primero"
    When I press the "CASES" button
    Then I should see a filter for "Flagged:"
    And I should see a filter for "Field/Case/Social Worker:"
    And I should see a filter for "Status:"
    And I should see a filter for "Age Range:"
    And I should see a filter for "Sex:"
    And I should see a filter for "Displacement Status:"
    And I should see a filter for "Protection Status:"
    And I should not see a filter for "Urgent Protection Concern:"
    And I should not see a filter for "Risk Level:"
    And I should not see a filter for "Current Location"
    And I should not see a filter for "Registration Date:"
    And I should see a filter for "Case Open Date:"
    And I should see a filter for "Record State:"

Scenario: As a CP user, I want to filter cases with photos
    And I am logged in as a social worker with username "primero_cp" and password "primero"
    When I press the "CASES" button
    And I press the "New Case" button
    And I fill in the following:
      | Name                                     | Tiki Thomas Taliaferro             |
    And I press "Save"
    And I should see "Case record successfully created" on the page
    And I press the "CASES" button
    And I should see "andreas" on the page
    And I should see "Tiki Thomas Taliaferro" on the page
    And I should see a filter for "Photo:"
    And I check the "Has Photo?" field
    And I press the "Apply Filter" link
    And I should see "andreas" on the page
    And I should not see "Tiki Thomas Taliaferro" on the page