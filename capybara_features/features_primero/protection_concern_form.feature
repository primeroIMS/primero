# JIRA PRIMERO-42
# JIRA PRIMERO-73
# JIRA PRIMERO-200
# JIRA PRIMERO-232
# JIRA PRIMERO-254
# JIRA PRIMERO-253
# JIRA PRIMERO-354
# JIRA PRIMERO-353
# JIRA PRIMERO-363
# JIRA PRIMERO-427
# JIRA PRIMERO-458
# JIRA PRIMERO-461

@javascript @primero
Feature: Protection Concern Form
  As an administrator, I want to enter information related to protection concerns
  so that we can know the vulnerabilities of the child.

  Scenario: As a logged in user, I create a case by entering something in every field in the protection concern form
    Given I am logged in as an admin with username "primero_cp" and password "primero"
    When I access "cases page"
    And I press the "Create a New Case" button
    And I press the "Protection Concern" button
    And I fill in the following:
      | Protection Status                                                                 | <Select> Separated                |
      | Urgent Protection Concern?                                                        | <Radio> Yes                       |
      | Risk Level                                                                        | <Select> High                     |
      | Displacement Status                                                               | <Select> Foreign National         |
      | Protection Concerns     | <Choose>Sexually Exploited<Choose>GBV survivor<Choose>Trafficked/smuggled<Choose>Other      |
      | Disability Type         | <Select> Physical Disability                                                                |
    And I press "Save"
    Then I should see "Case record successfully created" on the page
    And I should see a value for "Protection Status" on the show page with the value of "Separated"
    And I should see a value for "Urgent Protection Concern?" on the show page with the value of "Yes"
    And I should see a value for "Risk Level" on the show page with the value of "High"
    And I should see a value for "Generate follow up reminders?" on the show page with the value of "No"
    And I should see a value for "Displacement Status" on the show page with the value of "Foreign National"
    And I should see a value for "Protection Concerns" on the show page with the value of "Sexually Exploited, GBV survivor, Trafficked/smuggled, Other"
    And I should see a value for "Disability Type" on the show page with the value of "Physical Disability"

  Scenario: As a logged in user, I create a case by entering something in every field in the protection concern details form
    Given I am logged in as an admin with username "primero_cp" and password "primero"
    When I access "cases page"
    And I press the "Create a New Case" button
    And I press the "Assessment" button
    And I click on "Protection Concern Details" in form group "Assessment"
    And I fill in the following:
      | Protection Concerns | <Choose>Sexually Exploited<Choose>GBV survivor<Choose>Trafficked/smuggled<Choose>Other |
    And I fill in the 1st "Protection Concern Detail Subform Section" subform with the follow:
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
    And I should see a value for "Protection Concerns" on the show page with the value of "Sexually Exploited, GBV survivor, Trafficked/smuggled, Other"
    And I should see in the 1st "Protection Concern Detail Subform Section" subform with the follow:
      | Type of Protection Concern | Migrant             |
      | Period when identified?    | Registration        |
      | Intervention needed?       | Urgent Intervention |
      | Has action been taken?     | Yes                 |
      | Details of the concern     | Test Details        |
      | Intervention needed by     | 12-May-2014         |
      | Details of Action Taken    | Test Action Details |
      | Date when action was taken | 12-May-2014         |

  Scenario: As a logged in user, I want to correctly initialize the chosen in groups
    Given I am logged in as an admin with username "primero_cp" and password "primero"
    When I access "cases page"
    And I press the "Create a New Case" button
    And I press the "Assessment" button
    And I click on "Protection Concern Details" in form group "Assessment"
    And I fill in the following:
      | Protection Concerns | <Choose>Sexually Exploited<Choose>GBV survivor<Choose>Trafficked/smuggled<Choose>Other |
    And I fill in the 1st "Protection Concern Detail Subform Section" subform with the follow:
      | Details of the concern     | Test Details                 |
      | Intervention needed by     | 12-May-2014                  |
      | Details of Action Taken    | Test Action Details          |
      | Date when action was taken | 12-May-2014                  |
      | Type of Protection Concern | <Select> Migrant             |
      | Period when identified?    | <Select> Registration        |
      | Intervention needed?       | <Select> Urgent Intervention |
      | Has action been taken?     | <Radio> Yes                  |
    And I press "Save"
    And I press the "Edit" button
    And I fill in the following:
      | Protection Concerns | <Choose>Statelessness |
    And I press "Save"
    Then I should see "Case was successfully updated" on the page
    And I should see a value for "Protection Concerns" on the show page with the value of "Sexually Exploited, GBV survivor, Trafficked/smuggled, Statelessness, Other"

  Scenario: As a logged in user, , I want to correctly initialize the chosen in groups
    Given I am logged in as an admin with username "primero_cp" and password "primero"
    When I access "cases page"
    And I press the "Create a New Case" button
    And I press the "Protection Concern" button
    And I fill in the following:
      | Protection Status                                                                 | <Select> Separated                |
      | Urgent Protection Concern?                                                        | <Radio> Yes                       |
      | Risk Level                                                                        | <Select> High                     |
      | Generate follow up reminders?                                                     | <Tickbox>                         |
      | Displacement Status                                                               | <Select> Foreign National         |
      | Protection Concerns     | <Choose>Sexually Exploited<Choose>GBV survivor<Choose>Trafficked/smuggled<Choose>Other      |
      | Disability Type         | <Select> Physical Disability                                                                |
    And I press "Save"
    And I press the "Edit" button
    And I fill in the following:
      | Protection Concerns | <Choose>Statelessness |
    And I press "Save"
    Then I should see "Case was successfully updated" on the page
    And I should see a value for "Protection Status" on the show page with the value of "Separated"
    And I should see a value for "Urgent Protection Concern?" on the show page with the value of "Yes"
    And I should see a value for "Risk Level" on the show page with the value of "High"
    And I should see a value for "Generate follow up reminders?" on the show page with the value of "Yes"
    And I should see a value for "Displacement Status" on the show page with the value of "Foreign National"
    And I should see a value for "Protection Concerns" on the show page with the value of "Sexually Exploited, GBV survivor, Trafficked/smuggled, Statelessness, Other"
    And I should see a value for "Disability Type" on the show page with the value of "Physical Disability"
