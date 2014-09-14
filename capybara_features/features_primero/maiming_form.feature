#JIRA PRIMERO-286
#JIRA PRIMERO-323
#JIRA PRIMERO-352
#JIRA PRIMERO-363
#JIRA PRIMERO-373
#JIRA PRIMERO-365
#JIRA PRIMERO-283
#JIRA PRIMERO-526

@javascript @primero
Feature: Maiming Form
  As a Social Worker / Data Entry Person, I want to indicate the violation category
  so that I can report on all types of violations associated with the incident

  Scenario: As a logged in user, I will create a incident for maiming information
    Given I am logged in as an admin with username "primero_mrm" and password "primero"
    When I access "incidents page"
    And I press the "New Incident" button
    And I press the "Violations" button
    And I press the "Maiming" button
    And I fill in the following:
      | Number of survivors       | <Tally>Boys:1<Tally>Girls:2<Tally>Unknown:3  |
      | Method                    | <Select> Non-Victim Activated                |
      | Cause                     | <Select> Landmines                           |
      | Details                   | Maiming Details                              |
      | Circumstances             | <Select> Indiscriminate Attack               |
      | Consequences              | <Select> Serious Injury                      |
      | Context                   | <Select> Weapon Used Against The Child       |
      | Mine Incident             | <Radio> Yes                                  |
      | Was the survivor directly participating in hostilities at the time of the violation? | <Radio> No      |
      | Did the violation occur during or as a direct result of abduction?                   | <Radio> Unknown |
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
    #And the value of "Number of total survivors" in the 1st "Maiming" subform should be "6"
    And I press "Save"
    Then I should see "Incident record successfully created" on the page
    And I should see 1 subform on the show page for "Maiming"
    And I should see in the 1st "Maiming" subform with the follow:
      | Number of survivors                                                                         |<Tally> Boys:1 Girls:2 Unknown:3 Total number of survivors:6 |
      | Method                                                                                      | Non-Victim Activated           |
      | Cause                                                                                       | Landmines                      |
      | Details                                                                                     | Maiming Details                |
      | Circumstances                                                                               | Indiscriminate Attack          |
      | Consequences                                                                                | Serious Injury                 |
      | Context                                                                                     | Weapon Used Against The Child  |
      | Mine Incident                                                                               | Yes                            |
      | Was the survivor directly participating in hostilities at the time of the violation?        | No                             |
      | Did the violation occur during or as a direct result of abduction?                          | Unknown                        |
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