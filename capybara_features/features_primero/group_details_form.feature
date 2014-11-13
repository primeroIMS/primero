#JIRA PRIMERO-318
#JIRA PRIMERO-365
#JIRA PRIMERO-736

@javascript @primero
Feature: Group Details Form
  As a User, I want to capture attributes of multiple groups of children rather than details by child
  so that this information can be used for analysis and reporting.

  Scenario: As a logged in user, I will create a incident for group details
    Given I am logged in as an admin with username "primero_mrm" and password "primero"
    When I access "incidents page"
    And I press the "New Incident" button
    And I press the "Group Details" button
    And I fill in the 1st "Group Details Section" subform with the follow:
      | Description of the Group of Children                                        | Some Children Group    |
      | How many children were involved?                                            | 100                    |
      | What was the sex of the group of children involved?                         | <Select> Mixed         |
      | Into which age band did the children fall?                                  | <Select> ≥10<15 years  |
      | What was the status of the children involved at the time of the violation ? | <Select> Refugee       |
    And I fill in the 2nd "Group Details Section" subform with the follow:
      | Description of the Group of Children                                        | Some Other Children Group |
      | How many children were involved?                                            | 200                       |
      | What was the sex of the group of children involved?                         | <Select> Unknown          |
      | Into which age band did the children fall?                                  | <Select> ≥15<18 years     |
      | What was the status of the children involved at the time of the violation ? | <Select> Community Member |
    And I press "Save"
    Then I should see a success message for new Incident
    And I should see in the 1st "Group Details Section" subform with the follow:
      | Description of the Group of Children                                        | Some Children Group |
      | How many children were involved?                                            | 100                 |
      | What was the sex of the group of children involved?                         | Mixed               |
      | Into which age band did the children fall?                                  | ≥10<15 years        |
      | What was the status of the children involved at the time of the violation ? | Refugee             |
    And I should see in the 2nd "Group Details Section" subform with the follow:
      | Description of the Group of Children                                        | Some Other Children Group |
      | How many children were involved?                                            | 200                       |
      | What was the sex of the group of children involved?                         | Unknown                   |
      | Into which age band did the children fall?                                  | ≥15<18 years              |
      | What was the status of the children involved at the time of the violation ? | Community Member          |
