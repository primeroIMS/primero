#JIRA PRIMERO-297
#JIRA PRIMERO-332
#JIRA PRIMERO-352
#JIRA PRIMERO-363
#JIRA PRIMERO-373
#JIRA PRIMERO-365
#JIRA PRIMERO-283
#JIRA PRIMERO-526

@javascript @primero
Feature: Abduction Form
  As a User I want to be able to choose the type of abduction so that I can have that information available for reporting and analysis

  Scenario: As a logged in user, I will create a incident for abduction
    Given I am logged in as an admin with username "primero_mrm" and password "primero"
    When I access "incidents page"
    And I press the "New Incident" button
    And I press the "Violations" button
    And I press the "Abduction" button
    And I fill in the following:
      | Number of survivors                                                                                                             | <Tally>Boys:1<Tally>Girls:2<Tally>Unknown:3                             |
      | Category                                                                                                                        | <Select> Other                                                          |
      | Cross Border                                                                                                                    | <Radio> Yes                                                             |
      | Location where they were abducting from                                                                                         | Some location                                                           |
      | Location where they were held                                                                                                   | Some other location                                                     |
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
    Then I should see "Incident record successfully created" on the page
    And I should see 1 subform on the show page for "Abduction"
    And I should see in the 1st "Abduction" subform with the follow:
      | Number of survivors                     |<Tally> Boys:1 Girls:2 Unknown:3 Total number of survivors:6 |
      | Category                                | Other                                                       |
      | Cross Border                            | Yes                                                         |
      | Location where they were abducting from | Some location                                               |
      | Location where they were held           | Some other location                                         |
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

  Scenario: As a logged in user, I will create a incident for abduction and select verification status
    Given I am logged in as an admin with username "primero_mrm" and password "primero"
    And the following lookups exist in the system:
      | name                | lookup_values                                               |
      | verification_status | Verified, Unverified, Pending, Falsely Attributed, Rejected |
    When I access "incidents page"
    And I press the "New Incident" button
    And I press the "Violations" button
    And I press the "Abduction" button
    And I fill in the following:
      | Number of survivors      | <Tally>Boys:1<Tally>Girls:2<Tally>Unknown:3   |
      | Verification Status      | <Select> Verified                             |
    And I press "Save"
    Then I should see "Incident record successfully created" on the page
    And I should see 1 subform on the show page for "Abduction"
    And I should see in the 1st "Abduction" subform with the follow:
      | Number of survivors                     |<Tally> Boys:1 Girls:2 Unknown:3 Total number of survivors:6 |
      | Verification Status                     | Verified                                                    |
