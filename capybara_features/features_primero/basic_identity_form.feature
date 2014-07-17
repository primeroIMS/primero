# JIRA PRIMERO-42
# JIRA PRIMERO-73
# JIRA PRIMERO-179
# JIRA PRIMERO-217
# JIRA PRIMERO-159
# JIRA PRIMERO-207
# JIRA PRIMERO-213
# JIRA PRIMERO-232
# JIRA PRIMERO-233
# JIRA PRIMERO-234
# JIRA PRIMERO-252
# JIRA PRIMERO-260
# JIRA PRIMERO-273
# JIRA PRIMERO-267

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
    | Short ID          |
    | Date of Registration or Interview |
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
    | Current Displacement Status |
    | Protection Concerns |
    | Disability Type |
    | Nationality |
    | Place of Birth |
    | Birth Country |
    | Country of Origin |
    | Current Address |
    | Current Location |
    | Landmark near current address |
    | Is this address permanent? |    
    | Current Telephone |
    | Last Address |
    | Last Landmark |
    | Last Location |
    | Last Address Telephone |
    | Ethnicity/Clan/Tribe |
    | Sub Ethnicity 1 |
    | Sub Ethnicity 2 |
    | Language |
    | Religion |
    | Arrival Date |
    | Interviewer Name |
    | Interviewer Position |
    | Interviewer Agency |
    | Interview Address |
    | Interview Location |
    | Interview Landmark |    
    | Information Obtained From |
    | If information obtained from Other, please specify. |
    | Has the child been interviewed by another organization? |
    | Reference No. given to child by other organization |
    | Number and age of children and other dependents |
    | Camp |
    | Permanent Address |
    | Permanent Location |    
    | Section Number |
    | Contact Number |
    | UN Number |
    | Status |
    | Is the client an Unaccompanied Minor, Separated Child, or Other Vulnerable Child? |
    | Name(s) given to child after separation? |
    | If the survivor is a child, does he/she live alone? |
    | If the survivor lives with someone, what is the relation between her/him and the caretaker? |
    | If other relation between her/him and the caretaker, please specify. |
    | What is the caretaker's current marital status? |
    | What is the caretaker's primary occupation? |
    

    And I fill in the following:
      | Name              | Tiki Thomas Taliaferro               |
      | Other Agency ID   | ABC12345                             |
      | Other Agency Name | Test Agency                          |
      | ICRC Ref No.      | 131313                               |
      | RC ID No.         | 141414                               |
      | UNHCR ID          | AAA000                               |
      | Survivor Code     | BBB111                               |
      | Nickname          | Tommy                                |
      | Other Name        | Bob                                  |
      | Date of Birth     | 04-May-1992                          |
      | List Details of any documents carried by the child | Driver's License, Passport, Birth Certificate |
      | Occupation        | Farmer                               |
      | Distinguishing Physical Characteristics            | Really tall, dark hair, brown eyes            |
      | Place of Birth    | Boston                               |
      | Current Address   | 111 Main St, Davidson NC, 28036      |
      | Current Location  | Southern Region                      |
      | Landmark near current address          | Old Oak Tree                         |      
      | Current Telephone         | 336-555-1313                         |
      | Last Address      | 222 1st Ave, Mooresville NC, 28117   |
      | Last Landmark     | Roller Coaster Hill                  |
      | Last Location     | Northwest                            |
      | Last Address Telephone     | 828-555-1414                |
      | Arrival Date      | 13-Apr-2014                          |
      | Interviewer Name  | Fred Jones                           |
      | Interviewer Position | Field Worker                      |
      | Interview Address    | 333 Elm St, Wilkesboro NC, 28697  |
      | Interview Location   | Midwest                           |
      | Interviewer Agency   | <Select> Agency 4                 |
      | Interview Landmark   | By the river                      |      
      | If information obtained from Other, please specify.   | Doctor                           |
      | Reference No. given to child by other organization   | CCC222                          |
      | Number and age of children and other dependents   | 5                           |
      | Camp   | Test Camp                           |
      | Permanent Address    | 555 Clingman Rd, Ronda NC, 28670          |
      | Permanent Location   | Southwest                           |
      | Section Number   | DDD333                          |
      | Contact Number         | 910-555-1515                         |
      | UN Number   | EEE444                          |
      | If other relation between her/him and the caretaker, please specify.   | Second Cousin     |
      | What is the caretaker's primary occupation?        | Teacher                               |
      
    And I select "Male" from "Sex"
    And I select "Separated" from "Protection Status"
    And I select "Yes" for "Urgent Protection Concern?" radio button
    And I select "No" for "Estimated" radio button
    And I select "Married/Cohabitating" from "Current Civil/Marital Status"
    And I select "Foreign National" from "Current Displacement Status"
    And I choose from "Protection Concerns":
      |  Sexually Exploited    |
      |  GBV survivor          |
      |  Trafficked/smuggled   |
      |  Other                 |
    And I select "Physical Disability" from "Disability Type"
    And I choose from "Nationality":
      | Nationality1 |
      | Nationality3 |
    And I select "Country1" from "Birth Country"
    And I select "Country2" from "Country of Origin"
    And I select "Yes" for "Is this address permanent?" radio button
    And I choose from "Ethnicity/Clan/Tribe":
      | Ethnicity1 |
      | Ethnicity2 |
    And I choose from "Sub Ethnicity 1":
      | Sub-ethnicity1.2 |
    And I choose from "Sub Ethnicity 2":
      | Sub-ethnicity2.3|
    And I select "GBV Survivor" from "Information Obtained From"
    And I select "Yes" for "Has the child been interviewed by another organization?" radio button
    And I select "Community" from "Status"
    And I select "No" for "Name(s) given to child after separation?" radio button
    And I select "No" for "If the survivor is a child, does he/she live alone?" radio button
    And I select "Relative" from "If the survivor lives with someone, what is the relation between her/him and the caretaker?"
    And I select "Widowed" from "What is the caretaker's current marital status?"
    And I choose from "Language":
      | Language1 |
      | Language2 |
    And I choose from "Religion":
      | Religion1 |
      | Religion2 |
    And I check "Unaccompanied Minor" 
    And I check "Separated Child"
    And I check "Other Vulnerable Child"
    
    And I press "Save"
    Then I should see "Case record successfully created" on the page
    And I should see a value for "Case ID" on the show page
    And I should see a value for "Short ID" on the show page
    And I should see a value for "Date of Registration or Interview" on the show page with the value of "today's date"
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
    And I should see a value for "Date of Birth" on the show page with the value of "04-May-1992"
    And I should see a value for "Estimated" on the show page with the value of "No"
    And I should see a value for "List Details of any documents carried by the child" on the show page with the value of "Driver's License, Passport, Birth Certificate"
    And I should see a value for "Current Civil/Marital Status" on the show page with the value of "Married/Cohabitating"
    And I should see a value for "Occupation" on the show page with the value of "Farmer"
    And I should see a value for "Distinguishing Physical Characteristics" on the show page with the value of "Really tall, dark hair, brown eyes"
    And I should see a value for "Current Displacement Status" on the show page with the value of "Foreign National"
    And I should see a value for "Protection Concerns" on the show page with the value of "Sexually Exploited, GBV survivor, Trafficked/smuggled, Other"
    And I should see a value for "Disability Type" on the show page with the value of "Physical Disability"
    And I should see a value for "Nationality" on the show page with the value of "Nationality1, Nationality3"
    And I should see a value for "Place of Birth" on the show page with the value of "Boston"
    And I should see a value for "Birth Country" on the show page with the value of "Country1"
    And I should see a value for "Country of Origin" on the show page with the value of "Country2"
    And I should see a value for "Current Address" on the show page with the value of "111 Main St, Davidson NC, 28036"
    And I should see a value for "Current Location" on the show page with the value of "Southern Region"
    And I should see a value for "Landmark near current address" on the show page with the value of "Old Oak Tree"
    And I should see a value for "Is this address permanent?" on the show page with the value of "Yes"    
    And I should see a value for "Current Telephone" on the show page with the value of "336-555-1313"
    And I should see a value for "Last Address" on the show page with the value of "222 1st Ave, Mooresville NC, 28117"
    And I should see a value for "Last Landmark" on the show page with the value of "Roller Coaster Hill"
    And I should see a value for "Last Location" on the show page with the value of "Northwest"
    And I should see a value for "Last Address Telephone" on the show page with the value of "828-555-1414"
    And I should see a value for "Ethnicity/Clan/Tribe" on the show page with the value of "Ethnicity1, Ethnicity2"
    And I should see a value for "Sub Ethnicity 1" on the show page with the value of "Sub-ethnicity1.2"
    And I should see a value for "Sub Ethnicity 2" on the show page with the value of "Sub-ethnicity2.3"
    And I should see a value for "Language" on the show page with the value of "Language1, Language2"
    And I should see a value for "Religion" on the show page with the value of "Religion1, Religion2"
    And I should see a value for "Arrival Date" on the show page with the value of "13-Apr-2014"
    And I should see a value for "Interviewer Name" on the show page with the value of "Fred Jones"
    And I should see a value for "Interviewer Position" on the show page with the value of "Field Worker"
    And I should see a value for "Interviewer Agency" on the show page with the value of "Agency 4"
    And I should see a value for "Interview Address" on the show page with the value of "333 Elm St, Wilkesboro NC, 28697"
    And I should see a value for "Interview Location" on the show page with the value of "Midwest"
    And I should see a value for "Interview Landmark" on the show page with the value of "By the river"    
    And I should see a value for "Information Obtained From" on the show page with the value of "GBV Survivor"
    And I should see a value for "If information obtained from Other, please specify." on the show page with the value of "Doctor"
    And I should see a value for "Has the child been interviewed by another organization?" on the show page with the value of "Yes"
    And I should see a value for "Reference No. given to child by other organization" on the show page with the value of "CCC222"
    And I should see a value for "Number and age of children and other dependents" on the show page with the value of "5"
    And I should see a value for "Camp" on the show page with the value of "Test Camp"
    And I should see a value for "Permanent Address" on the show page with the value of "555 Clingman Rd, Ronda NC, 28670"
    And I should see a value for "Permanent Location" on the show page with the value of "Southwest"
    And I should see a value for "Section Number" on the show page with the value of "DDD333"
    And I should see a value for "Contact Number" on the show page with the value of "910-555-1515"
    And I should see a value for "UN Number" on the show page with the value of "EEE444"
    And I should see a value for "Status" on the show page with the value of "Community"
    And I should see a value for "Is the client an Unaccompanied Minor, Separated Child, or Other Vulnerable Child?" on the show page with the value of "Unaccompanied Minor, Separated Child, Other Vulnerable Child"
    And I should see a value for "Name(s) given to child after separation?" on the show page with the value of "No"
    And I should see a value for "If the survivor is a child, does he/she live alone?" on the show page with the value of "No"
    And I should see a value for "If the survivor lives with someone, what is the relation between her/him and the caretaker?" on the show page with the value of "Relative"
    And I should see a value for "If other relation between her/him and the caretaker, please specify." on the show page with the value of "Second Cousin"
    And I should see a value for "What is the caretaker's current marital status?" on the show page with the value of "Widowed"
    And I should see a value for "What is the caretaker's primary occupation?" on the show page with the value of "Teacher"
    And I access "cases page"
    And I should not see "141414" on the page
    And I should not see "Separated" on the page
    
  Scenario: As a logged in user, I create a case without entering anything in any field in the basic identity form 
    And I press "Save"
    Then I should see "Case record successfully created" on the page
    And I should see a value for "Case ID" on the show page
    And I should see a value for "Short ID" on the show page
    And I should see a value for "Date of Registration or Interview" on the show page with the value of "today's date"
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
    And I should see a value for "Current Displacement Status" on the show page with the value of ""
    And I should see a value for "Disability Type" on the show page with the value of ""
    And I should see a value for "Nationality" on the show page with the value of ""
    And I should see a value for "Place of Birth" on the show page with the value of ""
    And I should see a value for "Birth Country" on the show page with the value of ""
    And I should see a value for "Country of Origin" on the show page with the value of ""
    And I should see a value for "Current Address" on the show page with the value of ""
    And I should see a value for "Current Location" on the show page with the value of ""
    And I should see a value for "Landmark near current address" on the show page with the value of ""
    And I should see a value for "Is this address permanent?" on the show page with the value of ""    
    And I should see a value for "Current Telephone" on the show page with the value of ""
    And I should see a value for "Last Address" on the show page with the value of ""
    And I should see a value for "Last Landmark" on the show page with the value of ""
    And I should see a value for "Last Location" on the show page with the value of ""
    And I should see a value for "Last Address Telephone" on the show page with the value of ""
    And I should see a value for "Ethnicity/Clan/Tribe" on the show page with the value of ""
    And I should see a value for "Sub Ethnicity 1" on the show page with the value of ""
    And I should see a value for "Sub Ethnicity 2" on the show page with the value of ""    
    And I should see a value for "Language" on the show page with the value of ""
    And I should see a value for "Religion" on the show page with the value of ""
    And I should see a value for "Arrival Date" on the show page with the value of ""
    And I should see a value for "Interviewer Name" on the show page with the value of ""
    And I should see a value for "Interviewer Position" on the show page with the value of ""
    And I should see a value for "Interviewer Agency" on the show page with the value of ""
    And I should see a value for "Interview Address" on the show page with the value of ""
    And I should see a value for "Interview Location" on the show page with the value of ""
    And I should see a value for "Interview Landmark" on the show page with the value of ""    
    And I should see a value for "Information Obtained From" on the show page with the value of ""
    And I should see a value for "If information obtained from Other, please specify." on the show page with the value of ""
    And I should see a value for "Has the child been interviewed by another organization?" on the show page with the value of ""
    And I should see a value for "Reference No. given to child by other organization" on the show page with the value of ""
    And I should see a value for "Number and age of children and other dependents" on the show page with the value of ""
    And I should see a value for "Camp" on the show page with the value of ""
    And I should see a value for "Permanent Address" on the show page with the value of ""
    And I should see a value for "Permanent Location" on the show page with the value of ""
    And I should see a value for "Section Number" on the show page with the value of ""
    And I should see a value for "Contact Number" on the show page with the value of ""
    And I should see a value for "UN Number" on the show page with the value of ""
    And I should see a value for "Status" on the show page with the value of ""
    And I should see a value for "Is the client an Unaccompanied Minor, Separated Child, or Other Vulnerable Child?" on the show page with the value of ""
    And I should see a value for "Name(s) given to child after separation?" on the show page with the value of ""
    And I should see a value for "If the survivor is a child, does he/she live alone?" on the show page with the value of ""
    And I should see a value for "If the survivor lives with someone, what is the relation between her/him and the caretaker?" on the show page with the value of ""
    And I should see a value for "If other relation between her/him and the caretaker, please specify." on the show page with the value of ""
    And I should see a value for "What is the caretaker's current marital status?" on the show page with the value of ""
    And I should see a value for "What is the caretaker's primary occupation?" on the show page with the value of ""

  Scenario: As a logged in user, I should be able to reset the basic identity form 
    And I fill in the following:
      | Name              | Tiki Thomas Taliaferro               |
      | Age               | 22                                   |
    And I select "Male" from "Sex"
    And I choose from "Language":
      | Language1 |
      | Language2 |
    And I press "Cancel"
    And I click OK in the browser popup
    Then I should be on the new case page
    And I should not see "Case record successfully created" on the page
    And the "Name" field should not contain "Tiki Thomas Taliaferro"
    And the "Age" field should not contain "22"
    And the "Sex" field should not contain "Male"
    And the chosen "Language" should not have any selected value
    
  Scenario: As a logged in user, I should be able to cancel out of a reset of the basic identity form 
    And I fill in the following:
      | Name              | Tiki Thomas Taliaferro               |
      | Age               | 22                                   |
    And I select "Male" from "Sex"
    And I choose from "Language":
      | Language1 |
      | Language2 |
    And I press "Cancel"
    And I click Cancel in the browser popup
    Then I should be on the new case page
    And I should not see "Case record successfully created" on the page
    And the "Name" field should contain "Tiki Thomas Taliaferro"
    And the "Age" field should contain "22"
    And the "Sex" field should contain "Male"
    And the chosen "Language" should have the following values:
      | Language1 |
      | Language2 |

  Scenario: As a logged in user, I create a case with no values in the basic identity form
    And I press "Save"
    Then I should see "Case record successfully created" on the page
    And I press the "Basic Identity" button
    And I should see a value for "Case ID" on the show page
    And I should see a value for "Short ID" on the show page
    And I should see a value for "Date of Registration or Interview" on the show page with the value of "today's date"

  Scenario: As a logged in user, I should be able to change the date of registration in the basic identity form
    And I fill in the following:
      | Date of Registration or Interview | 08-Jun-2014 |
    And I press "Save"
    And I should see "Case record successfully created" on the page
    And I should see a value for "Date of Registration or Interview" on the show page with the value of "08-Jun-2014"
    And I press the "Edit" button
    And I fill in the following:
      | Date of Registration or Interview | 19-Jul-2014 |
    And I press "Save"
    Then I should see "Case was successfully updated" on the page
    And I should see a value for "Date of Registration or Interview" on the show page with the value of "19-Jul-2014"

  Scenario: As a logged in user, When I fill in the Age field the Date of Birth should be calculated
    And I fill in the following:
      | Name              | Tiki Thomas Taliaferro               |
      | Age               | 24                                   |
      | Other Agency ID   | ABC12345                             |
      | Other Agency Name | Test Agency                          |
      | ICRC Ref No.      | 131313                               |
      | RC ID No.         | 141414                               |
      | UNHCR ID          | AAA000                               |
      | Survivor Code     | BBB111                               |
      | Nickname          | Tommy                                |
      | Other Name        | Bob                                  |
    And I press "Save"
    Then I should see a value for "Age" on the show page with the value of "24"
    Then I should see a value for "Date of Birth" on the show page which is January 1, "24" years ago

  Scenario: As a logged in user, When I fill in the Age field with zero the Date of Birth should be calculated
    And I fill in the following:
      | Name              | Tiki Thomas Taliaferro               |
      | Age               | 0                                    |
      | Other Agency ID   | ABC12345                             |
      | Other Agency Name | Test Agency                          |
      | ICRC Ref No.      | 131313                               |
      | RC ID No.         | 141414                               |
      | UNHCR ID          | AAA000                               |
      | Survivor Code     | BBB111                               |
      | Nickname          | Tommy                                |
      | Other Name        | Bob                                  |
    And I press "Save"
    Then I should see a value for "Age" on the show page with the value of "0"
    Then I should see a value for "Date of Birth" on the show page which is January 1, "0" years ago

  Scenario: As a logged in user, When I fill in the Date of Birth field the Age should be calculated
    And I fill in the following:
      | Date of Birth | 02-May-1990 |
    And I press "Save"
    Then I should see a value for "Date of Birth" on the show page with the value of "02-May-1990"
    Then I should see the calculated Age of a child born in "1990"

  Scenario: As a logged in user, When I fill in the Date of Birth field with a non valid date I should see a validation message preventing the record from being saved
  And I fill in the following:
      | Date of Birth | 21-21-1990 |
  And I press "Save"
  Then I should see "Basic Identity: Please enter the date in a valid format (dd-mmm-yyyy)"

  Scenario: As a logged in user When I enter an invalid number in 'Age' field I should see a validation message
    And I fill in the following:
      | Name              | Daenerys Targaryen |
      | Age               | SS                 |
    And I press "Save"
    And I should see "There were problems with the following fields:" on the page
    And I should see "Basic Identity: Age must be a valid number" on the page
    And I fill in the following:
      | Name              | Daenerys Targaryen |
      | Age               | 192                |
    And I press "Save"
    And I should see "There were problems with the following fields:" on the page
    And I should see "Basic Identity: Age must be between 0 and 130" on the page
