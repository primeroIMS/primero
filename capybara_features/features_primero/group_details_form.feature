#JIRA PRIMERO-318
#JIRA PRIMERO-365

@javascript @primero
Feature: Group Details Form
  As a User, I want to capture attributes of multiple groups of children rather than details by child
  so that this information can be used for analysis and reporting.

  Scenario: As a logged in user, I will create a incident for group details
    Given I am logged in as an admin with username "primero" and password "primero"
    When I access "incidents page"
    And I press the "Create a New Incident" button
    And I press the "Group Details" button
    And I fill in the 1st "Group Details Section" subform with the follow:
      | Description of the Group of Children                                        | Some Children Group    |
      | Violations                                                                  | <Select> Option 4      |
      | How many children were involved?                                            | 100                    |
      | What was the sex of the group of children involved?                         | <Select> Mixed         |
      | Into which age band did the children fall?                                  | <Select> ≥10<15 years  |
      | What were the ethnic affiliations of the children involved?                 | <Select> Ethnicity 1   |
      | What was the nationality of the children involved?                          | <Select> Nationality 2 |
      | What was the religious affiliation of the children involved?                | <Select> Religion 3    |
      | What was the status of the children involved at the time of the violation ? | <Select> Refugee       |
    And I fill in the 2nd "Group Details Section" subform with the follow:
      | Description of the Group of Children                                        | Some Other Children Group |
      | Violations                                                                  | <Select> Option 2         |
      | How many children were involved?                                            | 200                       |
      | What was the sex of the group of children involved?                         | <Select> Unknown          |
      | Into which age band did the children fall?                                  | <Select> ≥15<18 years     |
      | What were the ethnic affiliations of the children involved?                 | <Select> Ethnicity 2      |
      | What was the nationality of the children involved?                          | <Select> Nationality 1    |
      | What was the religious affiliation of the children involved?                | <Select> Religion 2       |
      | What was the status of the children involved at the time of the violation ? | <Select> Community Member |
    And I press "Save"
    Then I should see "Incident record successfully created" on the page
    And I should see in the 1st "Group Details Section" subform with the follow:
      | Description of the Group of Children                                        | Some Children Group |
      | Violations                                                                  | Option 4            |
      | How many children were involved?                                            | 100                 |
      | What was the sex of the group of children involved?                         | Mixed               |
      | Into which age band did the children fall?                                  | ≥10<15 years        |
      | What were the ethnic affiliations of the children involved?                 | Ethnicity 1         |
      | What was the nationality of the children involved?                          | Nationality 2       |
      | What was the religious affiliation of the children involved?                | Religion 3          |
      | What was the status of the children involved at the time of the violation ? | Refugee             |
    And I should see in the 2nd "Group Details Section" subform with the follow:
      | Description of the Group of Children                                        | Some Other Children Group |
      | Violations                                                                  | Option 2                  |
      | How many children were involved?                                            | 200                       |
      | What was the sex of the group of children involved?                         | Unknown                   |
      | Into which age band did the children fall?                                  | ≥15<18 years              |
      | What were the ethnic affiliations of the children involved?                 | Ethnicity 2               |
      | What was the nationality of the children involved?                          | Nationality 1             |
      | What was the religious affiliation of the children involved?                | Religion 2                |
      | What was the status of the children involved at the time of the violation ? | Community Member          |
