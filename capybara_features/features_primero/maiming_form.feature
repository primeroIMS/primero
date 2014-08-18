#JIRA PRIMERO-286
#JIRA PRIMERO-323
#JIRA PRIMERO-352
#JIRA PRIMERO-363
#JIRA PRIMERO-373
#JIRA PRIMERO-365
#JIRA PRIMERO-283

@javascript @primero
Feature: Maiming Form
  As a Social Worker / Data Entry Person, I want to indicate the violation category
  so that I can report on all types of violations associated with the incident

  Scenario: As a logged in user, I will create a incident for maiming information
    Given I am logged in as an admin with username "primero" and password "primero"
    When I access "incidents page"
    And I press the "Create a New Incident" button
    And I press the "Violations" button
    And I press the "Maiming" button
    And I fill in the following:
      | Number of survivors: boys    | 1 |
      | Number of survivors: girls   | 2 |
      | Number of survivors: unknown | 3 |
      | Method                    | <Select> Non-Victim Activated          |
      | Cause                     | <Select> Landmines                     |
      | Details                   | Maiming Details                        |
      | Circumstances             | <Select> Indiscriminate Attack         |
      | Consequences              | <Select> Serious Injury                |
      | Context                   | <Select> Weapon Used Against The Child |
      | Mine Incident             | <Radio> Yes                            |
      | Was the survivor directly participating in hostilities at the time of the violation? | <Radio> No      |
      | Did the violation occur during or as a direct result of abduction?                   | <Radio> Unknown |
    And I press "Save"
    Then I should see "Incident record successfully created" on the page
    And I should see 1 subform on the show page for "Maiming Subform Section"
    And I should see in the 1st "Maiming Subform Section" subform with the follow:
      | Number of survivors: boys                                                                   | 1                              |
      | Number of survivors: girls                                                                  | 2                              |
      | Number of survivors: unknown                                                                | 3                              |
      | Number of total survivors                                                                   | 6                              |
      | Method                                                                                      | Non-Victim Activated           |
      | Cause                                                                                       | Landmines                      |
      | Details                                                                                     | Maiming Details                |
      | Circumstances                                                                               | Indiscriminate Attack          |
      | Consequences                                                                                | Serious Injury                 |
      | Context                                                                                     | Weapon Used Against The Child  |
      | Mine Incident                                                                               | Yes                            |
      | Was the survivor directly participating in hostilities at the time of the violation?        | No                             |
      | Did the violation occur during or as a direct result of abduction?                          | Unknown                        |