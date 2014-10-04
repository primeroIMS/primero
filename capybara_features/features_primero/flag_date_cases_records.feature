# JIRA PRIMERO-490

@javascript @primero @search
Feature: Flag Date Cases Records
  As a Primero user, I want to be able to add a date to a flag so that I will know when I need to resolve the flag

  Background:
   Given I am logged in as an admin with username "primero_cp" and password "primero"
   And the following cases exist in the system:
     | name      | unique_identifier                     | flag  | flag_message    | module_id        | created_by | owned_by   |
     | Carlitos  | 21c4cba8-b410-4af6-b349-68c557af3aa9  | true  | Already Flagged | primeromodule-cp | primero_cp | primero_cp |
     | Juanito   | 21c4cba8-b410-4af6-b349-68c557bf3aa9  | false |                 | primeromodule-cp | primero_cp | primero_cp |
   When I access "cases page"

  Scenario: As a logged in user and enter to view page, I want to flag and set date to the case
   And I click the "7bf3aa9" link
   And I press the "Flags" button
   And I fill in "Flag Reason" with "Future Processing"
   And I fill in "child_flag_date" with "22-Jan-2014"
   And I press "Flag"
   And the child record history should log "Flags changed by primero_cp belonging to UNICEF"

  Scenario: As a logged in user and enter to edit page, I want to flag and set date to the case
   And I click the "7bf3aa9" link
   And I press the "Edit" button
   And I press the "Flags" button
   And I fill in "Flag Reason" with "Future Processing"
   And I fill in "child_flag_date" with "21-Jan-2014"
   And I press "Flag"
   And the child record history should log "Flags changed by primero_cp belonging to UNICEF"

  #Remove flag in the GUI will be refactoring because it allow multiple flags now
  @wip
  Scenario: As a logged in user and enter to view page, I want to remove the flag from case
   And I click the "7af3aa9" link
   And I press the "UnFlags" button
   And I fill in "Unflag Reason" with "No Processing"
   And I press "Unflag"
   And the child record history should log "Flags changed by primero_cp belonging to UNICEF"

  #Remove flag in the GUI will be refactoring because it allow multiple flags now
  @wip
  Scenario: As a logged in user and enter to edit page, I want to remove the flag from case
   And I click the "7af3aa9" link
   And I press the "Edit" button
   And I press the "UnFlags" button
   And I fill in "Unflag Reason" with "No Processing"
   And I press "Unflag"
   And I should not see "Future Processing"
