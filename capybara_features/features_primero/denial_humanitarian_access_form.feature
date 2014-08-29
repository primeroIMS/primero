#JIRA PRIMERO-299
#JIRA PRIMERO-352
#JIRA PRIMERO-363
#JIRA PRIMERO-373
#JIRA PRIMERO-400
#JIRA PRIMERO-365
#JIRA PRIMERO-283
#JIRA PRIMERO-446

@javascript @primero
Feature: Denial of Humanitarian Access Form
  As a User, I want to be able to select a type for Denial of humanitarian access so that I can collect more detailed information about the incident

    Scenario: As a logged in user, I will create a incident for sexual violence
    Given I am logged in as an admin with username "primero_mrm" and password "primero"
    When I access "incidents page"
    And I press the "Create a New Incident" button
    And I press the "Violations" button
    And I press the "Denial of Humanitarian Access" button
    And I fill in the following:
      | What method(s) were used to deny humanitarian access? | <Select> Import Restrictions for Goods               |
      | What organizations were affected?                     | <Choose>International<Choose>United Nations Agencies |
      | Number of Personnel Killed                | 1      |
      | Number of Personnel Injured               | 2      |
      | Number of Personnel Abducted              | 3      |
      | Number of Personnel Threatened            | 4      |
      | Number of Vehicles Hijacked               | 5      |
      | Value of Property Stolen / Damaged        | 60000  |
      | Number of survivors: boys                 | 10     |
      | Number of survivors: girls                | 20     |
      | Number of survivors: unknown              | 30     |
      | Adults                                    | 50     |
      | Population Affected by Service Disruption | 70000  |
    And I fill in the 2nd "Denial Humanitarian Access" subform with the follow:
      | What method(s) were used to deny humanitarian access? | <Select> Travel Restrictions in Country |
      | What organizations were affected?                     | <Choose>Red Cross / Crescent<Choose>NGO |
      | Number of Personnel Killed                | 2      |
      | Number of Personnel Injured               | 3      |
      | Number of Personnel Abducted              | 4      |
      | Number of Personnel Threatened            | 5      |
      | Number of Vehicles Hijacked               | 6      |
      | Value of Property Stolen / Damaged        | 70000  |
      | Number of survivors: boys                 | 20     |
      | Number of survivors: girls                | 30     |
      | Number of survivors: unknown              | 40     |
      | Adults                                    | 60     |
      | Population Affected by Service Disruption | 80000  |
    And the value of "Number of total survivors" in the 1st "Denial Humanitarian Access" subform should be "60"
    And the value of "Number of total survivors" in the 2nd "Denial Humanitarian Access" subform should be "90"
    And I press "Save"
    Then I should see "Incident record successfully created" on the page
    And I should see in the 1st "Denial Humanitarian Access" subform with the follow:
     | What method(s) were used to deny humanitarian access? | Import Restrictions for Goods          |
     | What organizations were affected?                     | International, United Nations Agencies |
     | Number of Personnel Killed                | 1      |
     | Number of Personnel Injured               | 2      |
     | Number of Personnel Abducted              | 3      |
     | Number of Personnel Threatened            | 4      |
     | Number of Vehicles Hijacked               | 5      |
     | Value of Property Stolen / Damaged        | 60000  |
     | Number of survivors: boys                 | 10     |
     | Number of survivors: girls                | 20     |
     | Number of survivors: unknown              | 30     |
     | Number of total survivors                 | 60     |
     | Adults                                    | 50     |
     | Population Affected by Service Disruption | 70000  |
   And I should see in the 2nd "Denial Humanitarian Access" subform with the follow:
      | What method(s) were used to deny humanitarian access? | Travel Restrictions in Country |
      | What organizations were affected?                     | NGO, Red Cross / Crescent      |
      | Number of Personnel Killed                | 2      |
      | Number of Personnel Injured               | 3      |
      | Number of Personnel Abducted              | 4      |
      | Number of Personnel Threatened            | 5      |
      | Number of Vehicles Hijacked               | 6      |
      | Value of Property Stolen / Damaged        | 70000  |
      | Number of survivors: boys                 | 20     |
      | Number of survivors: girls                | 30     |
      | Number of survivors: unknown              | 40     |
      | Number of total survivors                 | 90     |
      | Adults                                    | 60     |
      | Population Affected by Service Disruption | 80000  |
