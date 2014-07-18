#JIRA PRIMERO-310

@javascript @primero
Feature: Attack on Schools Form
  As a User, I want to be able to select a 'cause' for violation types Attacks on Schools and Attacks on Hospitals
  so that I can collect more detailed information about the incident.

  Scenario: As a logged in user, I will create a incident for attack on schools
    Given I am logged in as an admin with username "primero" and password "primero"
    When I access "incidents page"
    And I press the "Create a New Incident" button
    And I press the "Attack on Schools" button
    And I fill in the following:
      | Number of Sites Attacked     | 50                                          |
      | Type of Attack On Site       | <Select> Direct Attack on students/teachers |
      | Type of School               | <Select> Early Childhood                    |
      | Classification               | <Select> Formal                             |
      | Religious or secular school? | <Select> Religious                          |
      | Details                      | Details about the attack                    |
      | School Name                  | The School name under attack                |
      | Number of Students           | 1000                                        |
      | Sex Of Students              | <Select> Mixed                              |
    And I fill in the 1st "Human Impact of Attack Section" subform with the follow:
      | Number of Boys Killed             | 100 |
      | Number of Girls Killed            | 101 |
      | Number of Unknown Children Killed | 102 |
      | Total Children Killed             | 303 |
      | Number of Boys Injured             | 103 |
      | Number of Girls Injured            | 104 |
      | Number of Unknown Children Injured | 105 |
      | Total Children Injured             | 312 |
      | Number of Staff Killed             | 106 |
      | Number of Staff Injured            | 107 |
      | Number of Other Adults Killed      | 108 |
      | Number of Other Adults Injured     | 109 |
      | Number of Children Affected by Service Disruption | 615 |
      | Number of Adults Affected by Service Disruption   | 500 |
      | Number of Children Recruited During Attack        | 400 |
    And I fill in the following:
      | What organization manages this facility?       | <Select> Government          |
      | What was the main objective of the "attack"?   | main objective of the attack |
      | Physical Impact of Attack                      | <Select> Total Destruction   |
      | Was Facility Closed As A Result?               | <Radio> No                   |
      | For How Long? (Days)                           | 100                          |
    And I press "Save"
    Then I should see "Incident record successfully created" on the page
    And I should see a value for "Number of Sites Attacked" on the show page with the value of "50"
    And I should see a value for "Type of Attack On Site" on the show page with the value of "Direct Attack on students/teachers"
    And I should see a value for "Type of School" on the show page with the value of "Early Childhood"
    And I should see a value for "Classification" on the show page with the value of "Formal"
    And I should see a value for "Religious or secular school?" on the show page with the value of "Religious"
    And I should see a value for "Details" on the show page with the value of "Details about the attack"
    And I should see a value for "School Name" on the show page with the value of "The School name under attack"
    And I should see a value for "Number of Students" on the show page with the value of "1000"
    And I should see a value for "Sex Of Students" on the show page with the value of "Mixed"
    And I should see in the 1st "Human Impact of Attack Detail" subform with the follow:
      | Number of Boys Killed             | 100 |
      | Number of Girls Killed            | 101 |
      | Number of Unknown Children Killed | 102 |
      | Total Children Killed             | 303 |
      | Number of Boys Injured             | 103 |
      | Number of Girls Injured            | 104 |
      | Number of Unknown Children Injured | 105 |
      | Total Children Injured             | 312 |
      | Number of Staff Killed             | 106 |
      | Number of Staff Injured            | 107 |
      | Number of Other Adults Killed      | 108 |
      | Number of Other Adults Injured     | 109 |
      | Number of Children Affected by Service Disruption | 615 |
      | Number of Adults Affected by Service Disruption   | 500 |
      | Number of Children Recruited During Attack        | 400 |
    And I should see a value for "What organization manages this facility?" on the show page with the value of "Government"
    And I should see a value for "What was the main objective of the "attack"?" on the show page with the value of "main objective of the attack"
    And I should see a value for "Physical Impact of Attack" on the show page with the value of "Total Destruction"
    And I should see a value for "Was Facility Closed As A Result?" on the show page with the value of "No"
    And I should see a value for "For How Long? (Days)" on the show page with the value of "100"
