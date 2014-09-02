#JIRA PRIMERO-156
# JIRA PRIMERO-232
# JIRA PRIMERO-353
# JIRA PRIMERO-363
# JIRA PRIMERO-244

@javascript @primero
Feature: Verification
  As a Social worker, I want to enter information related to verification activities related to the child so that we can track progress in reunification.

  Background:
    Given I am logged in as an admin with username "primero" and password "primero"
    When I access "cases page"
    And I press the "New Case" button
    And I press the "Tracing" button
    And I press the "Verification" button

  Scenario: I am a logged in Social Worker on the Verification form
    And I fill in the 1st "Verification Subform Section" subform with the follow:
      | Inquirer's Name                                             | Mr. Smith                |
      | Relationship                                                | <Select> Father          |
      | Sex                                                         | <Select> Male            |
      | Age                                                         | 58                       |
      | Current Location                                            | Springfield              |
      | Address                                                     | TUCSON AZ 85705          |
      | Phone                                                       | 732-757-2923             |
      | Do you want the child to come and live with you?            | <Radio> Yes              |
      | Are you able to care for him/her/them?                      | <Radio> Yes              |
      | Comments                                                    | Some comments            |
      | Date of acceptance to take care of child                    | 30-Jun-2014              |
      | Does the child know the adult requesting verification?      | <Radio> No               |
      | Does the child wish to be reunified with that person?       | <Radio> Yes              |
      | Does the information given by the child and adult match?    | <Radio> Yes              |
      | Do you recommend reunifcation and if not what other action? | <Select> Yes             |
      | Additional comments                                         | Some additional comments |
      | Date of Verification                                        | 20-Jun-2014              |
    And I fill in the 2nd "Verification Subform Section" subform with the follow:
      | Inquirer's Name                                             | John Snow                |
      | Relationship                                                | <Select> Brother         |
      | Sex                                                         | <Select> Male            |
      | Age                                                         | 24                       |
      | Current Location                                            | The North                |
      | Address                                                     | Some address             |
      | Do you want the child to come and live with you?            | <Radio> Yes              |
      | Are you able to care for him/her/them?                      | <Radio> Yes              |
      | Comments                                                    | Some comments            |
      | Date of acceptance to take care of child                    | 25-Jun-2014              |
      | Does the child know the adult requesting verification?      | <Radio> Yes              |
      | Does the child wish to be reunified with that person?       | <Radio> Yes              |
      | Does the information given by the child and adult match?    | <Radio> Yes              |
      | Do you recommend reunifcation and if not what other action? | <Select> Yes             |
      | Additional comments                                         | Some additional comments |
      | Date of Verification                                        | 22-Jun-2014              |
    And I press "Save"
    Then I should see "Case record successfully created" on the page
    And I should see "Mr. Smith" on the page
    And I should see "Father" on the page
    And I should see "58" on the page
    And I should see "Springfield" on the page
    And I should see "John Snow" on the page
    And I should see "Brother" on the page
    And I should see "24" on the page
    And I should see "The North" on the page
    And I should see "Some address" on the page
    And I press the "Edit" button
    And I press the "Verification" button
    And I remove the 2nd "Verification Subform Section" subform
    And I click OK in the browser popup
    And I wait for 1 seconds
    And I press "Save"
    And I should not see "John Snow" on the page
    And I should not see "Brother" on the page
    And I should not see "24" on the page
    And I should not see "The North" on the page
    And I should not see "Some address" on the page

  Scenario: As a logged in user When I enter an invalid number in 'Age' field I should see a validation message
    And I fill in the 1st "Verification Subform Section" subform with the follow:
      | Inquirer's Name   | Jimmy     |
      | Age               | Jimmy Age |
    And I fill in the 2nd "Verification Subform Section" subform with the follow:
      | Inquirer's Name   | Timmy     |
      | Age               | 160       |
    And I press "Save"
    Then I should see "There were problems with the following fields:" on the page
    And I should see "Verification: Age must be a valid number" on the page
    And I should see "Verification: Age must be between 0 and 130" on the page
