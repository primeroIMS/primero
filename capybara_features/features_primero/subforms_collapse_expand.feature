#JIRA PRIMERO-160
#JIRA PRIMERO-358
# JIRA PRIMERO-353
# JIRA PRIMERO-363
#JIRA PRIMERO-365

@javascript @primero
Feature: Subforms Collapse Expand
  As a User, I want to collapse or expand subforms to reduce the amount of information displayed

  Background:
    Given I am logged in as an admin with username "primero" and password "primero"
    And I update collapsed fields "family_details_section" subform with:
      | relation_name          |
      | relation               |
      | relation_is_caregiver  |
      | relation_death_details |
      | relation_age           |
      | relation_language      |
    And I update collapsed fields "followup_subform_section" subform with:
      | followup_date          |
      | reason_child_not_seen  |
    When I access "cases page"
    And I press the "Create a New Case" button
    And I press the "Family / Partner Details" button
    And I press the "Family Details" button
    And I add a "Family Details Section" subform
    And I add a "Family Details Section" subform

  Scenario: As a logged in user and add a subform, I should see expanded the subform
    Then I should see expanded the 1st "Family Details Section" subform
    And I should see expanded the 2nd "Family Details Section" subform

  Scenario: As a logged in user and edit a subform, I should see collapsed the subform
    And I press "Save"
    And I press the "Edit" button
    Then I should see collapsed the 1st "Family Details Section" subform
    And I should see collapsed the 2nd "Family Details Section" subform

  Scenario: As a logged in user and collapse subform, All fields should be hidden
    And I collapsed the 1st "Family Details Section" subform
    Then I should see collapsed the 1st "Family Details Section" subform
    And I should see expanded the 2nd "Family Details Section" subform

  Scenario: As a logged in user and expand subform, All fields should be visible
    And I press "Save"
    And I press the "Edit" button
    And I expanded the 2nd "Family Details Section" subform
    Then I should see collapsed the 1st "Family Details Section" subform
    And I should see expanded the 2nd "Family Details Section" subform

  Scenario: As a logged in user and are collapsed all subform, I should be able to add a new subform
    And I press "Save"
    And I press the "Edit" button
    And I add a "Family Details Section" subform
    And I press "Save"
    And I press the "Edit" button
    Then I should see collapsed the 1st "Family Details Section" subform
    And I should see collapsed the 2nd "Family Details Section" subform
    And I should see collapsed the 3rd "Family Details Section" subform

  Scenario: As a logged in user and are expanded all subform, I should be able to add a new subform
    And I press "Save"
    And I press the "Edit" button
    And I expanded the 1st "Family Details Section" subform
    And I expanded the 2nd "Family Details Section" subform
    And I add a "Family Details Section" subform
    And I press "Save"
    And I press the "Edit" button
    Then I should see collapsed the 1st "Family Details Section" subform
    And I should see collapsed the 2nd "Family Details Section" subform
    And I should see collapsed the 3rd "Family Details Section" subform

  Scenario: As a logged in user and collapsed new subform family details, I should see empty values
    And I collapsed the 1st "Family Details Section" subform
    And I collapsed the 2nd "Family Details Section" subform
    Then I should see header in the 1st "Family Details Section" subform within ""
    And I should see header in the 2nd "Family Details Section" subform within ""

  Scenario: As a logged in user and collapsed new subform followup, I should see empty values
    And I press the "Services / Follow Up" button
    And I click on "Follow Up" in form group "Services / Follow Up"
    And I add a "Followup Subform Section" subform
    And I collapsed the 1st "Followup Subform Section" subform
    And I should see header in the 1st "Followup Subform Section" subform within ""

  Scenario: As a logged in user and change fields value in family details, I should see the changes in the static text
    And I update in the 1st "Family Details Section" subform with the follow:
      |Name                               | Tom                |
      |How are they related to the child? | <Select> Uncle     |
      |Is this person the caregiver?      | <Radio> Yes        |
      |If dead, please provide details    | No Dead Notes      |
      |Age                                | 39                 |
      |Language                           | <Choose>Language 1 |
    And I update in the 2nd "Family Details Section" subform with the follow:
      |Name                               | Mary               |
      |How are they related to the child? | <Select> Aunt      |
      |Is this person the caregiver?      | <Radio> No         |
      |If dead, please provide details    | No Other Dead Notes|
      |Age                                | 41                 |
      |Language                           | <Choose>Language 2 |
    And I collapsed the 1st "Family Details Section" subform
    And I collapsed the 2nd "Family Details Section" subform
    Then I should see header in the 1st "Family Details Section" subform within "Tom - Uncle - Yes - No Dead Notes - 39 - Language 1"
    And I should see header in the 2nd "Family Details Section" subform within "Mary - Aunt - No - No Other Dead Notes - 41 - Language 2"

  Scenario: As a logged in user and change fields value in followup, I should see the changes in the subform header
    And I press the "Services / Follow Up" button
    And I click on "Follow Up" in form group "Services / Follow Up"
    And I add a "Followup Subform Section" subform
    And I update in the 1st "Followup Subform Section" subform with the follow:
      | Followup date | 21-Jul-2003                           |
      | If not, why?  | <Checkbox> Visiting Friends/Relatives |
    And I collapsed the 1st "Followup Subform Section" subform
    Then I should see header in the 1st "Followup Subform Section" subform within "21-Jul-2003 - Visiting Friends/Relatives"

  Scenario: As a logged in user and already created a case, I should be able to modify the subform
    And I press "Save"
    And I press the "Edit" button
    And I expanded the 1st "Family Details Section" subform
    And I expanded the 2nd "Family Details Section" subform
    And I update in the 1st "Family Details Section" subform with the follow:
      |Name                               | Tom                |
      |How are they related to the child? | <Select> Uncle     |
      |Is this person the caregiver?      | <Radio> Yes        |
      |If dead, please provide details    | No Dead Notes      |
      |Age                                | 39                 |
      |Language                           | <Choose>Language 1 |
    And I update in the 2nd "Family Details Section" subform with the follow:
      |Name                               | Mary               |
      |How are they related to the child? | <Select> Aunt      |
      |Is this person the caregiver?      | <Radio> No         |
      |If dead, please provide details    | No Other Dead Notes|
      |Age                                | 41                 |
      |Language                           | <Choose>Language 2 |
    And I press "Save"
    Then I should see "Case was successfully updated" on the page
    And I should see in the 1st "Family Details Section" subform with the follow:
      |Name                               | Tom           |
      |How are they related to the child? | Uncle         |
      |Is this person the caregiver?      | Yes           |
      |If dead, please provide details    | No Dead Notes |
      |Age                                | 39            |
      |Language                           | Language 1    |
    And I should see in the 2nd "Family Details Section" subform with the follow:
      |Name                               | Mary                |
      |How are they related to the child? | Aunt                |
      |Is this person the caregiver?      | No                  |
      |If dead, please provide details    | No Other Dead Notes |
      |Age                                | 41                  |
      |Language                           | Language 2          |
