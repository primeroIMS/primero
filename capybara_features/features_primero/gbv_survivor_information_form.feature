# JIRA PRIMERO-449
# JIRA PRIMERO-520
# JIRA PRIMERO-518
# JIRA PRIMERO-539

@search @javascript @primero
Feature: Survivor Information Form
  As an administrator, I want to be able to enter information about survivors.

  Background:
    Given I am logged in as an admin with username "primero_gbv" and password "primero"
    And the following lookups exist in the system:
      | name                           | lookup_values                                                    |
      | nationality                    | Nationality1, Nationality2, Nationality3, Nationality4           |
      | ethnicity                      | Ethnicity1, Ethnicity2, Ethnicity3, Ethnicity4                   |
      | religion                       | Religion1, Religion2, Religion3, Religion4                       |
      | unaccompanied_separated_status | No, Unaccompanied Minor, Separated Child, Other Vulnerable Child |
      | case_status                    | Open, Closed, Transferred, Duplicate                             |
      | displacement_status            | Resident, IDP, Refugee, Stateless Person, Returnee, Foreign National, Asylum Seeker |
    When I access "cases page"
    And I press the "New Case" button

  Scenario: As a logged in user, I create a case by entering something in every field in the survivor information form
    #TODO: Add Date of Birth when PRIMERO-455 is merged
    And the "Displacement Status at time of report" dropdown should not have the following options:
      | N/A |
    And I fill in the following:
      | Case Status                                                                                 | <Select> Transferred            |
      | Name                                                                                        | Tiki Thomas Taliaferro          |
      | Survivor Code                                                                               | BBB111                          |
      | Sex                                                                                         | <Radio> Female                  |
      | Clan or Ethnicity                                                                           | <Select> Ethnicity1             |
      | Nationality (if different than country of origin)                                           | <Select> Nationality1           |
      | Religion                                                                                    | <Select> Religion1              |
      | Current Civil/Marital Status                                                                | <Select> Single                 |
      | Number and age of children and other dependents                                             | 2 children. 8 and 10 years old. |
      | Occupation                                                                                  | Some occupation                 |
      | Displacement Status at time of report                                                       | <Select> IDP                    |
      | Is the Survivor a Person with Disabilities?                                                 | <Select> No                     |
      | Is the Survivor an Unaccompanied Minor, Separated Child, or Other Vulnerable Child?         | <Select> No                     |
      | If the survivor is a child, does he/she live alone?                                         | <Radio> No                      |
      | If the survivor lives with someone, what is the relation between her/him and the caretaker? | <Select> Relative               |
      | If other relation between her/him and the caretaker, please specify.                        | Other relation                  |
      | What is the caretaker's current marital status?                                             | <Select> Single                 |
      | What is the caretaker's primary occupation?                                                 | Caretaker occupation            |
    And I press "Save"
    Then I should see "Case record successfully created" on the page
    And I should see a value for "Case Status" on the show page with the value of "Transferred"
    #By default in GBV new cases the name is hide.
    And I should see a value for "Name" on the show page with the value of "*****"
    And I should see a value for "Survivor Code" on the show page with the value of "BBB111"
    And I should see a value for "Sex" on the show page with the value of "Female"
    And I should see a value for "Current Civil/Marital Status" on the show page with the value of "Single"
    And I should see a value for "Number and age of children and other dependents" on the show page with the value of "2 children. 8 and 10 years old."
    And I should see a value for "Occupation" on the show page with the value of "Some occupation"
    And I should see a value for "Displacement Status at time of report" on the show page with the value of "IDP"
    And I should see a value for "Is the Survivor a Person with Disabilities?" on the show page with the value of "No"
    And I should see a value for "Is the Survivor an Unaccompanied Minor, Separated Child, or Other Vulnerable Child?" on the show page with the value of "No"
    And I should see a value for "If the survivor is a child, does he/she live alone?" on the show page with the value of "No"
    And I should see a value for "If the survivor lives with someone, what is the relation between her/him and the caretaker?" on the show page with the value of "Relative"
    And I should see a value for "If other relation between her/him and the caretaker, please specify." on the show page with the value of "Other relation"
    And I should see a value for "What is the caretaker's current marital status?" on the show page with the value of "Single"
    And I should see a value for "What is the caretaker's primary occupation?" on the show page with the value of "Caretaker occupation"
    And I should see a value for "Clan or Ethnicity" on the show page with the value of "Ethnicity1"
    And I should see a value for "Nationality (if different than country of origin)" on the show page with the value of "Nationality1"
    And I should see a value for "Religion" on the show page with the value of "Religion1"