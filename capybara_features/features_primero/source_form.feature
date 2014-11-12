# JIRA PRIMERO-320
# JIRA PRIMERO-365
# JIRA PRIMERO-727
# JIRA PRIMERO-736

Feature: Source Form
  As a User, I want to add details about the source of the information so that we can verify the details of the incident

  @javascript @primero
  Scenario: As a logged in user, I will create a incident for source
    Given I am logged in as an admin with username "primero_mrm" and password "primero"
    And the following location country exist in the system:
      | placename     |
      | Some location |
    When I access "incidents page"
    And I press the "New Incident" button
    And I press the "Source" button
    And I fill in the 1st "Source Subform Section" subform with the follow:
      | Date of Interview                                          | 19-Jul-1979                 |
      | Monitor ID                                                 | <Select> Option1            |
      | Primary Report Agency                                      | <Select> Option1            |
      | Other Reporting Agency                                     | <Select> Option2            |
      | Location of Report                                         | <Choose>Some location       |
      | Type of Source                                             | <Select> Primary            |
      | Notes                                                      | Some notes about the source |
      | Category of Source                                         | <Select> Option3            |
      | Sex of Source                                              | <Select> Male               |
      | Age of Source                                              | <Select> Adult              |
      | Reliability of Source                                      | <Select> Medium             |
      | Details of Source Reliabilty Ranking                       | Some details                |
      | Source ID                                                  | S0011592US                  |
      | Permission for Follow Up or to Contact again?              | <Radio> Yes                 |
      | Consent for Data Sharing/Reporting?                        | <Radio> Don't Know          |
      | If the source is a child, does the child require services? | <Radio> Yes                 |
    Then I press "Save"
    Then I should see a success message for new Incident
    And I should see in the 1st "Source Subform Section" subform with the follow:
      | Date of Interview                                          | 19-Jul-1979                 |
      | Monitor ID                                                 | Option1                     |
      | Primary Report Agency                                      | Option1                     |
      | Other Reporting Agency                                     | Option2                     |
      | Location of Report                                         | Some location               |
      | Type of Source                                             | Primary                     |
      | Notes                                                      | Some notes about the source |
      | Category of Source                                         | Option3                     |
      | Sex of Source                                              | Male                        |
      | Age of Source                                              | Adult                       |
      | Reliability of Source                                      | Medium                      |
      | Details of Source Reliabilty Ranking                       | Some details                |
      | Source ID                                                  | S0011592US                  |
      | Permission for Follow Up or to Contact again?              | Yes                         |
      | Consent for Data Sharing/Reporting?                        | Don't Know                  |
      | If the source is a child, does the child require services? | Yes                         |