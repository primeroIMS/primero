#JIRA PRIMERO-298
#JIRA PRIMERO-345
#JIRA PRIMERO-334
#JIRA PRIMERO-352
#JIRA PRIMERO-363
#JIRA PRIMERO-365
#JIRA PRIMERO-283
#JIRA PRIMERO-526
#JIRA PRIMERO-736

@javascript @primero
Feature: Attack on Hospitals Form
  As a User, I want to be able to select a 'cause' for violation types Attacks on Schools and Attacks on Hospitals so that I can collect more detailed information about the incident

  Scenario: As a logged in user, I will create a incident for attack on hospitals
    Given I am logged in as an admin with username "primero_mrm" and password "primero"
    When I access "incidents page"
    And I press the "New Incident" button
    And I press the "Incident" button
    And I choose from "Violation Category":
     | Attacks on Hospitals |
    And I press the "Violations" button
    And I press the "Attack on Hospitals" button
    And I fill in the following:
      | Number of Sites Attacked                          | 3                           |
      | Type of Attack On Site                            | <Select> Aerial Bombardment |
      | Hospital Name                                     | Some hospital name          |
      | Number of Patients                                | 125                         |
      | Number of children killed                         | <Tally>Boys:23<Tally>Girls:15<Tally>Unknown:5  |
      | Number of children injured                        | <Tally>Boys:6<Tally>Girls:10<Tally>Unknown:0   |
      | Number of Staff Killed                            | 7                           |
      | Number of Staff Injured                           | 12                          |
      | Number of Other Adults Killed                     | 4                           |
      | Number of Other Adults Injured                    | 9                           |
      | Number of Children Affected by Service Disruption | 60                          |
      | Number of Adults Affected by Service Disruption   | 12                          |
      | Number of Children Recruited During Attack        | 3                           |
      | What organization manages this facilty?           | <Select> Government         |
      #TODO - fix
      #| What was the main objective of the "attack"?      | Some information            |
      | Physical Impact of Attack                         | <Select> Serious Damage     |
      | Was Facility Closed As A Result?                  | <Radio> Yes                 |
      | For How Long? (Days)                              | 60                          |
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
    And I press "Save"
    Then I should see a success message for new Incident
    And I should see 1 subform on the show page for "Attack on Hospitals"
    And I should see in the 1st "Attack on Hospitals" subform with the follow:
      | Number of Sites Attacked                          | 3                  |
      | Type of Attack On Site                            | Aerial Bombardment |
      | Hospital Name                                     | Some hospital name |
      | Number of Patients                                | 125                |
      | Number of children killed                         |<Tally> Boys:23 Girls:15 Unknown:5 Total number of children killed:43 |
      | Number of children injured                        |<Tally> Boys:6 Girls:10 Unknown:0 Total number of children injured:16 |
      | Number of Staff Killed                            | 7                  |
      | Number of Staff Injured                           | 12                 |
      | Number of Other Adults Killed                     | 4                  |
      | Number of Other Adults Injured                    | 9                  |
      | Number of Children Affected by Service Disruption | 60                 |
      | Number of Adults Affected by Service Disruption   | 12                 |
      | Number of Children Recruited During Attack        | 3                  |
      | What organization manages this facilty?           | Government         |
      #TODO - fix
      #| What was the main objective of the "attack"?      | Some information   |
      | Physical Impact of Attack                         | Serious Damage     |
      | Was Facility Closed As A Result?                  | Yes                |
      | For How Long? (Days)                              | 60                 |
      | Verifier                                                                                                                        | Verifier name                                                  |
      # | Verification Decision Date                                                                                                      | today's date                                                   |
      | Verification Status                                                                                                             | Pending Verification                                                      |
      | Has the information been received from a primary and reliable source?                                                           | Yes, from a credible Primary Source who witnessed the incident |
      | Was the incident witnessed by UN staff or other MRM-trained affiliates?                                                         | Yes                                                            |
      | Is the information consistent across various independent sources?                                                               | Yes                                                            |
      | Has the veracity of the allegations been deemed credible using reasonable and sound judgement of trained and reliable monitors? | No                                                             |
      | If not verified, why?                                                                                                           | Other                                                          |
      | Notes on Verification Decision                                                                                                  | Notes                                                          |
      | Verified by CTFMR                                                                                                               | No                                                             |
      # | Date verified by CTFMR                                                                                                          | today's date                                                   |