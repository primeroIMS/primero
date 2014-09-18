# JIRA PRIMERO-599

@javascript @primero @search
Feature: Primero View List of Case Records By Role
  As a Product Owner, I want Case List views to be suited to the users logging in so that each type of user will have the most 
  useful and appropriate information presented to them

  Background:
    Given the following cases exist in the system:
      | name     | created_by   | age | sex    | registration_date | survivor_code_no | unique_identifier                    |
      | andreas  | primero_cp   | 10  | male   | 03-Feb-2014       |                  | 21c4cba8-b410-4af6-b349-68c557af3aa9 |
      | zak      | primero_cp   | 11  | female | 03-Feb-2014       |                  | 31c4cba8-b410-4af6-b349-68c557af3aa8 |
      | jaco     | primero_cp   | 12  | male   | 03-Feb-2014       |                  | 41c4cba8-b410-4af6-b349-68c557af3aa7 |
      | meredith | primero_cp   | 13  | female | 03-Feb-2014       |                  | 51c4cba8-b410-4af6-b349-68c557af3aa6 |
      | jane     | primero_cp   | 14  | male   | 03-Feb-2014       |                  | 61c4cba8-b410-4af6-b349-68c557af3aa5 |
      | kevin    | primero_cp   | 10  | male   | 03-Feb-2014       |                  | 71c4cba8-b410-4af6-b349-68c557af3aa4 |
      | vivian   | primero_cp   | 11  | female | 03-Feb-2014       |                  | 81c4cba8-b410-4af6-b349-68c557af3aa3 |
      | neb      | primero_cp   | 12  | male   | 03-Feb-2014       |                  | 91c4cba8-b410-4af6-b349-68c557af3aa2 |
      | homer    | primero_cp   | 13  | female | 03-Feb-2014       |                  | 12c4cba8-b410-4af6-b349-68c557af3aa1 |
      | peter    | primero_gbv  | 14  | male   | 03-Feb-2014       | abc123           | 22c4cba8-b410-4af6-b349-68c557af3aa0 |
      | lois     | primero_gbv  | 10  | male   | 03-Feb-2014       | def456           | 32c4cba8-b410-4af6-b349-68c557af3ab9 |
      | robert   | primero_gbv  | 11  | female | 03-Feb-2014       | ghi789           | 42c4cba8-b410-4af6-b349-68c557af3ab8 |
      | deniese  | primero_gbv  | 12  | male   | 03-Feb-2014       | jkl123           | 52c4cba8-b410-4af6-b349-68c557af3ab7 |
      | stan     | primero_gbv  | 13  | female | 03-Feb-2014       | mno456           | 62c4cba8-b410-4af6-b349-68c557af3ab6 |
      | marilyn  | primero_gbv  | 14  | male   | 03-Feb-2014       | pqr789           | 72c4cba8-b410-4af6-b349-68c557af3ab5 |

  Scenario: As a CP user, I want to see my cases 
    And I am logged in as a social worker with username "primero_cp" and password "primero"
    When I press the "CASES" button
    Then I should see "Displaying all 9 cases"
    And I should see "andreas" on the page
    And I should not see "marilyn" on the page
    And I should see a "New Case" button on the page

  Scenario: As a GBV user, I want to see my cases 
    And I am logged in as a social worker with username "primero_gbv" and password "primero"
    When I press the "CASES" button
    Then I should see "Displaying all 6 cases"
    And I should see an id "7af3ab5" link on the page
    And I should see "pqr789" on the page
    And I should not see "7af3aa9" on the page
    And I should not see "andreas" on the page
    And I should not see "marilyn" on the page
    And I should see a "New Case" button on the page
    
  Scenario: As a CP manager, I want to see all cases owned by all users in my group
    And I am logged in as a manager with username "primero_mgr_cp" and password "primero"
    When I press the "CASES" button
    Then I should see "Displaying all 9 cases"
    And I should see an id "7af3aa9" link on the page
    And I should not see "andreas" on the page
    And I should not see "marilyn" on the page
    And I should not see a "New Case" button on the page

  Scenario: As a GBV manager, I want to see all cases owned by all users in my group
    And I am logged in as a manager with username "primero_mgr_gbv" and password "primero"
    When I press the "CASES" button
    Then I should see "Displaying all 6 cases"
    And I should see an id "7af3ab5" link on the page
    And I should not see "pqr789" on the page
    And I should not see "7af3aa9" on the page
    And I should not see "andreas" on the page
    And I should not see "marilyn" on the page
    And I should not see a "New Case" button on the page

  Scenario: As a manager of multiple groups, I want to see all cases owned by all users in all my groups
    And I am logged in as a manager with username "primero" and password "primero"
    When I press the "CASES" button
    Then I should see "Displaying all 15 cases"
    And I should see an id "7af3aa9" link on the page
    And I should see an id "7af3ab5" link on the page
    And I should not see "pqr789" on the page
    And I should not see "andreas" on the page
    And I should not see "marilyn" on the page