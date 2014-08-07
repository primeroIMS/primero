#JIRA PRIMERO-287
#JIRA PRIMERO-330
#JIRA PRIMERO-352
#JIRA PRIMERO-363
#JIRA PRIMERO-373
#JIRA PRIMERO-365

@javascript @primero
Feature: Recruitment Form
  I want to indicate the violation category so that I can report on all types of violations associated 
  with the incident
  Scenario: As a logged in user, I will create a incident for sexual violence
    Given I am logged in as an admin with username "primero" and password "primero"
    When I access "incidents page"
    And I press the "Create a New Incident" button
    And I press the "Violations" button
    And I press the "Recruitment" button
    And I fill in the following:
      | Number of survivors: boys    | 1 |
      | Number of survivors: girls   | 2 |
      | Number of survivors: unknown | 3 |
      | Number of total survivors    | 6 |
      | Forced vs. Voluntary         | <Radio> Forced |
      | Was the recruitment primarily "Forced" (e.g. Conscription, Abduction, or the use of intimidation and threats)? | <Radio> Yes |
      | What factors contributed towards the recruitment of the child by the armed group? | <Choose>Conscription<Choose>Lack of Basic Services<Choose>Idealism |
      | Was this a case of re-recruitment (this does not necessarily have to be by the same armed group)? | <Radio> No |
      | Re-recruitment details | Some Details |
      | What role did the child play in the armed group? | <Choose>Unknown<Choose>Other |
      | Type of Recruitment/Association                  | <Select> Voluntary Enrollment |
      | Did/does the child hold a position of authority in the armed group (e.g. Commander)? | <Radio> Unknown |
      | Did the child use/own a weapon?                   | <Radio> Yes |
      | Did the child receive any military-type training? | <Radio> No |
      | Did the recruited child witness or was with other children in the group? | <Radio> Unknown |
      | Was the child involved in any other violations?      | <Radio> Yes |
      | Were children killed/raped/injured within the group? | <Radio> No |
      | Have some or all of the children been released or left the armed group? | <Radio> Yes (Some) |
      | If Yes, how many were released or have left the armed group? | 10          |
      | If yes, when did the children leave the armed group?         | 10-Oct-1995 |
      | If the children left the armed group, how did it happen?               | <Select> Dissolution of Armed Group |
      | What factors contributed towards the children leaving the armed group? | <Select> Government Pressure        |
    And I press "Save"
    Then I should see "Incident record successfully created" on the page
    And I should see 1 subform on the show page for "Recruitment"
    And I should see in the 1st "Recruitment" subform with the follow:
      | Number of survivors: boys                                                                                      | 1                                              |
      | Number of survivors: girls                                                                                     | 2                                              |
      | Number of survivors: unknown                                                                                   | 3                                              |
      | Number of total survivors                                                                                      | 6                                              |
      | Forced vs. Voluntary                                                                                           | Forced                                         |
      | Was the recruitment primarily "Forced" (e.g. Conscription, Abduction, or the use of intimidation and threats)? | Yes                                            |
      | What factors contributed towards the recruitment of the child by the armed group?                              | Conscription, Lack of Basic Services, Idealism |
      | Was this a case of re-recruitment (this does not necessarily have to be by the same armed group)?              | No                                             |
      | Re-recruitment details                                                                                         | Some Details                                   |
      | What role did the child play in the armed group?                                                               | Unknown, Other                                 |
      | Type of Recruitment/Association                                                                                | Voluntary Enrollment                           |
      | Did/does the child hold a position of authority in the armed group (e.g. Commander)?                           | Unknown                                        |
      | Did the child use/own a weapon?                                                                                | Yes                                            |
      | Did the child receive any military-type training?                                                              | No                                             |
      | Did the recruited child witness or was with other children in the group?                                       | Unknown                                        |
      | Was the child involved in any other violations?                                                                | Yes                                            |
      | Were children killed/raped/injured within the group?                                                           | No                                             |
      | Have some or all of the children been released or left the armed group?                                        | Yes (Some)                                     |
      | If Yes, how many were released or have left the armed group?                                                   | 10                                             |
      | If yes, when did the children leave the armed group?                                                           | 10-Oct-1995                                    |
      | If the children left the armed group, how did it happen?                                                       | Dissolution of Armed Group                     |
      | What factors contributed towards the children leaving the armed group?                                         | Government Pressure                            |