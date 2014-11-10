# JIRA PRIMERO-288
# JIRA PRIMERO-403
# JIRA PRIMERO-365
# JIRA PRIMERO-564
# JIRA PRIMERO-726
# JIRA PRIMERO-736

@javascript @primero
Feature: Perpetrator Form
  As a User, I want to indicate who the perpetrator is so that I can add this information to the incident

  Scenario: As a logged in user, I create a new incident
    Given I am logged in as an admin with username "primero_mrm" and password "primero"
    And the following lookups exist in the system:
      | name                     | lookup_values                                                                                             |
      | armed_force_group_type   | National Army, Security Forces, International Forces, Police Forces, Para-Military Forces, Unknown, Other |
      | armed_force_group_name   | Armed Force or Group 1, Armed Force or Group 2, Armed Force or Group 3                                    |
    When I access "incidents page"
    And I press the "New Incident" button
    And I press the "Perpetrator" button
    And the "Main occupation of alleged perpetrator (if known)" dropdown should have the following options:
      | label        | selected? |
      | (Select...)  | yes       |
      | Other        | no        |
      | Unemployed   | no        |
      | Unknown      | no        |
      | Occupation 1 | no        |
      | Occupation 2 | no        |
      | Occupation 3 | no        |
      | Occupation 4 | no        |
      | Occupation 5 | no        |
    And I fill in the 1st "Perpetrator Subform Section" subform with the follow:
      | Is this the primary perpetrator? | <Radio> Yes |
      | Was the alleged perpetrator(s) a State or Non-State Actor? | <Select> State Actor |
      | To which type of armed force or group did the alleged perpetrator(s) belong? | <Select> Other |
      | Name of the armed force or group? | <Select> Armed Force or Group 2 |
      | Is this a known or unknown Perpetrator? | <Select> Known |
      | Sex of Alleged Perpetrator(s) | <Radio> Male |
      | Past GBV by alledged perpetrator? | <Radio>  No |
      | Age group of alleged perpetrator | <Choose>18-25 |
      | Alleged perpetrator relationship with survivor | <Select> No relation |
      | Main occupation of alleged perpetrator (if known) | <Select> Unemployed |
    And I fill in the 2nd "Perpetrator Subform Section" subform with the follow:
      | Is this the primary perpetrator? | <Radio> No |
      | Was the alleged perpetrator(s) a State or Non-State Actor? | <Select> Unknown |
      | To which type of armed force or group did the alleged perpetrator(s) belong? | <Select> Other |
      | Name of the armed force or group? | <Select> Armed Force or Group 3 |
      | Is this a known or unknown Perpetrator? | <Select> Known |
      | Sex of Alleged Perpetrator(s) | <Radio> Male |
      | Past GBV by alledged perpetrator? | <Radio>  No |
      | Age group of alleged perpetrator | <Choose>18-25 |
      | Alleged perpetrator relationship with survivor | <Select> Other |
      | Main occupation of alleged perpetrator (if known) | <Select> Unemployed |
    And I press "Save"
    And I should see a success message for new Incident
    Then I should see in the 1st "Perpetrator Subform Section" subform with the follow:
      | Is this the primary perpetrator? | Yes |
      | Was the alleged perpetrator(s) a State or Non-State Actor? | State Actor |
      | To which type of armed force or group did the alleged perpetrator(s) belong? | Other |
      | Name of the armed force or group? | Armed Force or Group 2 |
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
      | Name of the armed force or group? | Armed Force or Group 3 |
      | Is this a known or unknown Perpetrator? | Known |
      | Sex of Alleged Perpetrator(s) | Male |
      | Past GBV by alledged perpetrator? | No |
      | Age group of alleged perpetrator | 18-25 |
      | Alleged perpetrator relationship with survivor | Other |
      | Main occupation of alleged perpetrator (if known) | Unemployed |