# JIRA PRIMERO-617
# JIRA PRIMERO-625
# JIRA PRIMERO-736
# JIRA PRIMERO-891
# JIRA PRIMERO-864

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
    And I should see a filter for "Current Location:"
    And I should see a filter for "Registration Date:"
    And I should see a filter for "Record State:"
    And I should see a filter for "Photo:"

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
    And I should not see a filter for "Current Location:"
    And I should not see a filter for "Registration Date:"
    And I should see a filter for "Case Open Date:"
    And I should see a filter for "Record State:"
    And I should not see a filter for "Photo:"

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
    And I should see a filter for "Current Location:"
    And I should see a filter for "Registration Date:"
    And I should see a filter for "Record State:"
    And I should see a filter for "Photo:"

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
    And I should not see a filter for "Current Location:"
    And I should not see a filter for "Registration Date:"
    And I should see a filter for "Case Open Date:"
    And I should see a filter for "Record State:"
    And I should not see a filter for "Photo:"

Scenario: As a CP user, I want to filter cases with photos
    And I am logged in as a social worker with username "primero_cp" and password "primero"
    When I press the "CASES" button
    And I press the "New Case" button
    And I fill in the following:
      | Name                                     | Tiki Thomas Taliaferro             |
    And I press "Save"
    And I should see a success message for new Case
    And I press the "CASES" button
    And I should see "andreas" on the page
    And I should see "Tiki Thomas Taliaferro" on the page
    And I should see a filter for "Photo:"
    And I check the "Has Photo?" field
    And I press the "Apply Filter" link
    And I should see "andreas" on the page
    And I should not see "Tiki Thomas Taliaferro" on the page

  Scenario: I should be able to apply filters
    Given the following cases exist in the system:
      | name     | created_by   | age | sex    | registration_date | unique_identifier                    |
      | Rob      | primero_cp   | 14  | male   | 03-Jan-2014       | 21c4cba8-b410-4af6-b349-68c557af4aa9 |
      | John     | primero_cp   | 14  | male   | 03-Feb-2014       | 21c4cba8-b410-4af6-b349-68c557af5aa9 |
      | Theon    | primero_cp   | 14  | male   | 03-Mar-2014       | 21c4cba8-b410-4af6-b349-68c557af6aa9 |
      | Sansa    | primero_cp   | 10  | female | 03-Apr-2014       | 21c4cba8-b410-4af6-b349-68c557af7aa9 |
      | Arya     | primero_cp   | 8   | female | 03-May-2014       | 21c4cba8-b410-4af6-b349-68c557af8aa9 |
      | Bran     | primero_cp   | 5   | female | 03-Jun-2014       | 21c4cba8-b410-4af6-b349-68c557af9aa9 |
      | Rickon   | primero_cp   | 3   | male   | 03-Jul-2014       | 21c4cba8-b410-4af6-b349-68c557af10a9 |
    And I am logged in as a social worker with username "primero_cp" and password "primero"
    When I press the "CASES" button
    # No filter applied, Should display all 8 cases
    And I should see "Displaying all 8 cases" on the page
    And I check the "7af5aa9" field
    And I check the "7af6aa9" field
    And I check the "7af7aa9" field
    # Flag 3 cases
    And I press the "Flag" span
    And I fill in "Flag Reason" with "Some reason"
    And I fill in "Date (optional)" with "today's date"
    And I click on the link with text "Flag"
    And the record for "7af5aa9" should display a "flag" icon beside it
    And the record for "7af6aa9" should display a "flag" icon beside it
    And the record for "7af7aa9" should display a "flag" icon beside it
    # Filter by flagged cases, should display only 3 cases
    And I check the "flag_flag" field
    And I press the "Apply Filter" link
    And I should see "Displaying all 3 cases" on the page
    And I should see "John" on the page
    And I should see "Theon" on the page
    And I should see "Sansa" on the page
    And I should not see "Rob" on the page
    And I should not see "Arya" on the page
    And I should not see "Bran" on the page
    And I should not see "Rickon" on the page
    # Filter by flagged cases and by sex. Sould display only 1 case
    And I check the "sex_Female" field
    And I press the "Apply Filter" link
    And I should see "Displaying 1 case" on the page
    And I should not see "John" on the page
    And I should not see "Theon" on the page
    And I should see "Sansa" on the page
    # Clear filters
    Then I press the "CASES" button
    # Filter by age
    And I check the "age_0-5" field
    And I press the "Apply Filter" link
    And I should see "Displaying all 2 cases" on the page
    And I should not see "Rob" on the page
    And I should not see "John" on the page
    And I should not see "Theon" on the page
    And I should not see "Sansa" on the page
    And I should not see "Arya" on the page
    And I should see "Bran" on the page
    And I should see "Rickon" on the page
    And the following cases exist in the system:
      | name     | created_by   | age | sex    | registration_date | unique_identifier                    | child_status |
      | Rhaegar  | primero_cp   | 18  | male   | 03-Jan-2014       | 21c4cba8-b410-4af6-b349-68c557af11a9 | Closed       |
      | Viserys  | primero_cp   | 16  | male   | 03-Feb-2014       | 21c4cba8-b410-4af6-b349-68c557af12a9 | Transferred  |
      | Daenerys | primero_cp   | 13  | male   | 03-Mar-2014       | 21c4cba8-b410-4af6-b349-68c557af13a9 | Duplicate    |
    # Clear filters, must display the same 8 cases, should apply Open Cases filter by default.
    Then I press the "CASES" button
    And I should see "Displaying all 8 cases" on the page
    And I should not see "Rhaegar" on the page
    And I should not see "Viserys" on the page
    And I should not see "Daenerys" on the page
    And I fill in "registration_date_from" with "01-Jan-2014"
    And I fill in "registration_date_to" with "28-Feb-2014"
    And I press the "Apply Filter" link
    And I should see "Displaying all 3 cases" on the page
    And I should see "Rob" on the page
    And I should see "John" on the page
    And I should not see "Theon" on the page
    And I should not see "Sansa" on the page
    And I should not see "Arya" on the page
    And I should not see "Bran" on the page
    And I should not see "Rickon" on the page

  Scenario: Location Filters
    # And the following lookups exist in the system:
    #   | name                           | lookup_values                                                    |
    #   | location                        | Country1, Country2                                               |
    And the following location country exist in the system:
      | placename  |
      | Kenya      |
      | Nepal      |
      | Uganda     |

    Given the following cases exist in the system:
      | name     | created_by   | age | sex    | registration_date | unique_identifier                    | location_current |
      | Rob      | primero_cp   | 14  | male   | 03-Jan-2014       | 21c4cba8-b410-4af6-b349-68c557af4aa9 | Kenya            |
      | John     | primero_cp   | 14  | male   | 03-Feb-2014       | 21c4cba8-b410-4af6-b349-68c557af5aa9 | Kenya            |
      | Theon    | primero_cp   | 14  | male   | 03-Mar-2014       | 21c4cba8-b410-4af6-b349-68c557af6aa9 | Nepal            |
      | Sansa    | primero_cp   | 10  | female | 03-Apr-2014       | 21c4cba8-b410-4af6-b349-68c557af7aa9 | Nepal            |
      | Arya     | primero_cp   | 8   | female | 03-May-2014       | 21c4cba8-b410-4af6-b349-68c557af8aa9 | Uganda           |
      | Bran     | primero_cp   | 5   | female | 03-Jun-2014       | 21c4cba8-b410-4af6-b349-68c557af9aa9 | Uganda           |
      | Rickon   | primero_cp   | 3   | male   | 03-Jul-2014       | 21c4cba8-b410-4af6-b349-68c557af10a9 | Uganda           |
    And I am logged in as a social worker with username "primero_cp" and password "primero"
    When I press the "CASES" button
    And I should see "Displaying all 8 cases" on the page
    And I select "Kenya" from location filter
    And I press the "Apply Filter" link
    And I should see "Displaying all 2 cases" on the page
    And I should see "Rob" on the page
    And I should see "John" on the page
    And I select "Nepal" from location filter
    And I press the "Apply Filter" link
    And I should see "Displaying all 2 cases" on the page
    And I should see "Theon" on the page
    And I should see "Sansa" on the page
    And I select "Uganda" from location filter
    And I press the "Apply Filter" link
    And I should see "Displaying all 3 cases" on the page
    And I should see "Arya" on the page
    And I should see "Bran" on the page
    And I should see "Rickon" on the page