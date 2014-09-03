#JIRA PRIMERO-270
#JIRA PRIMERO-351
#JIRA PRIMERO-331
#JIRA PRIMERO-352
#JIRA PRIMERO-363
#JIRA PRIMERO-373
#JIRA PRIMERO-365
#JIRA PRIMERO-283
#JIRA PRIMERO-505

@javascript @primero
Feature: Sexual Violence Form
  As a Social Worker / Data Entry Person, I want to enter information about the incident type in
  so that I can report on specific details related to the type of incident.

  Scenario: As a logged in user, I will create a incident for sexual violence
    Given I am logged in as an admin with username "primero_mrm" and password "primero"
    When I access "incidents page"
    And I press the "New Incident" button
    And I press the "Violations" button
    And I press the "Sexual Violence" button
    And I fill in the following:
      | Number of survivors: boys                                                           | 1                                                        |
      | Number of survivors: girls                                                          | 2                                                        |
      | Number of survivors: unknown                                                        | 3                                                        |
      | Type of Violence                                                                    | <Choose>Forced Marriage<Choose>Forced Sterilization      |
      | Stage of displacement at time of incident                                           | <Select> During Flight                                   |
      | Type of abduction at time of the incident                                           | <Select> Forced Conscription                             |
    And the value of "Number of total survivors" in the 1st "Sexual Violence" subform should be "6"
    And I press "Save"
    Then I should see "Incident record successfully created" on the page
    And I should see 1 subform on the show page for "Sexual Violence"
    And I should see in the 1st "Sexual Violence" subform with the follow:
      | Number of survivors: boys                                                           | 1                                               |
      | Number of survivors: girls                                                          | 2                                               |
      | Number of survivors: unknown                                                        | 3                                               |
      | Number of total survivors                                                           | 6                                               |
      | Type of Violence                                                                    | Forced Marriage, Forced Sterilization           |
      | Stage of displacement at time of incident                                           | During Flight                                   |
      | Type of abduction at time of the incident                                           | Forced Conscription                             |
