#JIRA PRIMERO-287

@javascript @primero
Feature: Recruitment Form
  I want to indicate the violation category so that I can report on all types of violations associated 
  with the incident
  Scenario: As a logged in user, I will create a incident for sexual violence
    Given I am logged in as an admin with username "primero" and password "primero"
    When I access "incidents page"
    And I press the "Create a New Incident" button
    And I press the "Recruitment" button
    And I fill in the following:
      | Number of victims: boys    | 1 |
      | Number of victims: girls   | 2 |
      | Number of victims: unknown | 3 |
      | Number of total victims    | 6 |
      | Forced vs. Voluntary       | <Radio> Forced |
      #TODO current steps don't manage double quotes in fields name.
      #| Was the recruitment primarily "Forced" (e.g. Conscription, Abduction, or the use of intimidation and threats)? | <Radio> Yes |
      | What factors contributed towards the recruitment of the child by the armed group? | <Choose>Conscription<Choose>Lack of Basic Services<Choose>Idealism |
      | Was this a case of re-recruitment (this does not necessarily have to be by the same armed group)? | <Radio> No |
      | Re-recruitment details | Some Details |
      | What role did the child play in the armed group? | <Choose>Unknown<Choose>Other |
      | Type of Recruitment/Association                  | <Select> Voluntary Enrollment |
      | Did/does the child hold a position of authority in the armed group (e.g. Commander)? | <Radio> Unknown |
      | Did the child use/own a weapon?                   | <Radio> Yes |
      | Did the child receive any military-type training? | <Radio> No |
      | Did the recruited child witness or was with other children in the group? | <Radio> Unknown |
      | Was the child a victim of any other violations?      | <Radio> Yes |
      | Were children killed/raped/injured within the group? | <Radio> No |
      | Have some or all of the children been released or left the armed group? | <Radio> Yes (Some) |
      | If Yes, how many were released or have left the armed group? | 10          |
      | If yes, when did the children leave the armed group?         | 10-Oct-1995 |
      | If the children left the armed group, how did it happen?               | <Select> Dissolution of Armed Group |
      | What factors contributed towards the children leaving the armed group? | <Select> Government Pressure        |
    And I press "Save"
    Then I should see "Incident record successfully created" on the page
    And I should see a value for "Number of victims: boys" on the show page with the value of "1"
    And I should see a value for "Number of victims: girls" on the show page with the value of "2"
    And I should see a value for "Number of victims: unknown" on the show page with the value of "3"
    And I should see a value for "Number of total victims" on the show page with the value of "6"
    And I should see a value for "Forced vs. Voluntary" on the show page with the value of "Forced"
    #TODO current steps don't manage double quotes in fields name.
    #And I should see a value for "Was the recruitment primarily "Forced" (e.g. Conscription, Abduction, or the use of intimidation and threats)?" on the show page with the value of "Yes"
    And I should see a value for "What factors contributed towards the recruitment of the child by the armed group?" on the show page with the value of "Conscription, Lack of Basic Services, Idealism"
    And I should see a value for "Was this a case of re-recruitment (this does not necessarily have to be by the same armed group)?" on the show page with the value of "No"
    And I should see a value for "Re-recruitment details" on the show page with the value of "Some Details"
    And I should see a value for "What role did the child play in the armed group?" on the show page with the value of "Unknown, Other"
    And I should see a value for "Type of Recruitment/Association" on the show page with the value of "Voluntary Enrollment"
    And I should see a value for "Did/does the child hold a position of authority in the armed group (e.g. Commander)?" on the show page with the value of "Unknown"
    And I should see a value for "Did the child use/own a weapon?" on the show page with the value of "Yes"
    And I should see a value for "Did the child receive any military-type training?" on the show page with the value of "No"
    And I should see a value for "Did the recruited child witness or was with other children in the group?" on the show page with the value of "Unknown"
    And I should see a value for "Was the child a victim of any other violations?" on the show page with the value of "Yes"
    And I should see a value for "Were children killed/raped/injured within the group?" on the show page with the value of "No"
    And I should see a value for "Have some or all of the children been released or left the armed group?" on the show page with the value of "Yes (Some)"
    And I should see a value for "If Yes, how many were released or have left the armed group?" on the show page with the value of "10"
    And I should see a value for "If yes, when did the children leave the armed group?" on the show page with the value of "10-Oct-1995"
    And I should see a value for "If the children left the armed group, how did it happen?" on the show page with the value of "Dissolution of Armed Group"
    And I should see a value for "What factors contributed towards the children leaving the armed group?" on the show page with the value of "Government Pressure"
