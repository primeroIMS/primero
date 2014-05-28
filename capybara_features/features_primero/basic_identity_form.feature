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


  Scenario: As a logged in user, I create a case by entering something in every field in the basic identity form    
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
      | Agency Telephone  | 704-555-1212                         |
      | Other Agency ID   | ABC12345                             |
      | Other Agency Name | Test Agency                          |
      | ICRC Ref No.      | 131313                               |
      | RC ID No.         | 141414                               |
      | UNHCR ID          | AAA000                               |
      | Survivor Code     | BBB111                               |
      | Nickname          | Tommy                                |
      | Other Name        | Bob                                  |
      | Date of Birth     | 04/May/1992                          |
      | List Details of any documents carried by the child | Driver's License, Passport, Birth Certificate |
      | Occupation        | Farmer                               |
      | Distinguishing Physical Characteristics            | Really tall, dark hair, brown eyes            |
      | Place of Birth    | Boston                               |
      | Current Address   | 111 Main St, Davidson NC, 28036      |
      | Landmark          | Old Oak Tree                         |
      | Location          | Southern Region                      |
      | Telephone         | 336-555-1313                         |
      | Last Address      | 222 1st Ave, Mooresville NC, 28117   |
      | Last Landmark     | Roller Coaster Hill                  |
      | Last Location     | Northwest                            |
      | Last Address Telephone     | 828-555-1414                |
      | Ethnic Group / Tribe       | Swahili                     |
      | Arrival Date      | 13/Apr/2014                          |
      | Interviewer Name  | Fred Jones                           |
      | Interviewer Position | Field Worker                      |
      | Interview Address    | 333 Elm St, Wilkesboro NC, 28697  |
      | Interview Landmark   | By the river                      |
      | Interview Location   | Midwest                           |
      | Other Interview Source   | Doctor                           |
      | Reference No. given to child by other organization   | CCC222                          |
      | Registration Address    | 444 10th St, N. Wilkesboro NC, 28659  |
      | Number of children and other dependents   | 5                           |
      | Camp   | Test Camp                           |
      | Permanent Location   | Southwest                           |
      | Permanent Address    | 555 Clingman Rd, Ronda NC, 28670          |
      | Section Number   | DDD333                          |
      | Contact Number         | 910-555-1515                         |
      | UN Number   | EEE444                          |
      | Survivor Name   | Norville Rogers                          |
      
    And I select "Male" from "Sex"
    And I select "Save the Children" from "Agency"
    And I select "Separated" from "Protection Status"
    And I select "Yes" from "Urgent Protection Concern?"
    And I select "No" from "Estimated"
    And I select "Married/Cohabitating" from "Current Civil/Marital Status"
    And I select "Foreign National" from "Displacement Status"
    And I select "Physical Disability" from "Disability Type"
    And I select "Ugandan" from "Nationality"
    And I select "Country1" from "Birth Country"
    And I select "Country2" from "Country of Origin"
    And I select "Yes" from "Is this address permanent?"
    And I select "Clan 1" from "Sub Ethnicity 1"
    And I select "Clan 2" from "Sub Ethnicity 2"
    And I select "Agency 4" from "Interviewer Agency"
    And I select "GBV Survivor" from "Information Obtained From"
    And I select "Yes" from "Has the child been interviewed by another organization?"
    And I select "Operator 1" from "Database Operator"
    And I select "Social Worker 1" from "Social Worker"
    And I select "Community" from "Status"
    And I select "No" from "Name(s) given to child after separation?"
    
    And I check "English" for "Language"
    And I check "French" for "Language"
    And I check "Christianity" for "Religion"
    And I check "Unaccompanied Minor" 
    And I check "Separated Child"
    And I check "Other Vulnerable Child"
    
    And I press "Save"
    Then I should see "Case record successfully created" on the page
    And I should see a value for "Case ID" on the show page
    And I should see a value for "Registration Date" on the show page with the value of "today's date"
    And I should see a value for "Agency" on the show page with the value of "Save the Children"
    And I should see a value for "Agency Telephone" on the show page with the value of "704-555-1212"    
    And I should see a value for "Other Agency ID" on the show page with the value of "ABC12345"
    And I should see a value for "Other Agency Name" on the show page with the value of "Test Agency"
    And I should see a value for "ICRC Ref No." on the show page with the value of "131313"
    And I should see a value for "RC ID No." on the show page with the value of "141414"
    And I should see a value for "UNHCR ID" on the show page with the value of "AAA000"
    And I should see a value for "Protection Status" on the show page with the value of "Separated"
    And I should see a value for "Urgent Protection Concern?" on the show page with the value of "Yes"
    And I should see a value for "Survivor Code" on the show page with the value of "BBB111"    
    And I should see a value for "Name" on the show page with the value of "Tiki Thomas Taliaferro"
    And I should see a value for "Nickname" on the show page with the value of "Tommy"
    And I should see a value for "Other Name" on the show page with the value of "Bob"
    And I should see a value for "Sex" on the show page with the value of "Male"
    And I should see a value for "Age" on the show page with the value of "22"
    And I should see a value for "Date of Birth" on the show page with the value of "04/May/1992"
    And I should see a value for "Estimated" on the show page with the value of "No"
    And I should see a value for "List Details of any documents carried by the child" on the show page with the value of "Driver's License, Passport, Birth Certificate"
    And I should see a value for "Current Civil/Marital Status" on the show page with the value of "Married/Cohabitating"
    And I should see a value for "Occupation" on the show page with the value of "Farmer"
    And I should see a value for "Distinguishing Physical Characteristics" on the show page with the value of "Really tall, dark hair, brown eyes"
    And I should see a value for "Displacement Status" on the show page with the value of "Foreign National"
    And I should see a value for "Disability Type" on the show page with the value of "Physical Disability"
    And I should see a value for "Nationality" on the show page with the value of "Ugandan"
    And I should see a value for "Place of Birth" on the show page with the value of "Boston"
    And I should see a value for "Birth Country" on the show page with the value of "Country1"
    And I should see a value for "Country of Origin" on the show page with the value of "Country2"
    And I should see a value for "Current Address" on the show page with the value of "111 Main St, Davidson NC, 28036"
    And I should see a value for "Landmark" on the show page with the value of "Old Oak Tree"
    And I should see a value for "Is this address permanent?" on the show page with the value of "Yes"
    And I should see a value for "Location" on the show page with the value of "Southern Region"
    And I should see a value for "Telephone" on the show page with the value of "336-555-1313"
    And I should see a value for "Last Address" on the show page with the value of "222 1st Ave, Mooresville NC, 28117"
    And I should see a value for "Last Landmark" on the show page with the value of "Roller Coaster Hill"
    And I should see a value for "Last Location" on the show page with the value of "Northwest"
    And I should see a value for "Last Address Telephone" on the show page with the value of "828-555-1414"
    And I should see a value for "Ethnic Group / Tribe" on the show page with the value of "Swahili"
    And I should see a value for "Sub Ethnicity 1" on the show page with the value of "Clan 1"
    And I should see a value for "Sub Ethnicity 2" on the show page with the value of "Clan 2"    
    And I should see a value for "Language" on the show page with the value of "English, French"
    And I should see a value for "Religion" on the show page with the value of "Christianity"
    And I should see a value for "Arrival Date" on the show page with the value of "13/Apr/2014"
    And I should see a value for "Interviewer Name" on the show page with the value of "Fred Jones"
    And I should see a value for "Interviewer Position" on the show page with the value of "Field Worker"
    And I should see a value for "Interviewer Agency" on the show page with the value of "Agency 4"
    And I should see a value for "Interview Address" on the show page with the value of "333 Elm St, Wilkesboro NC, 28697"
    And I should see a value for "Interview Landmark" on the show page with the value of "By the river"
    And I should see a value for "Interview Location" on the show page with the value of "Midwest"
    And I should see a value for "Information Obtained From" on the show page with the value of "GBV Survivor"
    And I should see a value for "Other Interview Source" on the show page with the value of "Doctor"
    And I should see a value for "Has the child been interviewed by another organization?" on the show page with the value of "Yes"
    And I should see a value for "Reference No. given to child by other organization" on the show page with the value of "CCC222"
    And I should see a value for "Database Operator" on the show page with the value of "Operator 1"
    And I should see a value for "Social Worker" on the show page with the value of "Social Worker 1"
    And I should see a value for "Registration Address" on the show page with the value of "444 10th St, N. Wilkesboro NC, 28659"
    And I should see a value for "Number of children and other dependents" on the show page with the value of "5"
    And I should see a value for "Camp" on the show page with the value of "Test Camp"
    And I should see a value for "Permanent Location" on the show page with the value of "Southwest"
    And I should see a value for "Permanent Address" on the show page with the value of "555 Clingman Rd, Ronda NC, 28670"
    And I should see a value for "Section Number" on the show page with the value of "DDD333"
    And I should see a value for "Contact Number" on the show page with the value of "910-555-1515"
    And I should see a value for "UN Number" on the show page with the value of "EEE444"
    And I should see a value for "Status" on the show page with the value of "Community"
    And I should see a value for "Survivor Name" on the show page with the value of "Norville Rogers"
    And I should see a value for "Is the client an Unaccompanied Minor, Separated Child, or Other Vulnerable Child?" on the show page with the value of "Unaccompanied Minor, Separated Child, Other Vulnerable Child"
    And I should see a value for "Name(s) given to child after separation?" on the show page with the value of "No"
    
  Scenario: As a logged in user, I create a case without entering anything in any field in the basic identity form 
    And I press "Save"
    Then I should see "Case record successfully created" on the page
    And I should see a value for "Case ID" on the show page
    And I should see a value for "Registration Date" on the show page with the value of "today's date"
    And I should see a value for "Agency" on the show page with the value of ""
    And I should see a value for "Agency Telephone" on the show page with the value of ""    
    And I should see a value for "Other Agency ID" on the show page with the value of ""
    And I should see a value for "Other Agency Name" on the show page with the value of ""
    And I should see a value for "ICRC Ref No." on the show page with the value of ""
    And I should see a value for "RC ID No." on the show page with the value of ""
    And I should see a value for "UNHCR ID" on the show page with the value of ""
    And I should see a value for "Protection Status" on the show page with the value of ""
    And I should see a value for "Urgent Protection Concern?" on the show page with the value of ""
    And I should see a value for "Survivor Code" on the show page with the value of ""    
    And I should see a value for "Name" on the show page with the value of ""
    And I should see a value for "Nickname" on the show page with the value of ""
    And I should see a value for "Other Name" on the show page with the value of ""
    And I should see a value for "Sex" on the show page with the value of ""
    And I should see a value for "Age" on the show page with the value of ""
    And I should see a value for "Date of Birth" on the show page with the value of ""
    And I should see a value for "Estimated" on the show page with the value of ""
    And I should see a value for "List Details of any documents carried by the child" on the show page with the value of ""
    And I should see a value for "Current Civil/Marital Status" on the show page with the value of ""
    And I should see a value for "Occupation" on the show page with the value of ""
    And I should see a value for "Distinguishing Physical Characteristics" on the show page with the value of ""
    And I should see a value for "Displacement Status" on the show page with the value of ""
    And I should see a value for "Disability Type" on the show page with the value of ""
    And I should see a value for "Nationality" on the show page with the value of ""
    And I should see a value for "Place of Birth" on the show page with the value of ""
    And I should see a value for "Birth Country" on the show page with the value of ""
    And I should see a value for "Country of Origin" on the show page with the value of ""
    And I should see a value for "Current Address" on the show page with the value of ""
    And I should see a value for "Landmark" on the show page with the value of ""
    And I should see a value for "Is this address permanent?" on the show page with the value of ""
    And I should see a value for "Location" on the show page with the value of ""
    And I should see a value for "Telephone" on the show page with the value of ""
    And I should see a value for "Last Address" on the show page with the value of ""
    And I should see a value for "Last Landmark" on the show page with the value of ""
    And I should see a value for "Last Location" on the show page with the value of ""
    And I should see a value for "Last Address Telephone" on the show page with the value of ""
    And I should see a value for "Ethnic Group / Tribe" on the show page with the value of ""
    And I should see a value for "Sub Ethnicity 1" on the show page with the value of ""
    And I should see a value for "Sub Ethnicity 2" on the show page with the value of ""    
    And I should see a value for "Language" on the show page with the value of ""
    And I should see a value for "Religion" on the show page with the value of ""
    And I should see a value for "Arrival Date" on the show page with the value of ""
    And I should see a value for "Interviewer Name" on the show page with the value of ""
    And I should see a value for "Interviewer Position" on the show page with the value of ""
    And I should see a value for "Interviewer Agency" on the show page with the value of ""
    And I should see a value for "Interview Address" on the show page with the value of ""
    And I should see a value for "Interview Landmark" on the show page with the value of ""
    And I should see a value for "Interview Location" on the show page with the value of ""
    And I should see a value for "Information Obtained From" on the show page with the value of ""
    And I should see a value for "Other Interview Source" on the show page with the value of ""
    And I should see a value for "Has the child been interviewed by another organization?" on the show page with the value of ""
    And I should see a value for "Reference No. given to child by other organization" on the show page with the value of ""
    And I should see a value for "Database Operator" on the show page with the value of ""
    And I should see a value for "Social Worker" on the show page with the value of ""
    And I should see a value for "Registration Address" on the show page with the value of ""
    And I should see a value for "Number of children and other dependents" on the show page with the value of ""
    And I should see a value for "Camp" on the show page with the value of ""
    And I should see a value for "Permanent Location" on the show page with the value of ""
    And I should see a value for "Permanent Address" on the show page with the value of ""
    And I should see a value for "Section Number" on the show page with the value of ""
    And I should see a value for "Contact Number" on the show page with the value of ""
    And I should see a value for "UN Number" on the show page with the value of ""
    And I should see a value for "Status" on the show page with the value of ""
    And I should see a value for "Survivor Name" on the show page with the value of ""
    And I should see a value for "Is the client an Unaccompanied Minor, Separated Child, or Other Vulnerable Child?" on the show page with the value of ""
    And I should see a value for "Name(s) given to child after separation?" on the show page with the value of ""

  Scenario: As a logged in user, I should be able to reset the basic identity form 
    And I fill in the following:
      | Name              | Tiki Thomas Taliaferro               |
      | Age               | 22                                   |
    And I select "Male" from "Sex"
    And I check "English" for "Language"
    And I check "French" for "Language"
    And I press "Cancel"
    And I click OK in the browser popup
    Then I should be on the new case page
    And I should not see "Case record successfully created" on the page
    And the "Name" field should not contain "Tiki Thomas Taliaferro"
    And the "Age" field should not contain "22"
    And the "Sex" field should not contain "Male"
    And the "English" checkbox should not be checked
    And the "French" checkbox should not be checked
    
  Scenario: As a logged in user, I should be able to cancel out of a reset of the basic identity form 
    And I fill in the following:
      | Name              | Tiki Thomas Taliaferro               |
      | Age               | 22                                   |
    And I select "Male" from "Sex"
    And I check "English" for "Language"
    And I check "French" for "Language"
    And I press "Cancel"
    And I click Cancel in the browser popup
    Then I should be on the new case page
    And I should not see "Case record successfully created" on the page
    And the "Name" field should contain "Tiki Thomas Taliaferro"
    And the "Age" field should contain "22"
    And the "Sex" field should contain "Male"
    And the "English" checkbox should be checked
    And the "French" checkbox should be checked

  Scenario: As a logged in user, I create a case with no values in the basic identity form
    And I press the "Photos and Audio" button
    And I attach a photo "capybara_features/resources/jorge.jpg"
    And I press "Save"
    Then I should see "Case record successfully created" on the page
    And I should see a value for "Case ID" on the show page
    And I should see a value for "Registration Date" on the show page with the value of "today's date"