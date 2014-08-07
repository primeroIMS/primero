#JIRA PRIMERO-310
#JIRA PRIMERO-341
#JIRA PRIMERO-333
#JIRA PRIMERO-352
#JIRA PRIMERO-363
#JIRA PRIMERO-365

@javascript @primero
Feature: Attack on Schools Form
  As a User, I want to be able to select a 'cause' for violation types Attacks on Schools and Attacks on Hospitals
  so that I can collect more detailed information about the incident.

  Scenario: As a logged in user, I will create a incident for attack on schools
    Given I am logged in as an admin with username "primero" and password "primero"
    When I access "incidents page"
    And I press the "Create a New Incident" button
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
      | Number of Boys Killed                             | 100                                         |
      | Number of Girls Killed                            | 101                                         |
      | Number of Unknown Children Killed                 | 102                                         |
      | Total Children Killed                             | 303                                         |
      | Number of Boys Injured                            | 103                                         |
      | Number of Girls Injured                           | 104                                         |
      | Number of Unknown Children Injured                | 105                                         |
      | Total Children Injured                            | 312                                         |
      | Number of Staff Killed                            | 106                                         |
      | Number of Staff Injured                           | 107                                         |
      | Number of Other Adults Killed                     | 108                                         |
      | Number of Other Adults Injured                    | 109                                         |
      | Number of Children Affected by Service Disruption | 615                                         |
      | Number of Adults Affected by Service Disruption   | 500                                         |
      | Number of Children Recruited During Attack        | 400                                         |
      | What organization manages this facility?          | <Select> Government                         |
      | What was the main objective of the "attack"?      | main objective of the attack                |
      | Physical Impact of Attack                         | <Select> Total Destruction                  |
      | Was Facility Closed As A Result?                  | <Radio> No                                  |
      | For How Long? (Days)                              | 100                                         |
    And I press "Save"
    Then I should see "Incident record successfully created" on the page
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
      | Number of Boys Killed                             | 100                                |
      | Number of Girls Killed                            | 101                                |
      | Number of Unknown Children Killed                 | 102                                |
      | Total Children Killed                             | 303                                |
      | Number of Boys Injured                            | 103                                |
      | Number of Girls Injured                           | 104                                |
      | Number of Unknown Children Injured                | 105                                |
      | Total Children Injured                            | 312                                |
      | Number of Staff Killed                            | 106                                |
      | Number of Staff Injured                           | 107                                |
      | Number of Other Adults Killed                     | 108                                |
      | Number of Other Adults Injured                    | 109                                |
      | Number of Children Affected by Service Disruption | 615                                |
      | Number of Adults Affected by Service Disruption   | 500                                |
      | Number of Children Recruited During Attack        | 400                                |
      | What organization manages this facility?          | Government                         |
      | What was the main objective of the "attack"?      | main objective of the attack       |
      | Physical Impact of Attack                         | Total Destruction                  |
      | Was Facility Closed As A Result?                  | No                                 |
      | For How Long? (Days)                              | 100                                |