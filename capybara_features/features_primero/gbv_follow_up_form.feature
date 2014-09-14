#JIRA PRIMERO-485
#JIRA PRIMERO-550

@javascript @primero
Feature: GBV Follow Up
  As a Social worker, I want to enter information related to GBV follow up visits.

  Background:
    Given I am logged in as an admin with username "primero_gbv" and password "primero"
    When I access "cases page"
    And I press the "New Case" button
    And I press the "Services / Follow Up" button
    And I click on "GBV Follow Up" in form group "Services / Follow Up"

  Scenario: I am a logged in Social Worker on the Follow Ups form
    And the "Type of service" dropdown should not have the following options:
      | BID or BIA / Care Service |
      | Care Arrangement Service  |
      | Social Support Service    |
    And I fill in the 1st "GBV Follow Up Subform Section" subform with the follow:
      | Type of service                                   | <Select> Health/Medical Service |
      | Follow up date                                    | 19-Jul-2014                     |
      | Has action been taken?                            | <Radio> Yes                     |
      | Details about action taken                        | Some details about action taken |
      | Is there a need for further follow up visits?     | <Radio> No                      |
      | If not, do you recommend that the case be closed? | <Radio> Yes                     |
      | Comments                                          | Some Comments                   |
      | Progress towards Safety goals                       | <Radio> in progress                                 |
      | Explain Progress towards Safety goals               | explain progress towards safety goals               |
      | Progress towards Heath care goals                   | <Radio> in progress                                 |
      | Explain                                             | explain                                             |
      | Progress towards Psychosocial Support goals         | <Radio> in progress                                 |
      | Explain Progress towards Psychosocial Support goals | explain progress towards psychosocial support goals |
      | Progress towards Access to Justice goals            | <Radio> in progress                                 |
      | Explain Progress towards Access to Justice goals    | explain progress towards access to justice goals    |
      | Other goals (list here)                             | other goals                                         |
      | Progress towards other goals                        | <Radio> in progress                                 |
      | Explain Progress towards other goals                | explain progress towards other goals                |
    And I fill in the 2nd "GBV Follow Up Subform Section" subform with the follow:
      | Type of service                                   | <Select> Education Service      |
      | Follow up date                                    | 12-Jul-2014                     |
      | Has action been taken?                            | <Radio> Yes                     |
      | Details about action taken                        | Some details about action taken |
      | Is there a need for further follow up visits?     | <Radio> No                      |
      | If not, do you recommend that the case be closed? | <Radio> No                      |
      | Comments                                          | Some Comments                   |
    And I press "Save"
    Then I should see "Case record successfully created" on the page
    And I should see in the 1st "GBV Follow Up Subform Section" subform with the follow:
      | Type of service                                   | Health/Medical Service          |
      | Follow up date                                    | 19-Jul-2014                     |
      | Has action been taken?                            | Yes                             |
      | Details about action taken                        | Some details about action taken |
      | Is there a need for further follow up visits?     | No                              |
      | If not, do you recommend that the case be closed? | Yes                             |
      | Comments                                          | Some Comments                   |
      | Progress towards Safety goals                       | in progress                                         |
      | Explain Progress towards Safety goals               | explain progress towards safety goals               |
      | Progress towards Heath care goals                   | in progress                                         |
      | Explain                                             | explain                                             |
      | Progress towards Psychosocial Support goals         | in progress                                         |
      | Explain Progress towards Psychosocial Support goals | explain progress towards psychosocial support goals |
      | Progress towards Access to Justice goals            | in progress                                         |
      | Explain Progress towards Access to Justice goals    | explain progress towards access to justice goals    |
      | Other goals (list here)                             | other goals                                         |
      | Progress towards other goals                        | in progress                                         |
      | Explain Progress towards other goals                | explain progress towards other goals                |
    And I should see in the 2nd "GBV Follow Up Subform Section" subform with the follow:
      | Type of service                                   | Education Service               |
      | Follow up date                                    | 12-Jul-2014                     |
      | Has action been taken?                            | Yes                             |
      | Details about action taken                        | Some details about action taken |
      | Is there a need for further follow up visits?     | No                              |
      | If not, do you recommend that the case be closed? | No                              |
      | Comments                                          | Some Comments                   |