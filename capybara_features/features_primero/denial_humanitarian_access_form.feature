#JIRA PRIMERO-299
#JIRA PRIMERO-352
#JIRA PRIMERO-363

@javascript @primero
Feature: Denial of Humanitarian Access Form
  As a User, I want to be able to select a type for Denial of humanitarian access so that I can collect more detailed information about the incident
  
    Scenario: As a logged in user, I will create a incident for sexual violence
    Given I am logged in as an admin with username "primero" and password "primero"
    When I access "incidents page"
    And I press the "Create a New Incident" button
    And I press the "Violations" button
    And I press the "Denial of Humanitarian Access" button
    And I fill in the following:
     | What method(s) were used to deny humanitarian access? | <Select> Import Restrictions for Goods               |
     | What organizations were affected?                     | <Choose>International<Choose>United Nations Agencies |
    And I fill in the 1st "Impact Humanitarian Personnel Section" subform with the follow:
     | Number of Personnel Killed         | 1     |
     | Number of Personnel Injured        | 2     |
     | Number of Personnel Abducted       | 3     |
     | Number of Personnel Threatened     | 4     |
     | Number of Vehicles Hijacked        | 5     |
     | Value of Property Stolen / Damaged | 60000 |
    And I fill in the 1st "Human Impact Attack Section" subform with the follow:
     | Number of victims: boys                   | 10     |
     | Number of victims: girls                  | 20     |
     | Number of victims: unknown                | 30     |
     | Number of Child Victims Total             | 40     |
     | Adults                                    | 50     |
     | Population Affected by Service Disruption | 70000  |
    And I press "Save"
    Then I should see "Incident record successfully created" on the page
    And I should see a value for "What method(s) were used to deny humanitarian access?" on the show page with the value of "Import Restrictions for Goods"
    And I should see a value for "What organizations were affected?" on the show page with the value of "International, United Nations Agencies"
    And I should see in the 1st "Impact on Humanitarian Personnel/Property Detail" subform with the follow:
     | Number of Personnel Killed         | 1     |
     | Number of Personnel Injured        | 2     |
     | Number of Personnel Abducted       | 3     |
     | Number of Personnel Threatened     | 4     |
     | Number of Vehicles Hijacked        | 5     |
     | Value of Property Stolen / Damaged | 60000 |
    And I should see in the 1st "Human Impact of Attack Detail" subform with the follow:
     | Number of victims: boys                   | 10     |
     | Number of victims: girls                  | 20     |
     | Number of victims: unknown                | 30     |
     | Number of Child Victims Total             | 40     |
     | Adults                                    | 50     |
     | Population Affected by Service Disruption | 70000  |
