#JIRA PRIMERO-302
#JIRA PRIMERO-329
#JIRA PRIMERO-352
#JIRA PRIMERO-363
#JIRA PRIMERO-373
#JIRA PRIMERO-365
#JIRA PRIMERO-283
#JIRA PRIMERO-526

@javascript @primero
Feature: Other Violation Form
  As a User, I want to be able to select a 'cause' for violation types
  so that I can collect more detailed information about the incident.

  Scenario: As a logged in user, I will create a incident for other violation information
    Given I am logged in as an admin with username "primero_mrm" and password "primero"
    When I access "incidents page"
    And I press the "New Incident" button
    And I press the "Violations" button
    And I press the "Other Violation" button
    And I update in the 1st "Other Violation" subform with the follow:
      | Other Violation Type        | <Select> Denial of Civil Rights              |
      | Other Violation Description | Some Violation Description                   |
      | Number of survivors         | <Tally>Boys:1<Tally>Girls:2<Tally>Unknown:3  |
      | Verifier                                                                                                                        | Verifier name                                                           |
      | Verification Decision Date                                                                                                      | today's date                                                            |
      | Has the information been received from a primary and reliable source?                                                           | <Select> Yes, from a credible Primary Source who witnessed the incident |
      | Was the incident witnessed by UN staff or other MRM-trained affiliates?                                                         | <Radio> Yes                                                             |
      | Is the information consistent across various independent sources?                                                               | <Radio> Yes                                                             |
      | Has the veracity of the allegations been deemed credible using reasonable and sound judgement of trained and reliable monitors? | <Radio> No                                                              |
      | If not verified, why?                                                                                                           | <Select> Other                                                          |
      | Notes on Verification Decision                                                                                                  | Notes                                                                   |
      | Verified by CTFMR                                                                                                               | <Radio> No                                                              |
      | Date verified by CTFMR                                                                                                          | today's date                                                            |
    And I fill in the 2nd "Other Violation" subform with the follow:
      | Other Violation Type        | <Select> Access Violations |
      | Other Violation Description | Some Violation Description |
      | Number of survivors         | <Tally>Boys:2<Tally>Girls:3<Tally>Unknown:4  |
    #TODO - fix
    #And the value of "Number of total survivors" in the 1st "Other Violation" subform should be "6"
    #And the value of "Number of total survivors" in the 2nd "Other Violation" subform should be "9"
    And I press "Save"
    Then I should see "Incident record successfully created" on the page
    And I should see in the 1st "Other Violation" subform with the follow:
      | Other Violation Type        | Denial of Civil Rights     |
      | Other Violation Description | Some Violation Description |
      | Number of survivors                                                                                                             |<Tally> Boys:1 Girls:2 Unknown:3 Total number of survivors:6 |
      | Verifier                                                                                                                        | Verifier name                                                  |
      # | Verification Decision Date                                                                                                      | today's date                                                   |
      | Verification Status                                                                                                             | Pending                                                        |
      | Has the information been received from a primary and reliable source?                                                           | Yes, from a credible Primary Source who witnessed the incident |
      | Was the incident witnessed by UN staff or other MRM-trained affiliates?                                                         | Yes                                                            |
      | Is the information consistent across various independent sources?                                                               | Yes                                                            |
      | Has the veracity of the allegations been deemed credible using reasonable and sound judgement of trained and reliable monitors? | No                                                             |
      | If not verified, why?                                                                                                           | Other                                                          |
      | Notes on Verification Decision                                                                                                  | Notes                                                          |
      | Verified by CTFMR                                                                                                               | No                                                             |
      # | Date verified by CTFMR                                                                                                          | today's date                                                   |
    And I should see in the 2nd "Other Violation" subform with the follow:
      | Other Violation Type        | Access Violations          |
      | Other Violation Description | Some Violation Description |
      | Number of survivors         |<Tally> Boys:2 Girls:3 Unknown:4 Total number of survivors:9 |
