# JIRA PRIMERO-135
# JIRA PRIMERO-226
# JIRA PRIMERO-255
# JIRA PRIMERO-353
# JIRA PRIMERO-363
# JIRA PRIMERO-365
# JIRA PRIMERO-478
# JIRA PRIMERO-736

@javascript @primero
Feature: Services
  As a Social Worker I want to enter information related to services provided
  so that we can verify that we are providing for the child's needs

  Scenario: As a logged in user, I should be able to create a new case and save information from the services form
    Given I am logged in as an admin with username "primero_cp" and password "primero"
    When I access "cases page"
    And I press the "New Case" button
    And I press the "Services / Follow Up" button
    And I click on "Services" in form group "Services / Follow Up"
    And I fill in the 1st "Services Section" subform with the follow:
      | Type of Service                            | <Select> Safehouse    |
      | Did you refer the client for this service? | <Select> Referred     |
      | Appointment Date                           | 30-May-2014           |
      | Appointment Time                           | 8                     |
      | Service Provider                           | IRC                   |
      | Service Location                           | Kenya                 |
      | Notes                                      | No notes at this time |
    And I press "Save"
    Then I should see a success message for new Case
    And I should see in the 1st "Services Section" subform with the follow:
      | Type of Service                            | Safehouse             |
      | Did you refer the client for this service? | Referred              |
      | Appointment Date                           | 30-May-2014           |
      | Appointment Time                           | 8                     |
      | Service Provider                           | IRC                   |
      | Service Location                           | Kenya                 |
      | Notes                                      | No notes at this time |
