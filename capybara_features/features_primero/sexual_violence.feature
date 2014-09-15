#JIRA PRIMERO-270
#JIRA PRIMERO-351
#JIRA PRIMERO-331
#JIRA PRIMERO-352
#JIRA PRIMERO-363
#JIRA PRIMERO-373
#JIRA PRIMERO-365
#JIRA PRIMERO-283
#JIRA PRIMERO-505
#JIRA PRIMERO-526

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
      | Number of survivors                                                                 | <Tally>Boys:1<Tally>Girls:2<Tally>Unknown:3              |
      | Type of Violence                                                                    | <Choose>Forced Marriage<Choose>Forced Sterilization      |
      | Stage of displacement at time of incident                                           | <Select> During Flight                                   |
      | Type of abduction at time of the incident                                           | <Select> Forced Conscription                             |
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
    #TODO - fix
    #And the value of "Number of total survivors" in the 1st "Sexual Violence" subform should be "6"
    And I press "Save"
    Then I should see "Incident record successfully created" on the page
    And I should see 1 subform on the show page for "Sexual Violence"
    And I should see in the 1st "Sexual Violence" subform with the follow:
      | Number of survivors                                                                 |<Tally> Boys:1 Girls:2 Unknown:3 Total number of survivors:6 |
      | Type of Violence                                                                    | Forced Marriage, Forced Sterilization           |
      | Stage of displacement at time of incident                                           | During Flight                                   |
      | Type of abduction at time of the incident                                           | Forced Conscription                             |
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
