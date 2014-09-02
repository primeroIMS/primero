#JIRA PRIMERO-365

@javascript @primero
Feature: Subforms Collapses Fields Incidents Viewing
  As a Primero user, I would like the collapsed and expanded nested subforms to have designated value display
  so that I can distinguish one collapsed form from the other

  Background:
    Given I am logged in as an admin with username "primero" and password "primero"
    When I access "incidents page"
    And I press the "New Incident" button

  Scenario: As a logged in user, I want to verify collapsed fields for killing in viewing
    And I press the "Violations" button
    And I press the "Killing" button
    And I update in the 1st "Killing" subform with the follow:
      | Cause | <Select> IED      |
    And I fill in the 2nd "Killing" subform with the follow:
      | Cause | <Select> Shooting |
    And I press "Save"
    Then I should see "Incident record successfully created" on the page
    And I expanded the 2nd "Killing" subform
    And I should see collapsed the 1st "Killing" subform
    And I should see expanded the 2nd "Killing" subform
    And I should see header in the 1st "Killing" subform within "IED"
    And I should see header in the 2nd "Killing" subform within "Shooting"

  Scenario: As a logged in user, I want to verify collapsed fields for maiming in viewing
    And I press the "Violations" button
    And I press the "Maiming" button
    And I update in the 1st "Maiming" subform with the follow:
      | Cause | <Select> Cluster Munition |
    And I fill in the 2nd "Maiming" subform with the follow:
      | Cause | <Select> Landmines        |
    And I press "Save"
    Then I should see "Incident record successfully created" on the page
    And I expanded the 2nd "Maiming" subform
    And I should see collapsed the 1st "Maiming" subform
    And I should see expanded the 2nd "Maiming" subform
    And I should see header in the 1st "Maiming" subform within "Cluster Munition"
    And I should see header in the 2nd "Maiming" subform within "Landmines"

  Scenario: As a logged in user, I want to verify collapsed fields for recruitment in viewing
    And I press the "Violations" button
    And I press the "Recruitment" button
    And I update in the 1st "Recruitment" subform with the follow:
      | What factors contributed towards the recruitment of the child by the armed group? | <Choose>Conscription<Choose>Lack of Basic Services<Choose>Idealism |
    And I fill in the 2nd "Recruitment" subform with the follow:
      | What factors contributed towards the recruitment of the child by the armed group? | <Choose>Abduction<Choose>Financial Reasons<Choose>Intimidation     |
    And I press "Save"
    Then I should see "Incident record successfully created" on the page
    And I expanded the 2nd "Recruitment" subform
    And I should see collapsed the 1st "Recruitment" subform
    And I should see expanded the 2nd "Recruitment" subform
    And I should see header in the 1st "Recruitment" subform within "Conscription, Lack of Basic Services, Idealism"
    And I should see header in the 2nd "Recruitment" subform within "Abduction, Intimidation, Financial Reason"

  Scenario: As a logged in user, I want to verify collapsed fields for attack on schools in viewing
    And I press the "Violations" button
    And I press the "Attack on Schools" button
    And I update in the 1st "Attack on Schools" subform with the follow:
      | Type of Attack On Site | <Select> Direct Attack on students/teachers |
    And I fill in the 2nd "Attack on Schools" subform with the follow:
      | Type of Attack On Site | <Select> Shelling |
    And I press "Save"
    Then I should see "Incident record successfully created" on the page
    And I expanded the 2nd "Attack on Schools" subform
    And I should see collapsed the 1st "Attack on Schools" subform
    And I should see expanded the 2nd "Attack on Schools" subform
    And I should see header in the 1st "Attack on Schools" subform within "Direct Attack on students/teachers"
    And I should see header in the 2nd "Attack on Schools" subform within "Shelling"

  Scenario: As a logged in user, I want to verify collapsed fields for attack on hospitals in viewing
    And I press the "Violations" button
    And I press the "Attack on Hospitals" button
    And I update in the 1st "Attack on Hospitals" subform with the follow:
      | Type of Attack On Site | <Select> Occupation of Building |
    And I fill in the 2nd "Attack on Hospitals" subform with the follow:
      | Type of Attack On Site | <Select> Physical Destruction |
    And I press "Save"
    Then I should see "Incident record successfully created" on the page
    And I expanded the 2nd "Attack on Hospitals" subform
    And I should see collapsed the 1st "Attack on Hospitals" subform
    And I should see expanded the 2nd "Attack on Hospitals" subform
    And I should see header in the 1st "Attack on Hospitals" subform within "Occupation of Building"
    And I should see header in the 2nd "Attack on Hospitals" subform within "Physical Destruction"

  Scenario: As a logged in user, I want to verify collapsed fields for abduction in viewing
    And I press the "Violations" button
    And I press the "Abduction" button
    And I update in the 1st "Abduction" subform with the follow:
      | Category | <Select> Child Recruitment |
    And I fill in the 2nd "Abduction" subform with the follow:
      | Category | <Select> Sexual Violence |
    And I press "Save"
    Then I should see "Incident record successfully created" on the page
    And I expanded the 2nd "Abduction" subform
    And I should see collapsed the 1st "Abduction" subform
    And I should see expanded the 2nd "Abduction" subform
    And I should see header in the 1st "Abduction" subform within "Child Recruitment"
    And I should see header in the 2nd "Abduction" subform within "Sexual Violence"

  Scenario: As a logged in user, I want to verify collapsed fields for other violation in viewing
    And I press the "Violations" button
    And I press the "Other Violation" button
    And I update in the 1st "Other Violation" subform with the follow:
      | Other Violation Type | <Select> Forced Displacement |
    And I fill in the 2nd "Other Violation" subform with the follow:
      | Other Violation Type | <Select> Denial of Civil Rights |
    And I press "Save"
    Then I should see "Incident record successfully created" on the page
    And I expanded the 2nd "Other Violation" subform
    And I should see collapsed the 1st "Other Violation" subform
    And I should see expanded the 2nd "Other Violation" subform
    And I should see header in the 1st "Other Violation" subform within "Forced Displacement"
    And I should see header in the 2nd "Other Violation" subform within "Denial of Civil Rights"

  Scenario: As a logged in user, I want to verify collapsed fields for individual details in viewing
    And I press the "Individual Details" button
    And I update in the 1st "Individual Details Subform Section" subform with the follow:
      | What is the sex of the child? | <Select> Male |
      | What is the child's age?      | 10            |
    And I fill in the 2nd "Individual Details Subform Section" subform with the follow:
      | What is the sex of the child? | <Select> Female |
      | What is the child's age?      | 15              |
    And I press "Save"
    Then I should see "Incident record successfully created" on the page
    And I expanded the 2nd "Individual Details Subform Section" subform
    And I should see collapsed the 1st "Individual Details Subform Section" subform
    And I should see expanded the 2nd "Individual Details Subform Section" subform
    And I should see header in the 1st "Individual Details Subform Section" subform within "Male - 10"
    And I should see header in the 2nd "Individual Details Subform Section" subform within "Female - 15"

  Scenario: As a logged in user, I want to verify collapsed fields for group details in viewing
    And I press the "Group Details" button
    And I fill in the 1st "Group Details Section" subform with the follow:
      | What was the sex of the group of children involved? | <Select> Mixed        |
      | Into which age band did the children fall?          | <Select> ≥10<15 years |
    And I fill in the 2nd "Group Details Section" subform with the follow:
      | What was the sex of the group of children involved? | <Select> Unknown      |
      | Into which age band did the children fall?          | <Select> ≥15<18 years |
    And I press "Save"
    Then I should see "Incident record successfully created" on the page
    And I expanded the 2nd "Group Details Section" subform
    And I should see collapsed the 1st "Group Details Section" subform
    And I should see expanded the 2nd "Group Details Section" subform
    And I should see header in the 1st "Group Details Section" subform within "Mixed - ≥10<15 years"
    And I should see header in the 2nd "Group Details Section" subform within "Unknown - ≥15<18 years"

  Scenario: As a logged in user, I want to verify collapsed fields for source in viewing
    And I press the "Source" button
    And I fill in the 1st "Source Subform Section" subform with the follow:
      | Type of Source | <Select> Primary |
    And I fill in the 2nd "Source Subform Section" subform with the follow:
      | Type of Source | <Select> Supporting-Testimony |
    And I press "Save"
    Then I should see "Incident record successfully created" on the page
    And I expanded the 2nd "Source Subform Section" subform
    And I should see collapsed the 1st "Source Subform Section" subform
    And I should see expanded the 2nd "Source Subform Section" subform
    And I should see header in the 1st "Source Subform Section" subform within "Primary"
    And I should see header in the 2nd "Source Subform Section" subform within "Supporting-Testimony"

  Scenario: As a logged in user, I want to verify collapsed fields for perpetrator in viewing
    And I press the "Perpetrator" button
    And I fill in the 1st "Perpetrator Subform Section" subform with the follow:
      | To which type of armed force or group did the alleged perpetrator(s) belong? | <Select> National Army   |
    And I fill in the 2nd "Perpetrator Subform Section" subform with the follow:
      | To which type of armed force or group did the alleged perpetrator(s) belong? | <Select> Security Forces |
    And I press "Save"
    Then I should see "Incident record successfully created" on the page
    And I expanded the 2nd "Perpetrator Subform Section" subform
    And I should see collapsed the 1st "Perpetrator Subform Section" subform
    And I should see expanded the 2nd "Perpetrator Subform Section" subform
    And I should see header in the 1st "Perpetrator Subform Section" subform within "National Army"
    And I should see header in the 2nd "Perpetrator Subform Section" subform within "Security Forces"

  Scenario: As a logged in user, I want to verify collapsed fields for sexual violence in viewing
    And I press the "Violations" button
    And I press the "Sexual Violence" button
    And I fill in the 1st "Sexual Violence" subform with the follow:
      | Type of Violence | <Choose>Forced Marriage<Choose>Forced Sterilization |
    And I fill in the 2nd "Sexual Violence" subform with the follow:
      | Type of Violence | <Choose>Mutilation<Choose>Sexual Assault            |
    And I press "Save"
    Then I should see "Incident record successfully created" on the page
    And I expanded the 2nd "Sexual Violence" subform
    And I should see collapsed the 1st "Sexual Violence" subform
    And I should see expanded the 2nd "Sexual Violence" subform
    And I should see header in the 1st "Sexual Violence" subform within "Forced Marriage, Forced Sterilization"
    And I should see header in the 2nd "Sexual Violence" subform within "Sexual Assault, Mutilation"

  Scenario: As a logged in user, I want to verify collapsed fields for denial of humanitarian access in viewing
    And I press the "Violations" button
    And I press the "Denial of Humanitarian Access" button
    And I fill in the 1st "Denial Humanitarian Access" subform with the follow:
      | What method(s) were used to deny humanitarian access? | <Select> Import Restrictions for Goods |
    And I fill in the 2nd "Denial Humanitarian Access" subform with the follow:
      | What method(s) were used to deny humanitarian access? | <Select> Travel Restrictions in Country |
    And I press "Save"
    Then I should see "Incident record successfully created" on the page
    And I expanded the 2nd "Denial Humanitarian Access" subform
    And I should see collapsed the 1st "Denial Humanitarian Access" subform
    And I should see expanded the 2nd "Denial Humanitarian Access" subform
    And I should see header in the 1st "Denial Humanitarian Access" subform within "Import Restrictions for Goods"
    And I should see header in the 2nd "Denial Humanitarian Access" subform within "Travel Restrictions in Country"
