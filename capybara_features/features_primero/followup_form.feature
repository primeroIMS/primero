#JIRA PRIMERO-166
#JIRA PRIMERO-203
#JIRA PRIMERO-220
# JIRA PRIMERO-232
#JIRA PRIMERO-274
#JIRA PRIMERO-160
# JIRA PRIMERO-353
# JIRA PRIMERO-363
#JIRA PRIMERO-365
#JIRA PRIMERO-414
#JIRA PRIMERO-415

@javascript @primero
Feature: Followup
  As a Social worker, I want to enter information related to follow up visits so that we can report on our interactions with the child (individual) in our care.

  Background:
    Given I am logged in as an admin with username "primero" and password "primero"
    When I access "cases page"
    And I press the "Create a New Case" button
    And I press the "Services / Follow Up" button
    And I click on "Follow Up" in form group "Services / Follow Up"

  Scenario: I am a logged in Social Worker on the Follow Ups form
    And I fill in the 1st "Followup Subform Section" subform with the follow:
      | Follow up needed by                                         | 12-Jun-2014                             |
      | Follow up date                                              | 12-Jun-2014                             |
      | Details about action taken                                  | Some details about action taken         |
      | Date action taken?                                          | 10-Jun-2014                             |
      | If yes, when do you recommend the next visit to take place? | The next week                           |
      | Comments                                                    | Some comments                           |
      | Type of follow up                                           |<Select> Follow up After Reunification   |
      | Type of service                                             |<Select> Health/Medical Service          |
      | Type of assessment                                          |<Select> Medical Intervention Assessment |
      | Was the child/adult seen during the visit?                  |<Radio> No                               |
      | If not, why?                                                |<Choose>At School                        |
      | Has action been taken?                                      |<Radio> Yes                              |
      | Is there a need for further follow up visits?               |<Radio> Yes                              |
    And I fill in the 2nd "Followup Subform Section" subform with the follow:
      | Follow up needed by                                         | 15-Jun-2014                                                     |
      | Follow up date                                              | 15-Jun-2014                                                     |
      | Details about action taken                                  | Some details about action taken                                 |
      | Date action taken?                                          | 14-Jun-2014                                                     |
      | Comments                                                    | Some additional comments                                        |
      | Type of follow up                                           | <Select> Follow up for Assessment                               |
      | Type of service                                             | <Select> Family Reunification Service                           |
      | Type of assessment                                          | <Select> Personal Intervention Assessment                       |
      | Was the child/adult seen during the visit?                  | <Radio> No                                                      |
      | If not, why?                                                | <Choose>Visiting Friends/Relatives<Choose>Other, please specify |
      | If other, please specify                                    | Reason child not seen                                           |
      | Has action been taken?                                      | <Radio> Yes                                                     |
      | Is there a need for further follow up visits?               | <Radio> No                                                      |
      | If not, do you recommend that the case be closed?           | <Radio> Yes                                                     |
    And I press "Save"
    Then I should see "Case record successfully created" on the page
    And I should see in the 1st "Followup Subform Section" subform with the follow:
      | Follow up needed by                                         | 12-Jun-2014                      |
      | Follow up date                                              | 12-Jun-2014                      |
      | Details about action taken                                  | Some details about action taken  |
      | Date action taken?                                          | 10-Jun-2014                      |
      | If yes, when do you recommend the next visit to take place? | The next week                    |
      | Comments                                                    | Some comments                    |
      | Type of follow up                                           | Follow up After Reunification    |
      | Type of service                                             | Health/Medical Service           |
      | Type of assessment                                          | Medical Intervention Assessment  |
      | Was the child/adult seen during the visit?                  | No                               |
      | If not, why?                                                | At School                        |
      | Has action been taken?                                      | Yes                              |
      | Is there a need for further follow up visits?               | Yes                              |
    And I should see in the 2nd "Followup Subform Section" subform with the follow:
      | Follow up needed by                                         | 15-Jun-2014                                       |
      | Follow up date                                              | 15-Jun-2014                                       |
      | Details about action taken                                  | Some details about action taken                   |
      | Date action taken?                                          | 14-Jun-2014                                       |
      | Comments                                                    | Some additional comments                          |
      | Type of follow up                                           | Follow up for Assessment                          |
      | Type of service                                             | Family Reunification Service                      |
      | Type of assessment                                          | Personal Intervention Assessment                  |
      | Was the child/adult seen during the visit?                  | No                                                |
      | If not, why?                                                | Visiting Friends/Relatives, Other, please specify |
      | If other, please specify                                    | Reason child not seen                             |
      | Has action been taken?                                      | Yes                                               |
      | Is there a need for further follow up visits?               | No                                                |
      | If not, do you recommend that the case be closed?           | Yes                                               |
    And I press the "Edit" button
    And I press the "Follow Up" button
    And I remove the 2nd "Followup Subform Section" subform
    And I click OK in the browser popup
    And I expanded the 1st "Followup Subform Section" subform
    And I fill in the following:
      | Follow up needed by                                         | 11-Jun-2014                            |
      | Follow up date                                              | 11-Jun-2014                            |
      | Details about action taken                                  | Some details about action taken        |
      | Date action taken?                                          | 10-Jun-2014                            |
      | If yes, when do you recommend the next visit to take place? | The next week                          |
      | Comments                                                    | Some comments                          |
    And I press "Save"
    And I should not see "Follow up for Assessment" on the page
    And I should not see "Personal Intervention Assessment" on the page
    And I should not see "15-Jun-2014" on the page
    And I should not see "14-Jun-2014" on the page
    And I should not see "Some additional comments" on the page
    And I should not see "Visiting Friends/Relatives" on the page
