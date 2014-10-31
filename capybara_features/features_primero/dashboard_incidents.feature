#JIRA PRIMERO-699

@javascript @primero @search
Feature: Dashboard Incidents
  As a User I want to see information in the dashboard for incidents

  Background:
    Given the following incidents exist in the system:
      | unique_identifier                     | created_by  | status    | incident_total_tally_total | created_at |date_of_first_report|incident_location| violations                                     |
      | 21c4cba8-b410-4af6-b349-68c557af1aa9  | primero_mrm |           | 0                          | 2014-01-20 |2014-01-21          |Country 1        |                                                |
      | 21c4cba8-b410-4af6-b349-68c557bf2aa9  | primero_mrm | Duplicate | 0                          | 2014-01-22 |2014-01-23          |Country 2        |                                                |
      | 21c4cba8-b410-4af6-b349-68c557cf3aa9  | primero_mrm | Closed    | 0                          | 2014-01-23 |2014-01-24          |Country 3        |                                                |
      | 21c4cba8-b410-4af6-b349-68c557ff4aa9  | primero_mrm | Open      | 1                          | 2014-01-24 |2014-01-25          |Country 4        |maiming                                         |
      | 21c4cba8-b410-4af6-b349-68c557ff5aa9  | primero_mrm | Open      | 2                          | 2014-01-21 |2014-01-22          |Country 5        |killing:Verified, maiming                       |
      | 21c4cba8-b410-4af6-b349-68c557ff6aa9  | primero_mrm | Open      | 3                          | 2014-01-25 |2014-01-26          |Country 6        |killing:Verified, maiming:Verified, recruitment |
      | 21c4cba8-b410-4af6-b349-68c557ff7aa9  | primero_gbv | Open      | 2                          | 2014-01-25 |2014-01-26          |Country 7        |sexual_violence, abduction                      |
      #The following has no status to not appears in the open incidents and the created_at is much older to not appears in the assigned incidents.
      #Will be used for flagging thing.
      | 21c4cba8-b410-4af6-b349-68c557af8aa9  | primero_mrm |           | 0                          | 2013-01-01 |2013-01-01          |Country 1        |                                                |
      | 21c4cba8-b410-4af6-b349-68c557af9aa9  | primero_mrm |           | 0                          | 2013-02-01 |2013-02-01          |                 |                                                |
    And the following incidents were flagged:
      | 21c4cba8-b410-4af6-b349-68c557af9aa9 |
      | 21c4cba8-b410-4af6-b349-68c557af8aa9 |
    When I am logged in as an admin with username "primero_mrm" and password "primero"

  Scenario: As a logged in MRM user, I will see open incidents on the dashboard
    Then I should see the dashboard open incidents:
      | Incident ID | Number of victims | Number of violations | Violations Verified |
      | 7ff4aa9     | 1                 | 1                    | 0                   |
      | 7ff5aa9     | 2                 | 2                    | 1                   |
      | 7ff6aa9     | 3                 | 3                    | 2                   |
      | 7ff7aa9     | 2                 | 2                    | 0                   |

  Scenario: As a logged in MRM user, I will see incidents assigned to me on the dashboard
    Then I should see the dashboard assigned incidents:
      | 7ff6aa9 - Country 6 - 26-Jan-2014 |
      | 7ff4aa9 - Country 4 - 25-Jan-2014 |
      | 7cf3aa9 - Country 3 - 24-Jan-2014 |
      | 7bf2aa9 - Country 2 - 23-Jan-2014 |
      | 7ff5aa9 - Country 5 - 22-Jan-2014 |

  Scenario: As a logged in MRM user, I will see incidents flagged on the dashboard
    Then I should see the dashboard flagged incidents:
      | link text                         | message          |
      | 7af8aa9 - Country 1 - 01-Jan-2013 | Flagged 7af8aa9  |
      | 7af9aa9 - 01-Feb-2013             | Flagged 7af9aa9  |