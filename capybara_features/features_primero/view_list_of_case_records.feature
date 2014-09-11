# JIRA PRIMERO-48
# JIRA PRIMERO-399
# JIRA PRIMERO-340
# JIRA PRIMERO-455

@javascript @primero @search
Feature: Primero View List of Case Records
  I want to be able to access the record of a registered child (or other individual) so that I can find and
  update my case records with information about my interactions with the cases in my care after registration

  Scenario: I want to see my cases and update them
    Given I am logged in as an admin with username "primero_cp" and password "primero"
    And the following cases exist in the system:
      | name     | created_by | age | sex    | registration_date       | child_status | unique_identifier              |
      | andreas  | primero_cp | 10  | male   | 03-Feb-2004             | open         | 21c4cba8-b410-4af6-b349-68c557af3aa9 |
      | zak      | primero_cp | 11  | female | 03-Feb-2004             | closed       | 31c4cba8-b410-4af6-b349-68c557af3aa8 |
      | jaco     | primero_cp | 12  | male   | 03-Feb-2004             | open         | 41c4cba8-b410-4af6-b349-68c557af3aa7 |
      | meredith | primero_cp | 13  | female | 03-Feb-2004             | closed       | 51c4cba8-b410-4af6-b349-68c557af3aa6 |
      | jane     | primero_cp | 14  | male   | 03-Feb-2004             | open         | 61c4cba8-b410-4af6-b349-68c557af3aa5 |
    When I press the "CASES" button
    And I should see "Displaying all 5 cases"
    And I should see an id "7af3aa9" link on the page
    And I press the "7af3aa9" link
    And I should see "Case ID #7af3aa9"
    And I should see an "Edit" button on the page
    And I press the "Edit" button
    And I should see the "basic_identity_child_name" field
    And I should see a "Save" button on the page

  Scenario: List of cases should display the status
    Given I am logged in as an admin with username "primero" and password "primero"
    And the following cases exist in the system:
      | name     | created_by | age | sex    | registration_date       | child_status | unique_identifier                    |
      | andreas  | primero    | 10  | male   | 03-Feb-2004             | open   | 21c4cba8-b410-4af6-b349-68c557af3aa9 |

    When I press the "CASES" button
    And I should see "open" on the page

  Scenario: I want to see my cases but I do not have any
    Given I am logged in as an admin with username "primero" and password "primero"
    When I press the "CASES" button
    And I should see "No entries found"

  Scenario: Pagination links are available for more than 20 records
    Given I am logged in as an admin with username "primero" and password "primero"
    And the following cases exist in the system:
      | name     | created_by | age | sex    | registration_date       | child_status |
      | andreas  | primero    | 10  | male   | 03-Feb-2004             | open   |
      | zak      | primero    | 11  | female | 03-Feb-2004             | closed |
      | jaco     | primero    | 12  | male   | 03-Feb-2004             | open   |
      | meredith | primero    | 13  | female | 03-Feb-2004             | closed |
      | josh     | primero    | 14  | male   | 03-Feb-2004             | open   |
      | kim      | primero    | 10  | male   | 03-Feb-2004             | open   |
      | cody     | primero    | 11  | female | 03-Feb-2004             | closed |
      | paco     | primero    | 12  | male   | 03-Feb-2004             | open   |
      | jeremy   | primero    | 13  | female | 03-Feb-2004             | closed |
      | ben      | primero    | 14  | male   | 03-Feb-2004             | open   |
      | ron      | primero    | 10  | male   | 03-Feb-2004             | open   |
      | eli      | primero    | 11  | female | 03-Feb-2004             | closed |
      | ian      | primero    | 12  | male   | 03-Feb-2004             | open   |
      | brandon  | primero    | 13  | female | 03-Feb-2004             | closed |
      | eugene   | primero    | 14  | male   | 03-Feb-2004             | open   |
      | kevin    | primero    | 10  | male   | 03-Feb-2004             | open   |
      | vivian   | primero    | 11  | female | 03-Feb-2004             | closed |
      | neb      | primero    | 12  | male   | 03-Feb-2004             | open   |
      | homer    | primero    | 13  | female | 03-Feb-2004             | closed |
      | peter    | primero    | 14  | male   | 03-Feb-2004             | open   |
      | lois     | primero    | 10  | male   | 03-Feb-2004             | open   |
      | robert   | primero    | 11  | female | 03-Feb-2004             | closed |
      | deniese  | primero    | 12  | male   | 03-Feb-2004             | open   |
      | stan     | primero    | 13  | female | 03-Feb-2004             | closed |
      | marilyn  | primero    | 14  | male   | 03-Feb-2004             | open   |
    When I press the "CASES" button
    And I should see "Displaying cases 1 - 20 of 25 in total"
    And I click text ">"
    And I should see "jaco" on the page
    And I click text "<"
    And I should see "homer" on the page
    And I visit cases page "2"
    And I should see "andreas" on the page
