#JIRA PRIMERO-364

@javascript @primero
Feature: Subforms Collapses Fields Cases
  As a Primero user, I would like the collapsed and expanded nested subforms to have designated value display
  so that I can distinguish one collapsed form from the other

  Background:
    Given I am logged in as an admin with username "primero_cp" and password "primero"
    When I access "cases page"
    And I press the "Create a New Case" button

  Scenario: As a logged in user, I want to verify collapsed fields for tracing
    And I press the "Tracing" button
    And I click on "Tracing" in form group "Tracing"
    And I fill in the 1st "Tracing Actions Section" subform with the follow:
      | Date of tracing                                      | 30-May-2014            |
      | Type of action taken                                 | <Select> Photo Tracing |
    And I fill in the 2nd "Tracing Actions Section" subform with the follow:
      | Date of tracing                                      | 30-Jun-2014                 |
      | Type of action taken                                 | <Select> Individual Tracing |
    And I fill in the 1st "Reunification Details Section" subform with the follow:
      | Name of adult child was reunified with               | Verma Webol |
      | Relationship of adult to child                       | Father      |
    And I fill in the 2nd "Reunification Details Section" subform with the follow:
      | Name of adult child was reunified with               | Vivian Nelson |
      | Relationship of adult to child                       | Mother        |
    And I collapsed the 1st "Tracing Actions Section" subform
    And I collapsed the 2nd "Tracing Actions Section" subform
    And I collapsed the 1st "Reunification Details Section" subform
    And I collapsed the 2nd "Reunification Details Section" subform
    Then I should see header in the 1st "Tracing Actions Section" subform within "Photo Tracing - 30-May-2014"
    And I should see header in the 2nd "Tracing Actions Section" subform within "Individual Tracing - 30-Jun-2014"
    And I should see header in the 1st "Reunification Details Section" subform within "Father - Verma Webol"
    And I should see header in the 2nd "Reunification Details Section" subform within "Mother - Vivian Nelson"

  Scenario: As a logged in user, I want to verify collapsed fields for followup
    And I press the "Services / Follow Up" button
    And I click on "Follow Up" in form group "Services / Follow Up"
    And I fill in the 1st "Followup Subform Section" subform with the follow:
      | Follow up date                                              | 12-Jun-2014                              |
      | Type of service                                             | <Select> Health/Medical Service          |
      | Type of assessment                                          | <Select> Medical Intervention Assessment |
    And I fill in the 2nd "Followup Subform Section" subform with the follow:
      | Follow up date                                              | 15-Jun-2014                               |
      | Type of service                                             | <Select> Family Reunification Service     |
      | Type of assessment                                          | <Select> Personal Intervention Assessment |
    And I collapsed the 1st "Followup Subform Section" subform
    And I collapsed the 2nd "Followup Subform Section" subform
    Then I should see header in the 1st "Followup Subform Section" subform within "Health/Medical Service - Medical Intervention Assessment - 12-Jun-2014"
    And I should see header in the 2nd "Followup Subform Section" subform within "Family Reunification Service - Personal Intervention Assessment - 15-Jun-2014"

  Scenario: As a logged in user, I want to verify collapsed fields for family details
    And I press the "Family / Partner Details" button
    And I click on "Family Details" in form group "Family / Partner Details"
    And I fill in the 1st "Family Details Section" subform with the follow:
      |Name                               | Socorro         |
      |How are they related to the child? | <Select> Mother |
    And I fill in the 2st "Family Details Section" subform with the follow:
      |Name                               | Pedro           |
      |How are they related to the child? | <Select> Father |
    And I collapsed the 1st "Family Details Section" subform
    And I collapsed the 2nd "Family Details Section" subform
    Then I should see header in the 1st "Family Details Section" subform within "Mother - Socorro"
    And I should see header in the 2nd "Family Details Section" subform within "Father - Pedro"

  Scenario: As a logged in user, I want to verify collapsed fields for services
    And I press the "Services / Follow Up" button
    And I click on "Services" in form group "Services / Follow Up"
    And I fill in the 1st "Services Section" subform with the follow:
      | Type of Service  | <Select> Safehouse      |
      | Appointment Date | 30-May-2014             |
    And I fill in the 2nd "Services Section" subform with the follow:
      | Type of Service  | <Select> Health/Medical |
      | Appointment Date | 30-Jun-2014             |
    And I collapsed the 1st "Services Section" subform
    And I collapsed the 2nd "Services Section" subform
    Then I should see header in the 1st "Services Section" subform within "Safehouse - 30-May-2014"
    And I should see header in the 2nd "Services Section" subform within "Health/Medical - 30-Jun-2014"

  Scenario: As a logged in user, I want to verify collapsed fields for child's wishes
    And I press the "Tracing" button
    And I press the "Child's Wishes" button
    And I fill in the 1st "Child Preferences Section" subform with the follow:
      | Person(s) child wishes to locate                         | Juan                   |
      | Preference of the child to be relocated with this person | <Select> Second choice |
    And I fill in the 2nd "Child Preferences Section" subform with the follow:
      | Person(s) child wishes to locate                         | María                 |
      | Preference of the child to be relocated with this person | <Select> First choice |
    And I collapsed the 1st "Child Preferences Section" subform
    And I collapsed the 2nd "Child Preferences Section" subform
    Then I should see header in the 1st "Child Preferences Section" subform within "Second choice - Juan"
    And I should see header in the 2nd "Child Preferences Section" subform within "First choice - María"

  Scenario: As a logged in user, I want to verify collapsed fields for verification
    And I press the "Tracing" button
    And I press the "Verification" button
    And I fill in the 1st "Verification Subform Section" subform with the follow:
      | Inquirer's Name | Mr. Smith        |
      | Relationship    | <Select> Father  |
    And I fill in the 2nd "Verification Subform Section" subform with the follow:
      | Inquirer's Name | John Snow        |
      | Relationship    | <Select> Brother |
    And I collapsed the 1st "Verification Subform Section" subform
    And I collapsed the 2nd "Verification Subform Section" subform
    Then I should see header in the 1st "Verification Subform Section" subform within "Father - Mr. Smith"
    And I should see header in the 2nd "Verification Subform Section" subform within "Brother - John Snow"

  Scenario: As a logged in user, I want to verify collapsed fields for protection concern
    And I press the "Assessment" button
    And I click on "Protection Concern Details" in form group "Assessment"
    And I fill in the 1st "Protection Concern Detail Subform Section" subform with the follow:
      | Type of Protection Concern | <Select> Migrant           |
    And I fill in the 2nd "Protection Concern Detail Subform Section" subform with the follow:
      | Type of Protection Concern | <Select> Arrested/Detained |
    And I collapsed the 1st "Protection Concern Detail Subform Section" subform
    And I collapsed the 2nd "Protection Concern Detail Subform Section" subform
    Then I should see header in the 1st "Protection Concern Detail Subform Section" subform within "Migrant"
    And I should see header in the 2nd "Protection Concern Detail Subform Section" subform within "Arrested/Detained"
