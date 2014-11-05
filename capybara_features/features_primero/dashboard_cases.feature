#JIRA PRIMERO-699

@javascript @primero @search
Feature: Dashboard Cases
  As a User I want to see information in the dashboard for cases

  Background:
    Given the following cases exist in the system:
      | unique_identifier                     | created_by  | name    | created_at |
      | 21c4cba8-b410-4af6-b349-68c557af1aa9  | primero_cp  | pedro   | 2014-01-01 |
      | 21c4cba8-b410-4af6-b349-68c557af2aa9  | primero_cp  |         | 2014-01-02 |
      | 21c4cba8-b410-4af6-b349-68c557af3aa9  | primero_cp  | luis    | 2014-01-03 |
      | 21c4cba8-b410-4af6-b349-68c557af4aa9  | primero_cp  | ramon   | 2014-01-04 |
      | 21c4cba8-b410-4af6-b349-68c557af5aa9  | primero_cp  | carlos  | 2014-01-05 |
      | 21c4cba8-b410-4af6-b349-68c557af6aa9  | primero_cp  | jorge   | 2014-01-06 |
      | 21c4cba8-b410-4af6-b349-68c557af7aa9  | primero     | ricardo | 2014-01-06 |
      #The following has created_at to much older to be used just in the flagging thing
      #and don't mix with the assigned cases.
      | 21c4cba8-b410-4af6-b349-68c557af8aa9  | primero     | ricardo | 2013-01-06 |
      | 21c4cba8-b410-4af6-b349-68c557af9aa9  | primero     | jose    | 2013-02-06 |
      | 21c4cba8-b410-4af6-b349-68c557af1aa8  | primero     |         | 2013-03-06 |
    And the following cases were flagged:
      | 21c4cba8-b410-4af6-b349-68c557af1aa8 |
      | 21c4cba8-b410-4af6-b349-68c557af9aa9 |
      | 21c4cba8-b410-4af6-b349-68c557af8aa9 |
    When I am logged in as an admin with username "primero_cp" and password "primero"
  
  Scenario: As a logged in CP user, I will see schedule activities on the dashboard
    Then I should see the dashboard schedules activities:
      #Date field should be autocalculate, check the step that flag the cases
      | Case ID | Name    | Activity        |
      | 7af8aa9 | ricardo | Flagged 7af8aa9 |
      | 7af9aa9 | jose    | Flagged 7af9aa9 |
      | 7af1aa8 |         | Flagged 7af1aa8 |

  Scenario: As a logged in CP user, I will see cases assigned to me on the dashboard
    Then I should see the dashboard assigned cases:
      | 7af6aa9 - jorge - 06-Jan-2014  |
      | 7af5aa9 - carlos - 05-Jan-2014 |
      | 7af4aa9 - ramon - 04-Jan-2014  |
      | 7af3aa9 - luis - 03-Jan-2014   |
      | 7af2aa9 - 02-Jan-2014          |

  Scenario: As a logged in CP user, I will see cases flagged on the dashboard
    Then I should see the dashboard flagged cases:
      | link text                       | message         |
      | 7af8aa9 - ricardo - 06-Jan-2013 | Flagged 7af8aa9 |
      | 7af9aa9 - jose - 06-Feb-2013    | Flagged 7af9aa9 |
      | 7af1aa8 - 06-Mar-2013           | Flagged 7af1aa8 |