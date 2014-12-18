# JIRA PRIMERO-618
# JIRA PRIMERO-935

@search @javascript @primero
Feature: Filter Incidents
  The incident filters that display should depend upon the user login--MRM worker, MRM manager, GBV worker, GBV manager 

  Background:
    Given the following incidents with violations exist in the system:
      | created_by  | date_of_first_report    | date_of_incident | incident_date | status   | unique_identifier                    | violations                   | gbv_sexual_violence_type | incident_location |
      | primero_mrm | 03-Feb-2014             | 02-Dec-2013      |               | active   | 21c4cba8-b410-4af6-b349-68c557af3aa9 | killing, maiming, abduction  |                          |  Chad             |
      | primero_mrm | 03-Feb-2014             | 02-Nov-2013      |               | Inactive | 31c4cba8-b410-4af6-b349-68c557af3aa8 |                              |                          |  Ethiopia         |
      | primero_gbv | 03-Mar-2014             |                  | 02-Oct-2013   | active   | 21c4cba8-b410-4af6-b349-68c557af3aa9 |                              | Sexual Assault           |  Kenya            |
      | primero_gbv | 03-Mar-2014             |                  | 02-Sep-2013   | Inactive | 31c4cba8-b410-4af6-b349-68c557af3aa8 |                              | Physical Assault         |                   |

  Scenario: As a MRM user, I want to see filters related to my role
    And I am logged in as a social worker with username "primero_mrm" and password "primero"
    When I press the "INCIDENTS" button
    Then I should see a filter for "Flagged:"
    And I should see a filter for "Violation:"
    And I should not see a filter for "Violence Type:"
    And I should not see a filter for "Case Worker:"
    And I should see a filter for "Status:"
    And I should see a filter for "Age Range:"
    And I should see a filter for "Children:"
    And I should see a filter for "Verification Status:"
    And I should see a filter for "Incident Location:"
    And I should see a filter for "Incident Date:"
    And I should not see a filter for "Protection Status"
    And I should see a filter for "Armed Force or Group:"
    And I should see a filter for "Armed Force or Group Type:"
    And I should see a filter for "Record State:"

  Scenario: As a GBV user, I want to see filters related to my role
    And I am logged in as a social worker with username "primero_gbv" and password "primero"
    When I press the "INCIDENTS" button
    Then I should see a filter for "Flagged:"
    And I should not see a filter for "Violation:"
    And I should see a filter for "Violence Type:"
    And I should not see a filter for "Case Worker:"
    And I should see a filter for "Status:"
    And I should see a filter for "Age Range:"
    And I should not see a filter for "Children:"
    And I should not see a filter for "Verification Status:"
    And I should see a filter for "Incident Location:"
    And I should see a filter for "Incident Date:"
    And I should see a filter for "Protection Status"
    And I should not see a filter for "Armed Force or Group:"
    And I should not see a filter for "Armed Force or Group Type:"
    And I should see a filter for "Record State:"

  Scenario: As a MRM manager, I want to see filters related to my role
    And I am logged in as a manager with username "primero_mgr_mrm" and password "primero"
    When I press the "INCIDENTS" button
    Then I should see a filter for "Flagged:"
    And I should see a filter for "Violation:"
    And I should not see a filter for "Violence Type:"
    And I should see a filter for "Case Worker:"
    And I should see a filter for "Status:"
    And I should see a filter for "Age Range:"
    And I should see a filter for "Children:"
    And I should see a filter for "Verification Status:"
    And I should see a filter for "Incident Location:"
    And I should see a filter for "Incident Date:"
    And I should not see a filter for "Protection Status"
    And I should see a filter for "Armed Force or Group:"
    And I should see a filter for "Armed Force or Group Type:"
    And I should see a filter for "Record State:"

  Scenario: As a GBV manager, I want to see filters related to my role
    And I am logged in as a social worker with username "primero_mgr_gbv" and password "primero"
    When I press the "INCIDENTS" button
    Then I should see a filter for "Flagged:"
    And I should not see a filter for "Violation:"
    And I should see a filter for "Violence Type:"
    And I should see a filter for "Case Worker:"
    And I should see a filter for "Status:"
    And I should see a filter for "Age Range:"
    And I should not see a filter for "Children:"
    And I should not see a filter for "Verification Status:"
    And I should see a filter for "Incident Location:"
    And I should see a filter for "Incident Date:"
    And I should see a filter for "Protection Status"
    And I should not see a filter for "Armed Force or Group:"
    And I should not see a filter for "Armed Force or Group Type:"
    And I should see a filter for "Record State:"

  Scenario: Record State Filter
    Given the following incidents with violations exist in the system:
      | created_by  | date_of_first_report    | date_of_incident | incident_date | status   | unique_identifier                    | violations                   | gbv_sexual_violence_type | incident_location | record_state |
      | primero_mrm | 03-Feb-2014             | 02-Dec-2013      |               | active   | 21c4cba8-b410-4af6-b349-68c557af31aa | killing, maiming, abduction  |                          |  Chad             | false        |
      | primero_mrm | 03-Feb-2014             | 02-Nov-2013      |               | active   | 31c4cba8-b410-4af6-b349-68c557af32aa |                              |                          |  Ethiopia         | false        |
      | primero_gbv | 03-Mar-2014             |                  | 02-Oct-2013   | active   | 21c4cba8-b410-4af6-b349-68c557af33aa |                              | Sexual Assault           |  Kenya            | false        |
    And I am logged in as a social worker with username "primero" and password "primero"
    When I press the "INCIDENTS" button
    And I should see "Displaying all 7 incidents" on the page
    And I check the "record_state_true" field
    And I press the "Apply Filter" link
    And I should see "Displaying all 4 incidents" on the page
    When I press the "INCIDENTS" button
    And I should see "Displaying all 7 incidents" on the page
    And I check the "record_state_false" field
    And I press the "Apply Filter" link
    And I should see "Displaying all 3 incidents" on the page
    And I check the "record_state_true" field
    And I press the "Apply Filter" link
    And I should see "Displaying all 7 incidents" on the page