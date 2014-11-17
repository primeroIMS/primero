#JIRA PRIMERO-310
#JIRA PRIMERO-341
#JIRA PRIMERO-333
#JIRA PRIMERO-352
#JIRA PRIMERO-363
#JIRA PRIMERO-365
#JIRA PRIMERO-283
#JIRA PRIMERO-526
#JIRA PRIMERO-736

@javascript @primero
Feature: Attack on Schools Form
  As a User, I want to be able to select a 'cause' for violation types Attacks on Schools and Attacks on Hospitals
  so that I can collect more detailed information about the incident.

  Scenario: As a logged in user, I will create a incident for attack on schools
    Given I am logged in as an admin with username "primero_mrm" and password "primero"
    When I access "incidents page"
    And I press the "New Incident" button
    And I press the "Violations" button
    And I press the "Attack on Schools" button
    And I fill in the following:
      | Number of Sites Attacked                          | 50                                          |
      | Type of Attack On Site                            | <Select> Direct Attack on students/teachers |
      | Type of School                                    | <Select> Early Childhood                    |
      | Classification                                    | <Select> Formal                             |
      | Religious or secular school?                      | <Select> Religious                          |
      | Details                                           | Details about the attack                    |
      | School Name                                       | The School name under attack                |
      | Number of Students                                | 1000                                        |
      | Sex Of Students                                   | <Select> Mixed                              |
      | Number of children killed                         | <Tally>Boys:100<Tally>Girls:101<Tally>Unknown:102  |
      | Number of children injured                        | <Tally>Boys:103<Tally>Girls:104<Tally>Unknown:105  |
      | Number of Staff Killed                            | 106                                         |
      | Number of Staff Injured                           | 107                                         |
      | Number of Other Adults Killed                     | 108                                         |
      | Number of Other Adults Injured                    | 109                                         |
      | Number of Children Affected by Service Disruption | 615                                         |
      | Number of Adults Affected by Service Disruption   | 500                                         |
      | Number of Children Recruited During Attack        | 400                                         |
      | What organization manages this facility?          | <Select> Government                         |
      #TODO - fix
      #| What was the main objective of the "attack"?      | main objective of the attack                |
      | Physical Impact of Attack                         | <Select> Total Destruction                  |
      | Was Facility Closed As A Result?                  | <Radio> No                                  |
      | For How Long? (Days)                              | 100                                         |
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
    And I should see 1 subform on the show page for "Attack on Schools"
    And I should see in the 1st "Attack on Schools" subform with the follow:
      | Number of Sites Attacked                          | 50                                 |
      | Type of Attack On Site                            | Direct Attack on students/teachers |
      | Type of School                                    | Early Childhood                    |
      | Classification                                    | Formal                             |
      | Religious or secular school?                      | Religious                          |
      | Details                                           | Details about the attack           |
      | School Name                                       | The School name under attack       |
      | Number of Students                                | 1000                               |
      | Sex Of Students                                   | Mixed                              |
      | Number of children killed                         |<Tally> Boys:100 Girls:101 Unknown:102 Total number of children killed:303 |
      | Number of children injured                        |<Tally> Boys:103 Girls:104 Unknown:105 Total number of children injured:312 |
      | Number of Staff Killed                            | 106                                |
      | Number of Staff Injured                           | 107                                |
      | Number of Other Adults Killed                     | 108                                |
      | Number of Other Adults Injured                    | 109                                |
      | Number of Children Affected by Service Disruption | 615                                |
      | Number of Adults Affected by Service Disruption   | 500                                |
      | Number of Children Recruited During Attack        | 400                                |
      | What organization manages this facility?          | Government                         |
      #TODO - fix
      #| What was the main objective of the "attack"?      | main objective of the attack       |
      | Physical Impact of Attack                         | Total Destruction                  |
      | Was Facility Closed As A Result?                  | No                                 |
      | For How Long? (Days)                              | 100                                |
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