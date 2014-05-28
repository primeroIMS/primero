# JIRA PRIMERO-42
# JIRA PRIMERO-73

@javascript @primero
Feature: Basic Identity Form
  As an administrator, I want to be able to create a case with a auto generated case id, short id, and registration date.
  I also want the case status to default to open leaving the option to set it another status by the user.
  
  Background:
    Given I am logged in as an admin with username "primero" and password "primero"
    When I access "cases page"
    And I press the "Create a New Case" button


  Scenario: As a logged in user, I create a case with some values in the basic identity form    
    Then I should see the following fields:
    | Case ID           |
    | Registration Date |
    | Agency            |
    | Agency Telephone  |
    | Other Agency ID         |
    | Other Agency Name       |
    | ICRC Ref No.      |
    | RC ID No.         |
    | UNHCR ID          |
    | Protection Status |
    | Urgent Protection Concern? |
    | Survivor Code |
    | Name |
    | Nickname |
    | Other Name |
    | Sex |
    | Age |
    | Date of Birth |
    | Estimated |
    | List Details of any documents carried by the child |
    | Current Civil/Marital Status |
    | Occupation |
    | Distinguishing Physical Characteristics |
    | Displacement Status |
    | Disability Type |
    | Nationality |
    | Place of Birth |
    | Birth Country |
    | Country of Origin |
    | Current Address |
    | Landmark |
    | Is this address permanent? |
    | Location |
    | Telephone |
    | Last Address |
    | Last Landmark |
    | Last Location |
    | Last Address Telephone |
    | Ethnic Group / Tribe |
    | Sub Ethnicity 1 |
    | Sub Ethnicity 2 |
    | Language |
    | Religion |
    | Arrival Date |
    | Interviewer Name |
    | Interviewer Position |
    | Interviewer Agency |
    | Interview Address |
    | Interview Landmark |
    | Interview Location |
    | Information Obtained From |
    | Other Interview Source |
    | Has the child been interviewed by another organization? |
    | Reference No. given to child by other organization |
    | Database Operator |
    | Social Worker |
    | Registration Address |
    | Number of children and other dependents |
    | Birth Location |
    | Camp |
    | Permanent Location |
    | Permanent Address |
    | Section Number |
    | Contact Number |
    | UN Number |
    | Status |
    | Survivor Name |
    | Is the client an Unaccompanied Minor, Separated Child, or Other Vulnerable Child? |
    | Name(s) given to child after separation? |
    

    And I fill in the following:
      | Name              | Tiki Thomas Taliaferro               |
      | Age               | 22                                   |
    And I select "Male" from "Sex"
    And I press "Save"
    Then I should see "Case record successfully created" on the page
    And I should see a value for "Case ID" on the show page
    And I should see a value for "Registration Date" on the show page with the value of "today's date"
    And I should see a value for "Agency ID" on the show page
    And I should see a value for "Agency Name" on the show page
    And I should see a value for "Age" on the show page with the value of "22"

  Scenario: As a logged in user, I should be able to reset the basic identity form 
    And I fill in the following:
      | Name              | Tiki Thomas Taliaferro               |
      | Age               | 22                                   |
    And I select "Male" from "Sex"
    And I press "Cancel"
    And I click OK in the browser popup
    Then I should be on the new case page
    And I should not see "Case record successfully created" on the page
    And the "Name" field should not contain "Tiki Thomas Taliaferro"
    And the "Age" field should not contain "22"
    And the "Sex" field should not contain "Male"
    
  Scenario: As a logged in user, I should be able to cancel out of a reset of the basic identity form 
    And I fill in the following:
      | Name              | Tiki Thomas Taliaferro               |
      | Age               | 22                                   |
    And I select "Male" from "Sex"
    And I press "Cancel"
    And I click Cancel in the browser popup
    Then I should be on the new case page
    And I should not see "Case record successfully created" on the page
    And the "Name" field should contain "Tiki Thomas Taliaferro"
    And the "Age" field should contain "22"
    And the "Sex" field should contain "Male"

  Scenario: As a logged in user, I create a case with no values in the basic identity form
    And I press the "Photos and Audio" button
    And I attach a photo "capybara_features/resources/jorge.jpg"
    And I press "Save"
    Then I should see "Case record successfully created" on the page
    And I should see a value for "Case ID" on the show page
    And I should see a value for "Registration Date" on the show page with the value of "today's date"