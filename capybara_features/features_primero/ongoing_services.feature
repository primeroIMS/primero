# JIRA PRIMERO-484

@javascript @primero
Feature: Services
  As a Social Worker I want to enter information related to ongoing services provided
  so that we can verify that we are providing for the child's needs

  Scenario: As a logged in user, I should be able to create a new case and save information from the services form
    Given I am logged in as an admin with username "primero_gbv" and password "primero"
    When I access "cases page"
    And I press the "Create a New Case" button
    And I press the "Services / Follow Up" button
    And I click on "Ongoing Services" in form group "Services / Follow Up"
    And I fill in the 1st "Ongoing Services Section" subform with the follow:
      | Type of Service                            | <Select> Safehouse    |
      | Did you refer the client for this service? | <Select> Referred     |
      | Appointment Date                           | 30-May-2014           |
      | Appointment Time                           | 8                     |
      | Service Provider                           | IRC                   |
      | Service Location                           | Kenya                 |
      | Notes                                      | No notes at this time |
    And I press "Save"
    Then I should see "Case record successfully created" on the page
    And I should see in the 1st "Ongoing Services Section" subform with the follow:
      | Type of Service                            | Safehouse             |
      | Did you refer the client for this service? | Referred              |
      | Appointment Date                           | 30-May-2014           |
      | Appointment Time                           | 8                     |
      | Service Provider                           | IRC                   |
      | Service Location                           | Kenya                 |
      | Notes                                      | No notes at this time |
