# JIRA PRIMERO-600
@javascript @primero @search
Feature: Primero View List of Incident Records By Role
  As a Product Owner, I want Incident List views to be suited to the users logging in so that each type of user will have the most 
  useful and appropriate information presented to them

  Background:
    Given the following incidents exist in the system:
      | created_by  | date_of_first_report | date_of_incident | gbv_sexual_violence_type | incident_location | unique_identifier                    |
      | primero_mrm | 03-Feb-2004          | 03-Jan-2004      |                          | Chad              | 21c4cba8-b410-4af6-b349-68c557af3aa9 |
      | primero_mrm | 03-Feb-2004          | 03-Jan-2004      |                          | Ethiopia          | 31c4cba8-b410-4af6-b349-68c557af3aa8 |
      | primero_mrm | 03-Feb-2004          | 03-Jan-2004      |                          | Kenya             | 41c4cba8-b410-4af6-b349-68c557af3aa7 |
      | primero_gbv | 03-Feb-2004          | 03-Jan-2004      |    Sexual Assault        |                   | 51c4cba8-b410-4af6-b349-68c557af3aa6 |
      | primero_gbv | 03-Feb-2004          | 03-Jan-2004      |    Physical Assault      |                   | 61c4cba8-b410-4af6-b349-68c557af3aa5 |

  Scenario: As an MRM user, I want to see my incidents 
    And I am logged in as a social worker with username "primero_mrm" and password "primero"
    When I press the "INCIDENTS" button
    Then I should see "Displaying all 3 incidents"
    And I should see an id "7af3aa9" link on the page
    And I should see a "New Incident" button on the page

  Scenario: As a GBV user, I want to see my incidents 
    And I am logged in as a social worker with username "primero_gbv" and password "primero"
    When I press the "INCIDENTS" button
    Then I should see "Displaying all 2 incidents"
    And I should see an id "7af3aa5" link on the page
    And I should see a "New Incident" button on the page

  Scenario: As an MRM manager, I want to see all cases owned by all users in my group
    And I am logged in as a manager with username "primero_mgr_mrm" and password "primero"
    When I press the "INCIDENTS" button
    Then I should see "Displaying all 3 incidents"
    And I should see an id "7af3aa9" link on the page
    And I should not see a "New Incident" button on the page

  Scenario: As a GBV manager, I want to see all cases owned by all users in my group
    And I am logged in as a manager with username "primero_mgr_gbv" and password "primero"
    When I press the "INCIDENTS" button
    Then I should see "Displaying all 2 incidents"
    And I should see an id "7af3aa5" link on the page
    And I should not see "7af3aa9" on the page
    And I should not see a "New Incident" button on the page

  Scenario: As a manager of multiple groups, I want to see all cases owned by all users in all my groups
    And I am logged in as a manager with username "primero" and password "primero"
    When I press the "INCIDENTS" button
    Then I should see "Displaying all 5 incidents"
    And I should see an id "7af3aa9" link on the page
    And I should see an id "7af3aa5" link on the page