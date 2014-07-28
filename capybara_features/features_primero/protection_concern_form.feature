# JIRA PRIMERO-42
# JIRA PRIMERO-73
# JIRA PRIMERO-200
# JIRA PRIMERO-232
# JIRA PRIMERO-254
# JIRA PRIMERO-253
# JIRA PRIMERO-354

@javascript @primero
Feature: Protection Concern Form
  As an administrator, I want to enter information related to protection concerns 
  so that we can know the vulnerabilities of the child.
  
  Scenario: As a logged in user, I should access the form section protection concerns subform
    Given I am logged in as an admin with username "primero" and password "primero"
    When I access "form section page"
    And I press the "Nested Protection Concerns Subform" button
    Then I should see the following fields:
      | Type of Protection Concern   |
      | Period when identified?      |
      | Details of the concern       |
      | Intervention needed?         |
      | Intervention needed by       |
      | Has action been taken?       |
      | Details of Action Taken      |
      | Date when action was taken   |

  Scenario: As a logged in user, I create a case by entering something in every field in the protection concern form
    Given I am logged in as an admin with username "primero" and password "primero"
    When I access "cases page"
    And I press the "Create a New Case" button
    And I press the "Protection Concern" button
    And I fill in the following:
      | Protection Status                                                                 | <Select> Separated                |
      | Urgent Protection Concern?                                                        | <Radio> Yes                       |
      | Current Displacement Status                                                       | <Select> Foreign National         |
      | Is the client an Unaccompanied Minor, Separated Child, or Other Vulnerable Child? | <Checkbox> Unaccompanied Minor <Checkbox> Separated Child  <Checkbox> Other Vulnerable Child |
      | Protection Concerns     | <Choose>Sexually Exploited<Choose>GBV survivor<Choose>Trafficked/smuggled<Choose>Other      |
      | Disability Type         | <Select> Physical Disability                                                                |
    And I fill in the 1st "Protection Concern Subform Section" subform with the follow:
      | Details of the concern     | Test Details                 |
      | Intervention needed by     | 12-May-2014                  |
      | Details of Action Taken    | Test Action Details          |
      | Date when action was taken | 12-May-2014                  |
      | Type of Protection Concern | <Select> Migrant             |
      | Period when identified?    | <Select> Registration        |
      | Intervention needed?       | <Select> Urgent Intervention |
      | Has action been taken?     | <Radio> Yes                  |
    And I press "Save"
    Then I should see "Case record successfully created" on the page
    And I should see a value for "Protection Status" on the show page with the value of "Separated"
    And I should see a value for "Urgent Protection Concern?" on the show page with the value of "Yes"
    And I should see a value for "Current Displacement Status" on the show page with the value of "Foreign National"
    And I should see a value for "Is the client an Unaccompanied Minor, Separated Child, or Other Vulnerable Child?" on the show page with the value of "Unaccompanied Minor, Separated Child, Other Vulnerable Child"
    And I should see a value for "Protection Concerns" on the show page with the value of "Sexually Exploited, GBV survivor, Trafficked/smuggled, Other"
    And I should see a value for "Disability Type" on the show page with the value of "Physical Disability"
    And I should see in the 1st "Protection Concern Detail" subform with the follow:
      | Type of Protection Concern | Migrant             |
      | Period when identified?    | Registration        |
      | Intervention needed?       | Urgent Intervention |
      | Has action been taken?     | Yes                 |
      | Details of the concern     | Test Details        |
      | Intervention needed by     | 12-May-2014         |
      | Details of Action Taken    | Test Action Details |
      | Date when action was taken | 12-May-2014         |
