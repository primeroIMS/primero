#JIRA PRIMERO-270
#JIRA PRIMERO-351
#JIRA PRIMERO-331
#JIRA PRIMERO-352
#JIRA PRIMERO-363
#JIRA PRIMERO-373
#JIRA PRIMERO-365
#JIRA PRIMERO-283

@javascript @primero
Feature: Sexual Violence Form
  As a Social Worker / Data Entry Person, I want to enter information about the incident type in
  so that I can report on specific details related to the type of incident.

  Scenario: As a logged in user, I will create a incident for sexual violence
    Given I am logged in as an admin with username "primero" and password "primero"
    When I access "incidents page"
    And I press the "Create a New Incident" button
    And I press the "Violations" button
    And I press the "Sexual Violence" button
    And I fill in the following:
      | Number of survivors: boys                                                           | 1                                                        |
      | Number of survivors: girls                                                          | 2                                                        |
      | Number of survivors: unknown                                                        | 3                                                        |
      | Type of Violence                                                                    | <Choose>Forced Marriage<Choose>Forced Sterilization      |
      | Type of GBV                                                                         | <Select> Denial of Resources, Opportunities, or Services |
      | If Non-GBV, describe                                                                | describe: It is not a GBV                                |
      | Was this incident a Harmful Traditional Practice                                    | <Select> Option 1                                        |
      | Were money, goods, benefits, and/or services exchanged in relation to the incident? | <Radio> Yes                                              |
      | Stage of displacement at time of incident                                           | <Select> During Flight                                   |
      | Type of abduction at time of the incident                                           | <Select> Forced Conscription                             |
      | Has the client reported this incident anywhere else?                                | <Radio> Unknown                                          |
      | If yes, type of service provider where the survivor reported the incident           | <Select> Legal Assistance Services                       |
      | Name of the service provider                                                        | Organization 1                                           |
      | Is this a GBV reporting organization?                                               | <Radio> Yes                                              |
      | Has the client had any previous incidents of GBV perpetrated against them?          | <Radio> No                                               |
    And I press "Save"
    Then I should see "Incident record successfully created" on the page
    And I should see 1 subform on the show page for "Sexual Violence"
    And I should see in the 1st "Sexual Violence" subform with the follow:
      | Number of survivors: boys                                                           | 1                                               |
      | Number of survivors: girls                                                          | 2                                               |
      | Number of survivors: unknown                                                        | 3                                               |
      | Number of total survivors                                                           | 6                                               |
      | Type of Violence                                                                    | Forced Marriage, Forced Sterilization           |
      | Type of GBV                                                                         | Denial of Resources, Opportunities, or Services |
      | If Non-GBV, describe                                                                | describe: It is not a GBV                       |
      | Was this incident a Harmful Traditional Practice                                    | Option 1                                        |
      | Were money, goods, benefits, and/or services exchanged in relation to the incident? | Yes                                             |
      | Stage of displacement at time of incident                                           | During Flight                                   |
      | Type of abduction at time of the incident                                           | Forced Conscription                             |
      | Has the client reported this incident anywhere else?                                | Unknown                                         |
      | If yes, type of service provider where the survivor reported the incident           | Legal Assistance Services                       |
      | Name of the service provider                                                        | Organization 1                                  |
      | Is this a GBV reporting organization?                                               | Yes                                             |
      | Has the client had any previous incidents of GBV perpetrated against them?          | No                                              |