# JIRA PRIMERO-288
# JIRA PRIMERO-403
# JIRA PRIMERO-365

@javascript @primero
Feature: Perpetrator Form
  As a User, I want to indicate who the perpetrator is so that I can add this information to the incident

  Scenario: As a logged in user, I create a new incident
    Given I am logged in as an admin with username "primero_mrm" and password "primero"
    When I access "incidents page"
    And I press the "Create a New Incident" button
    And I press the "Perpetrator" button
    And I fill in the 1st "Perpetrator Subform Section" subform with the follow:
      | Is this the primary perpetrator? | <Radio> Yes |
      | Was the alleged perpetrator(s) a State or Non-State Actor? | <Select> State Actor |
      | To which type of armed force or group did the alleged perpetrator(s) belong? | <Select> Other |
      | Name of the armed force or group? | Some armed force name |
      | Is this a known or unknown Perpetrator? | <Select> Known |
      | Sex of Alleged Perpetrator(s) | <Select> Male |
      | Past GBV by alledged perpetrator? | <Radio>  No |
      | Age group of alleged perpetrator | <Select> 18-25 |
      | Alleged perpetrator relationship with survivor | <Select> No relation |
      | Main occupation of alleged perpetrator (if known) | <Select> Unemployed |
    And I fill in the 2nd "Perpetrator Subform Section" subform with the follow:
      | Is this the primary perpetrator? | <Radio> No |
      | Was the alleged perpetrator(s) a State or Non-State Actor? | <Select> Unknown |
      | To which type of armed force or group did the alleged perpetrator(s) belong? | <Select> Other |
      | Name of the armed force or group? | Some armed force name |
      | Is this a known or unknown Perpetrator? | <Select> Known |
      | Sex of Alleged Perpetrator(s) | <Select> Male |
      | Past GBV by alledged perpetrator? | <Radio>  No |
      | Age group of alleged perpetrator | <Select> 18-25 |
      | Alleged perpetrator relationship with survivor | <Select> Other |
      | Main occupation of alleged perpetrator (if known) | <Select> Unemployed |
    And I press "Save"
    And I should see "Incident record successfully created." on the page
    Then I should see in the 1st "Perpetrator Subform Section" subform with the follow:
      | Is this the primary perpetrator? | Yes |
      | Was the alleged perpetrator(s) a State or Non-State Actor? | State Actor |
      | To which type of armed force or group did the alleged perpetrator(s) belong? | Other |
      | Name of the armed force or group? | Some armed force name |
      | Is this a known or unknown Perpetrator? | Known |
      | Sex of Alleged Perpetrator(s) | Male |
      | Past GBV by alledged perpetrator? |  No |
      | Age group of alleged perpetrator | 18-25 |
      | Alleged perpetrator relationship with survivor | No relation |
      | Main occupation of alleged perpetrator (if known) | Unemployed |
    Then I should see in the 2nd "Perpetrator Subform Section" subform with the follow:
      | Is this the primary perpetrator? | No |
      | Was the alleged perpetrator(s) a State or Non-State Actor? | Unknown |
      | To which type of armed force or group did the alleged perpetrator(s) belong? | Other |
      | Name of the armed force or group? | Some armed force name |
      | Is this a known or unknown Perpetrator? | Known |
      | Sex of Alleged Perpetrator(s) | Male |
      | Past GBV by alledged perpetrator? | No |
      | Age group of alleged perpetrator | 18-25 |
      | Alleged perpetrator relationship with survivor | Other |
      | Main occupation of alleged perpetrator (if known) | Unemployed |