#JIRA PRIMERO-298
#JIRA PRIMERO-345
#JIRA PRIMERO-334
#JIRA PRIMERO-352
#JIRA PRIMERO-363
#JIRA PRIMERO-365
#JIRA PRIMERO-283

@javascript @primero
Feature: Attack on Hospitals Form
  As a User, I want to be able to select a 'cause' for violation types Attacks on Schools and Attacks on Hospitals so that I can collect more detailed information about the incident

  Scenario: As a logged in user, I will create a incident for attack on hospitals
    Given I am logged in as an admin with username "primero" and password "primero"
    When I access "incidents page"
    And I press the "New Incident" button
    And I press the "Violations" button
    And I press the "Attack on Hospitals" button
    And I fill in the following:
      | Number of Sites Attacked                          | 3                           |
      | Type of Attack On Site                            | <Select> Aerial Bombardment |
      | Hospital Name                                     | Some hospital name          |
      | Number of Patients                                | 125                         |
      | Number of Boys Killed                             | 23                          |
      | Number of Girls Killed                            | 15                          |
      | Number of Unknown Children Killed                 | 5                           |
      | Number of Boys Injured                            | 6                           |
      | Number of Girls Injured                           | 10                          |
      | Number of Unknown Children Injured                | 0                           |
      | Total Children Injured                            | 16                          |
      | Number of Staff Killed                            | 7                           |
      | Number of Staff Injured                           | 12                          |
      | Number of Other Adults Killed                     | 4                           |
      | Number of Other Adults Injured                    | 9                           |
      | Number of Children Affected by Service Disruption | 60                          |
      | Number of Adults Affected by Service Disruption   | 12                          |
      | Number of Children Recruited During Attack        | 3                           |
      | What organization manages this facilty?           | <Select> Government         |
      | What was the main objective of the "attack"?      | Some information            |
      | Physical Impact of Attack                         | <Select> Serious Damage     |
      | Was Facility Closed As A Result?                  | <Radio> Yes                 |
      | For How Long? (Days)                              | 60                          |
    And I press "Save"
    Then I should see "Incident record successfully created" on the page
    And I should see 1 subform on the show page for "Attack on Hospitals"
    And I should see in the 1st "Attack on Hospitals" subform with the follow:
      | Number of Sites Attacked                          | 3                  |
      | Type of Attack On Site                            | Aerial Bombardment |
      | Hospital Name                                     | Some hospital name |
      | Number of Patients                                | 125                |
      | Number of Boys Killed                             | 23                 |
      | Number of Girls Killed                            | 15                 |
      | Number of Unknown Children Killed                 | 5                  |
      | Total Children Killed                             | 43                 |
      | Number of Boys Injured                            | 6                  |
      | Number of Girls Injured                           | 10                 |
      | Number of Unknown Children Injured                | 0                  |
      | Total Children Injured                            | 16                 |
      | Number of Staff Killed                            | 7                  |
      | Number of Staff Injured                           | 12                 |
      | Number of Other Adults Killed                     | 4                  |
      | Number of Other Adults Injured                    | 9                  |
      | Number of Children Affected by Service Disruption | 60                 |
      | Number of Adults Affected by Service Disruption   | 12                 |
      | Number of Children Recruited During Attack        | 3                  |
      | What organization manages this facilty?           | Government         |
      | What was the main objective of the "attack"?      | Some information   |
      | Physical Impact of Attack                         | Serious Damage     |
      | Was Facility Closed As A Result?                  | Yes                |
      | For How Long? (Days)                              | 60                 |