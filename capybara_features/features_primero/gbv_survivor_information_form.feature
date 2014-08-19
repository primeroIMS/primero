# JIRA PRIMERO-449

@javascript @primero
Feature: Survivor Information Form
  As an administrator, I want to be able to enter information about survivors.

  Scenario: As a logged in user, I create a case by entering something in every field in the survivor information form
    Given I am logged in as an admin with username "primero" and password "primero"
    When I access "cases page"
    And I press the "Create a New Case" button
    And I press the "Identification / Registration" button
    And I press the "Survivor Information" button
    And I fill in the following:
      | Case Status                                                                                 | <Select> Transferred            |
      | Name                                                                                        | Tiki Thomas Taliaferro          |
      | Survivor Code                                                                               | BBB111                          |
      | Date of Birth                                                                               | 04-May-1992                     |
      | Sex                                                                                         | <Select> Female                 |
      | Clan or Ethnicity                                                                           | <Select> Ethnicity1             |
      | Country of Origin                                                                           | <Select> Country1               |
      | Nationality (if different than country of origin)                                           | <Select> Nationality1           |
      | Religion                                                                                    | <Select> Religion1              |
      | Current Civil/Marital Status                                                                | <Select> Single                 |
      | Number and age of children and other dependents                                             | 2 children. 8 and 10 years old. |
      | Occupation                                                                                  | Some occupation                 |
      | Displacement Status at time of report                                                       | <Select> IDP                    |
      | Is the Client a Person with Disabilities?                                                   | <Select> No                     |
      | Is the client an Unaccompanied Minor, Separated Child, or Other Vulnerable Child?           | <Select> No                     |
      | If the survivor is a child, does he/she live alone?                                         | <Radio> No                      |
      | If the survivor lives with someone, what is the relation between her/him and the caretaker? | <Select> Relative               |
      | If other relation between her/him and the caretaker, please specify.                        | Other relation                  |
      | What is the caretaker's current marital status?                                             | <Select> Single                 |
      | What is the caretaker's primary occupation?                                                 | Caretaker occupation            |
    And I press "Save"
    Then I should see "Case record successfully created" on the page
    And I should see a value for "Case Status" on the show page with the value of "Transferred"
    And I should see a value for "Name" on the show page with the value of "Tiki Thomas Taliaferro"
    And I should see a value for "Survivor Code" on the show page with the value of "BBB111"
    And I should see a value for "Date of Birth" on the show page with the value of "04-May-1992"
    And I should see a value for "Sex" on the show page with the value of "Female"
    And I should see a value for "Clan or Ethnicity" on the show page with the value of "Ethnicity1"
    And I should see a value for "Country of Origin" on the show page with the value of "Country1"
    And I should see a value for "Nationality (if different than country of origin)" on the show page with the value of "Nationality1"
    And I should see a value for "Religion" on the show page with the value of "Religion1"
    And I should see a value for "Current Civil/Marital Status" on the show page with the value of "Single"
    And I should see a value for "Number and age of children and other dependents" on the show page with the value of "2 children. 8 and 10 years old."
    And I should see a value for "Occupation" on the show page with the value of "Some occupation"
    And I should see a value for "Displacement Status at time of report" on the show page with the value of "IDP"
    And I should see a value for "Is the Client a Person with Disabilities?" on the show page with the value of "No"
    And I should see a value for "Is the client an Unaccompanied Minor, Separated Child, or Other Vulnerable Child?" on the show page with the value of "No"
    And I should see a value for "If the survivor is a child, does he/she live alone?" on the show page with the value of "No"
    And I should see a value for "If the survivor lives with someone, what is the relation between her/him and the caretaker?" on the show page with the value of "Relative"
    And I should see a value for "If other relation between her/him and the caretaker, please specify." on the show page with the value of "Other relation"
    And I should see a value for "What is the caretaker's current marital status?" on the show page with the value of "Single"
    And I should see a value for "What is the caretaker's primary occupation?" on the show page with the value of "Caretaker occupation"