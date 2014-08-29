# JIRA PRIMERO-500

@javascript @primero
Feature: Incidents Form
  As a Social GBV Worker / Data Entry Person, I want to create an incident record in Primero 
  so that I can enter supporting details about a GBV incident for reporting purposes.

  Scenario: As a logged in user, I create a new incident
    Given I am logged in as an admin with username "primero" and password "primero"
    When I access "incidents page"
    And I press the "Create a New Incident" button
    And I press the "GBV" link
    And I press the "Incident" button
    And I fill in the following:
      | Consent is given to share non-identifiable information for reporting | <Radio> Yes                        |
      | Date of Interview                                                    | 10-Aug-2014                        |
      | Date of Incident                                                     | 10-Aug-2014                        |
      | Account of Incident                                                  | Some text                          |
      | Stage of displacement at time of incident                            | <Select> During Refuge             |
      | Time of day that the Incident took place                             | <Select> Morning (sunrise to noon) |
      | Type of place where the incident took place                          | <Select> Road                      |
      | Area                                                                 | Area Name                          |
      | Sub-Area                                                             | Sub-Area Name                      |
      | Camp/Town/Site/Village                                               | Town name                          |
    And I press "Save"
    Then I should see "Incident record successfully created" on the page
    And I should see a value for "Consent is given to share non-identifiable information for reporting" on the show page with the value of "Yes"
    And I should see a value for "Date of Interview" on the show page with the value of "10-Aug-2014"
    And I should see a value for "Date of Incident" on the show page with the value of "10-Aug-2014"
    And I should see a value for "Account of Incident" on the show page with the value of "Some text"
    And I should see a value for "Stage of displacement at time of incident" on the show page with the value of "During Refuge"
    And I should see a value for "Time of day that the Incident took place" on the show page with the value of "Morning (sunrise to noon)"
    And I should see a value for "Type of place where the incident took place" on the show page with the value of "Road"
    And I should see a value for "Area" on the show page with the value of "Area Name"
    And I should see a value for "Sub-Area" on the show page with the value of "Sub-Area Name"
    And I should see a value for "Camp/Town/Site/Village" on the show page with the value of "Town name"