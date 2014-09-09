# JIRA PRIMERO-490

@javascript @primero @search
Feature: Flag Date Tracing Requests Records
  As a Primero user, I want to be able to add a date to a flag so that I will know when I need to resolve the flag

  Background:
   Given I am logged in as an admin with username "primero_cp" and password "primero"
   And the following tracing request exist in the system:
     | unique_identifier                     | flag  | flag_message    | module_id        | created_by | owned_by   |
     | 21c4cba8-b410-4af6-b349-68c559af3aa9  | true  | Already Flagged | primeromodule-cp | primero_cp | primero_cp |
     | 21c4cba8-b410-4af6-b349-68c559bf3aa9  | false |                 | primeromodule-cp | primero_cp | primero_cp |
   When I access "tracing requests page"

  Scenario: As a logged in user and enter to view page, I want to flag and set date to the tracing request
   And I click the "9bf3aa9" link
   And I press the "Flag Record" button
   And I fill in "Flag Reason" with "Future Processing"
   And I fill in "tracing_request_flag_date" with "22-Jan-2014"
   And I press "Flag"
   Then I should see "Flagged by primero_cp"
   And I should see "Future Processing"

  Scenario: As a logged in user and enter to edit page, I want to flag and set date to the tracing request
   And I click the "9bf3aa9" link
   And I press the "Edit" button
   And I press the "Flag Record" button
   And I fill in "Flag Reason" with "Future Processing"
   And I fill in "tracing_request_flag_date" with "21-Jan-2014"
   And I press "Flag"
   Then I should see "Flagged by primero_cp"
   And I should see "Future Processing"

  Scenario: As a logged in user and enter to view page, I want to remove the flag from tracing request
   And I click the "9af3aa9" link
   And I press the "Unflag Record" button
   And I fill in "Unflag Reason" with "No Processing"
   And I press "Unflag"
   Then I should not see "Flagged by primero_cp"
   And I should not see "Future Processing"

  Scenario: As a logged in user and enter to edit page, I want to remove the flag from tracing request
   And I click the "9af3aa9" link
   And I press the "Edit" button
   And I press the "Unflag Record" button
   And I fill in "Unflag Reason" with "No Processing"
   And I press "Unflag"
   Then I should not see "Flagged by primero_cp"
   And I should not see "Future Processing"
   