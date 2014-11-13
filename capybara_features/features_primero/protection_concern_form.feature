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
# JIRA PRIMERO-632
# JIRA PRIMERO-736

@javascript @primero
Feature: Protection Concern Form
  As an administrator, I want to enter information related to protection concerns
  so that we can know the vulnerabilities of the child.

   Background:
    Given I am logged in as an admin with username "primero_cp" and password "primero"
    And the following lookups exist in the system:
      | name                | lookup_values            |
      | risk_level          | High, Medium, Low        |
      | protection_status   | Unaccompanied, Separated |
      | displacement_status | Foreign National         |
    When I access "cases page"
    And I press the "New Case" button
    And I press the "Protection Concern" button
    And I fill in the following:
      | Protection Status                                                                 | <Select> Separated                |
      | Urgent Protection Concern?                                                        | <Radio> Yes                       |
      | Risk Level                                                                        | <Select> High                     |
      | Displacement Status                                                               | <Select> Foreign National         |
      | Generate follow up reminders?                                                     | <Tickbox>                         |
      | Protection Concerns     | <Choose>Sexually Exploited<Choose>GBV survivor<Choose>Trafficked/smuggled<Choose>Other      |
      | Disability Type         | <Select> Physical Disability                                                                |
    And I press "Save"

  Scenario: As a logged in user, I create a case by entering something in every field in the protection concern form
    Then I should see a success message for new Case
    And I should see a value for "Protection Status" on the show page with the value of "Separated"
    And I should see a value for "Urgent Protection Concern?" on the show page with the value of "Yes"
    And I should see a value for "Risk Level" on the show page with the value of "High"
    And I should see a value for "Generate follow up reminders?" on the show page with the value of "Yes"
    And I should see a value for "Displacement Status" on the show page with the value of "Foreign National"
    And I should see a value for "Protection Concerns" on the show page with the value of "Sexually Exploited, GBV survivor, Trafficked/smuggled, Other"
    And I should see a value for "Disability Type" on the show page with the value of "Physical Disability"

  Scenario: As a logged in user, I want to correctly initialize the chosen in groups
    And I press the "Edit" button
    And I fill in the following:
      | Protection Concerns | <Choose>Statelessness |
    And I press "Save"
    Then I should see a success message for updated Case
    And I should see a value for "Protection Concerns" on the show page with the value of "Sexually Exploited, GBV survivor, Trafficked/smuggled, Statelessness, Other"

  Scenario: As a logged in user, I want to check that values keep unchanged if user did not explicitly changed
    And I press the "Edit" button
    And I press "Save"
    Then I should see a success message for updated Case
    And I should see a value for "Protection Status" on the show page with the value of "Separated"
    And I should see a value for "Urgent Protection Concern?" on the show page with the value of "Yes"
    And I should see a value for "Risk Level" on the show page with the value of "High"
    And I should see a value for "Generate follow up reminders?" on the show page with the value of "Yes"
    And I should see a value for "Displacement Status" on the show page with the value of "Foreign National"
    And I should see a value for "Protection Concerns" on the show page with the value of "Sexually Exploited, GBV survivor, Trafficked/smuggled, Other"
    And I should see a value for "Disability Type" on the show page with the value of "Physical Disability"
