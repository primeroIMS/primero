# JIRA PRIMERO-788

@search @javascript @primero
Feature: Filter Tracing Request

Scenario: I should be able to apply filters
    Given the following tracing request exist in the system:
      | name     | created_by   | inquiry_date | unique_identifier                    | inquiry_status |
      | Rob      | primero_cp   | 03-Jan-2014  | 21c4cba8-b410-4af6-b349-68c557af4aa9 | Open           |
      | John     | primero_cp   | 03-Feb-2014  | 21c4cba8-b410-4af6-b349-68c557af5aa9 | Open           |
      | Theon    | primero_cp   | 03-Mar-2014  | 21c4cba8-b410-4af6-b349-68c557af6aa9 | Open           |
      | Sansa    | primero_cp   | 03-Apr-2014  | 21c4cba8-b410-4af6-b349-68c557af7aa9 | Open           |
      | Arya     | primero_cp   | 03-May-2014  | 21c4cba8-b410-4af6-b349-68c557af8aa9 | Open           |
      | Bran     | primero_cp   | 03-Jun-2014  | 21c4cba8-b410-4af6-b349-68c557af9aa9 | Open           |
      | Rickon   | primero_cp   | 03-Jul-2014  | 21c4cba8-b410-4af6-b349-68c557af10a9 | Open           |
    And I am logged in as a social worker with username "primero_cp" and password "primero"
    When I press the "TRACING REQUESTS" button
    # No filter applied, Should display all 7 tracing requests
    And I should see "Displaying all 7 Tracing request" on the page
    And I check the "7af5aa9" field
    And I check the "7af6aa9" field
    And I check the "7af7aa9" field
    # Flag 3 tracing requests
    And I press the "Flag" span
    And I fill in "Flag Reason" with "Some reason"
    And I fill in "Date (optional)" with "today's date"
    And I click on the link with text "Flag"
    And the record for "7af5aa9" should display a "flag" icon beside it
    And the record for "7af6aa9" should display a "flag" icon beside it
    And the record for "7af7aa9" should display a "flag" icon beside it
    # Filter by flagged tracing requests, should display only 3 tracing requests
    And I check the "flag_flag" field
    And I press the "Apply Filter" link
    And I should see "Displaying all 3 Tracing request" on the page
    And I should see "7af5aa9" on the page
    And I should see "7af6aa9" on the page
    And I should see "7af7aa9" on the page
    And I should not see "7af4aa9" on the page
    And I should not see "7af8aa9" on the page
    And I should not see "7af9aa9" on the page
    And I should not see "7af10a9" on the page
    And the following tracing request exist in the system:
      | name     | created_by   | inquiry_date | unique_identifier                    | inquiry_status | record_state |
      | Rhaegar  | primero_cp   | 03-Jan-2014  | 21c4cba8-b410-4af6-b349-68c557af11a9 | Closed         | false        |
      | Viserys  | primero_cp   | 03-Feb-2014  | 21c4cba8-b410-4af6-b349-68c557af12a9 | Closed         | false        |
      | Daenerys | primero_cp   | 03-Mar-2014  | 21c4cba8-b410-4af6-b349-68c557af13a9 | Closed         | false        |
    # Clear filters, must display the same 7 tracing requests, should apply Valid tracing requests filter by default.
    Then I press the "TRACING REQUESTS" button
    And I should see "Displaying all 7 Tracing request" on the page
    And I should not see "7af11a9" on the page
    And I should not see "7af12a9" on the page
    And I should not see "7af13a9" on the page
    And I fill in "inquiry_date_from" with "01-Jan-2014"
    And I fill in "inquiry_date_to" with "28-Feb-2014"
    And I press the "Apply Filter" link
    And I should see "Displaying all 2 Tracing request" on the page
    And I should see "7af4aa9" on the page
    And I should see "7af5aa9" on the page
    And I should not see "7af6aa9" on the page
    And I should not see "7af7aa9" on the page
    And I should not see "7af8aa9" on the page
    And I should not see "7af9aa9" on the page
    And I should not see "7af10a9" on the page