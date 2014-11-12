#JIRA PRIMERO-299
#JIRA PRIMERO-352
#JIRA PRIMERO-363
#JIRA PRIMERO-373
#JIRA PRIMERO-400
#JIRA PRIMERO-365
#JIRA PRIMERO-283
#JIRA PRIMERO-446
#JIRA PRIMERO-526
#JIRA PRIMERO-736

@javascript @primero
Feature: Denial of Humanitarian Access Form
  As a User, I want to be able to select a type for Denial of humanitarian access so that I can collect more detailed information about the incident

    Scenario: As a logged in user, I will create a incident for sexual violence
    Given I am logged in as an admin with username "primero_mrm" and password "primero"
    When I access "incidents page"
    And I press the "New Incident" button
    And I press the "Violations" button
    And I press the "Denial of Humanitarian Access" button
    And I fill in the following:
      | What method(s) were used to deny humanitarian access? | <Select> Import Restrictions for Goods               |
      | What organizations were affected?                     | <Choose>International<Choose>United Nations Agencies |
      | Number of Personnel Killed                            | 1                                                    |
      | Number of Personnel Injured                           | 2                                                    |
      | Number of Personnel Abducted                          | 3                                                    |
      | Number of Personnel Threatened                        | 4                                                    |
      | Number of Vehicles Hijacked                           | 5                                                    |
      | Value of Property Stolen / Damaged                    | 60000                                                |
      | Number of survivors                                   | <Tally>Boys:10<Tally>Girls:20<Tally>Unknown:30       |
      | Adults                                                | 50                                                   |
      | Population Affected by Service Disruption             | 70000                                                |
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
    And I fill in the 2nd "Denial Humanitarian Access" subform with the follow:
      | What method(s) were used to deny humanitarian access? | <Select> Travel Restrictions in Country |
      | What organizations were affected?                     | <Choose>Red Cross / Crescent<Choose>NGO |
      | Number of Personnel Killed                | 2      |
      | Number of Personnel Injured               | 3      |
      | Number of Personnel Abducted              | 4      |
      | Number of Personnel Threatened            | 5      |
      | Number of Vehicles Hijacked               | 6      |
      | Value of Property Stolen / Damaged        | 70000  |
      | Number of survivors                       | <Tally>Boys:20<Tally>Girls:30<Tally>Unknown:40       |
      | Adults                                    | 60     |
      | Population Affected by Service Disruption | 80000  |
    #TODO - fix
    #And the value of "Number of total survivors" in the 1st "Denial Humanitarian Access" subform should be "60"
    #And the value of "Number of total survivors" in the 2nd "Denial Humanitarian Access" subform should be "90"
    And I press "Save"
    Then I should see a success message for new Incident
    And I should see in the 1st "Denial Humanitarian Access" subform with the follow:
     | What method(s) were used to deny humanitarian access? | Import Restrictions for Goods          |
     | What organizations were affected?                     | International, United Nations Agencies |
     | Number of Personnel Killed                | 1      |
     | Number of Personnel Injured               | 2      |
     | Number of Personnel Abducted              | 3      |
     | Number of Personnel Threatened            | 4      |
     | Number of Vehicles Hijacked               | 5      |
     | Value of Property Stolen / Damaged        | 60000  |
     | Number of survivors                       |<Tally> Boys:10 Girls:20 Unknown:30 Total number of survivors:60 |
     | Adults                                    | 50     |
     | Population Affected by Service Disruption | 70000  |
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
   And I should see in the 2nd "Denial Humanitarian Access" subform with the follow:
      | What method(s) were used to deny humanitarian access? | Travel Restrictions in Country |
      | What organizations were affected?                     | NGO, Red Cross / Crescent      |
      | Number of Personnel Killed                | 2      |
      | Number of Personnel Injured               | 3      |
      | Number of Personnel Abducted              | 4      |
      | Number of Personnel Threatened            | 5      |
      | Number of Vehicles Hijacked               | 6      |
      | Value of Property Stolen / Damaged        | 70000  |
      | Number of survivors                       |<Tally> Boys:20 Girls:30 Unknown:40 Total number of survivors:90 |
      | Adults                                    | 60     |
      | Population Affected by Service Disruption | 80000  |
