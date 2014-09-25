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
# JIRA PRIMERO-339
# JIRA PRIMERO-354
# JIRA PRIMERO-353
# JIRA PRIMERO-363
# JIRA PRIMERO-453
# JIRA PRIMERO-450
# JIRA PRIMERO-493

@javascript @primero @search
Feature: Basic Identity Form
  As an administrator, I want to be able to create a case with a auto generated case id, short id, and registration date.
  I also want the case status to default to open leaving the option to set it another status by the user.

  Background:
    Given I am logged in as an admin with username "primero_cp" and password "primero"
    And the following location country exist in the system:
      | placename           |
      | A Location Country  |
    When I access "cases page"
    And I press the "New Case" button

  Scenario: As a logged in user, I create a case by entering something in every field in the basic identity form
    And I fill in the following:
      | Case Status                              | <Select> Transferred               |
      | Name                                     | Tiki Thomas Taliaferro             |
      | Nickname                                 | Tommy                              |
      | Other Name                               | Bob                                |
      | Name(s) given to child after separation? | <Radio> No                         |
      | Sex                                      | <Select> Male                      |
      | Date of Birth                            | 04-May-1992                        |
      | Estimated                                | <Tickbox>                          |
      | Distinguishing Physical Characteristics  | Really tall, dark hair, brown eyes |
      | ICRC Ref No.                             | 131313                             |
      | RC ID No.                                | 141414                             |
      | UNHCR ID                                 | AAA000                             |
      | UN Number                                | EEE444                             |
      | Other Agency ID                          | ABC12345                           |
      | Other Agency Name                        | Test Agency                        |
      | List of documents carried by the child | Driver's License, Passport, Birth Certificate |
      | Current Civil/Marital Status             | <Select> Married/Cohabitating      |
      | Occupation                               | Farmer                             |
      | Current Address                          | 111 Main St, Davidson NC, 28036    |
      | Landmark                                 | Old Oak Tree                       |
      | Current Location                         | <Choose>A Location Country         |
      | Is this address permanent?               | <Tickbox>                          |
      | Current Telephone                        | 336-555-1313                       |
    And the value of "Age" should be the calculated age of someone born in "1992"
    And I press "Save"
    Then I should see "Case record successfully created" on the page
    And I should see a value for "Case ID" on the show page
    And I should see a value for "Long ID" on the show page
    And I should see values on the page for the following:
      | Case Status                              | Transferred                        |
      | Name                                     | Tiki Thomas Taliaferro             |
      | Nickname                                 | Tommy                              |
      | Other Name                               | Bob                                |
      | Name(s) given to child after separation? | No                                 |
      | Sex                                      | Male                               |
      | Date of Birth                            | 04-May-1992                        |
      | Estimated                                | Yes                                |
      | Distinguishing Physical Characteristics  | Really tall, dark hair, brown eyes |
      | ICRC Ref No.                             | 131313                             |
      | RC ID No.                                | 141414                             |
      | UNHCR ID                                 | AAA000                             |
      | UN Number                                | EEE444                             |
      | Other Agency ID                          | ABC12345                           |
      | Other Agency Name                        | Test Agency                        |
      | List of documents carried by the child   | Driver's License, Passport, Birth Certificate |
      | Current Civil/Marital Status             | Married/Cohabitating               |
      | Occupation                               | Farmer                             |
      | Current Address                          | 111 Main St, Davidson NC, 28036    |
      | Landmark                                 | Old Oak Tree                       |
      | Current Location                         | A Location Country                 |
      | Is this address permanent?               | Yes                                |
      | Current Telephone                        | 336-555-1313                       |

  Scenario: As a logged in user, I create a case without entering anything in any field in the basic identity form
    And I press "Save"
    Then I should see "Case record successfully created" on the page
    And I should see a value for "Case ID" on the show page
    And I should see a value for "Long ID" on the show page
    And I should see a value for "Case Status" on the show page with the value of "Open"
    And I should see a value for "Name" on the show page with the value of ""
    And I should see a value for "Nickname" on the show page with the value of ""
    And I should see a value for "Other Name" on the show page with the value of ""
    And I should see a value for "Name(s) given to child after separation?" on the show page with the value of ""
    And I should see a value for "Date of Registration or Interview" on the show page with the value of "today's date"
    And I should see a value for "Sex" on the show page with the value of ""
    And I should see a value for "Age" on the show page with the value of ""
    And I should see a value for "Date of Birth" on the show page with the value of ""
    And I should see a value for "Estimated" on the show page with the value of "No"
    And I should see a value for "Distinguishing Physical Characteristics" on the show page with the value of ""
    And I should see a value for "ICRC Ref No." on the show page with the value of ""
    And I should see a value for "RC ID No." on the show page with the value of ""
    And I should see a value for "UNHCR ID" on the show page with the value of ""
    And I should see a value for "UN Number" on the show page with the value of ""
    And I should see a value for "Other Agency ID" on the show page with the value of ""
    And I should see a value for "Other Agency Name" on the show page with the value of ""
    And I should see a value for "List of documents carried by the child" on the show page with the value of ""
    And I should see a value for "Current Civil/Marital Status" on the show page with the value of ""
    And I should see a value for "Occupation" on the show page with the value of ""
    And I should see a value for "Current Address" on the show page with the value of ""
    And I should see a value for "Landmark" on the show page with the value of ""
    And I should see a value for "Current Location" on the show page with the value of ""
    And I should see a value for "Is this address permanent?" on the show page with the value of "No"
    And I should see a value for "Current Telephone" on the show page with the value of ""

  Scenario: As a logged in user, I should be able to reset the basic identity form
    And I fill in the following:
      | Name              | Tiki Thomas Taliaferro               |
      | Age               | 22                                   |
    And I select "Male" from "Sex"
    And I press the "Cancel" button
    And I click OK in the browser popup
    Then I should be on the cases page
    And I should not see "Case record successfully created" on the page

  Scenario: As a logged in user, I should be able to cancel out of a reset of the basic identity form
    And I fill in the following:
      | Name              | Tiki Thomas Taliaferro               |
      | Age               | 22                                   |
    And I select "Male" from "Sex"
    And I press the "Cancel" button
    And I click Cancel in the browser popup
    Then I should be on the new case page
    And I should not see "Case record successfully created" on the page
    And the "Name" field should contain "Tiki Thomas Taliaferro"
    And the "Age" field should contain "22"
    And the "Sex" field should contain "Male"

  Scenario: As a logged in user, I create a case with no values in the basic identity form
    And I press "Save"
    Then I should see "Case record successfully created" on the page
    And I should see a value for "Case ID" on the show page
    And I should see a value for "Long ID" on the show page
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
      | Nickname          | Tommy                                |
      | Other Name        | Bob                                  |
    And the value of "Date of Birth" should be January 1, "24" years ago
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
      | Nickname          | Tommy                                |
      | Other Name        | Bob                                  |
    And the value of "Date of Birth" should be January 1, "0" years ago
    And I press "Save"
    Then I should see a value for "Age" on the show page with the value of "0"
    Then I should see a value for "Date of Birth" on the show page which is January 1, "0" years ago

  Scenario: As a logged in user, When I fill in the Date of Birth field the Age should be calculated
    And I fill in the following:
      | Date of Birth     | 02-May-1990 |
      | Name              | Tiki Thomas Taliaferro               |
      | Nickname          | Tommy                                |
      | Other Name        | Bob                                  |
    And the value of "Age" should be the calculated age of someone born in "1990"
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
