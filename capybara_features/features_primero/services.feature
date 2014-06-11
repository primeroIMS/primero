# JIRA PRIMERO-135

@javascript @primero
Feature: Services
  As a Social Worker I want to enter information related to services provided 
  so that we can verify that we are providing for the child's needs

  Scenario: As a logged in user, I should be able to create a new case and save information from the services form
    Given I am logged in as an admin with username "primero" and password "primero"
    When I access "cases page"
    And I press the "Create a New Case" button
    And I press the "Services" button
    And I fill in the 1st "Services Section" subform with the follow:
      | Type of Service                            | <Select> Safehouse    |
      | Did you refer the client for this service? | <Select> Referred     |
      | Appointment Date                           | 30/May/2014           |
      | Appointment Time                           | 8                     |
      | Service Provider                           | IRC                   |
      | Service Location                           | Kenya                 |
      | Notes                                      | No notes at this time |
    And I press "Save"
    Then I should see "Case record successfully created" on the page
    And I press the "Services" button
    And I should see a value for "Type of Service" on the show page with the value of "Safehouse"
    And I should see a value for "Did you refer the client for this service?" on the show page with the value of "Referred"
    And I should see a value for "Appointment Date" on the show page with the value of "30/May/2014"
    And I should see a value for "Appointment Time" on the show page with the value of "8"
    And I should see a value for "Service Provider" on the show page with the value of "IRC"
    And I should see a value for "Service Location" on the show page with the value of "Kenya"
    And I should see a value for "Notes" on the show page with the value of "No notes at this time"
