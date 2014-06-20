#JIRA PRIMERO-97
#JIRA PRIMERO-222

@javascript @primero
Feature: Family Details Form
  As a Social worker, I want to enter the information related to the family details.

  Scenario: As a logged in user, I should access the form section family details subform
    Given I am logged in as an admin with username "primero" and password "primero"
    When I access "form section page"
    And I press the "Nested Family Details" button
    Then I should see the following fields:
      |Name|
      |How are they related to the child?|
      |Is this person the caregiver?|
      |Did the child live with this person before separation?|
      |Is the child in contact with this person?|
      |Is the child separated from this person?|
      |List any agency identifiers as a comma separated list|
      |Nickname|
      |Are they alive?|
      |If dead, please provide details|
      |Age|
      |Date of Birth|
      |Language|
      |Religion|
      |Ethnicity|
      |Sub Ethnicity 1|
      |Sub Ethnicity 2|
      |Nationality|
      |Comments|
      |Occupation|
      |Current Address|
      |Is this a permanent location?|
      |Current Location|
      |Last Known Address|
      |Last Known Location|
      |Telephone|
      |Other persons well known to the child|

  Scenario: As a logged in user, I should access the form section family details
    Given I am logged in as an admin with username "primero" and password "primero"
    When I access "form section page"
    And I press the "Family Details" button
    Then I should see the following fields:
      |Size of Family|
      |Notes about Family|
      |What is the child’s intended address?|
      |Family Details|

  Scenario: I create a case with family details information.
    Given I am logged in as an admin with username "primero" and password "primero"
    When I access "cases page"
    And I press the "Create a New Case" button
    And I press the "Family Details" button
    And I fill in the following:
      | Size of Family                        | 3                  |
      | Notes about Family                    | Some Family Notes  |
      | What is the child’s intended address? | Some Child Address |
    #Added Family Details
    And I fill in the 1st "Family Details Section" subform with the follow:
      |Name                                                  | First Name Relation                    |
      |How are they related to the child?                    | <Select> Mother                        |
      |Is this person the caregiver?                         | <Select> Yes                           |
      |Did the child live with this person before separation?| <Select> Yes                           |
      |Is the child in contact with this person?             | <Select> Yes                           |
      |Is the child separated from this person?              | <Select> Yes                           |
      |List any agency identifiers as a comma separated list | Agency1 ,Agency 2                      |
      |Nickname                                              | First Nickname Relation                |
      |Are they alive?                                       | <Select> Alive                         |
      |If dead, please provide details                       | No Dead Notes                          |
      |Age                                                   | 5                                      |
      |Date of Birth                                         | 21/May/2000                            |
      |Language                                              | <Choose>Language 1<Choose>Language 2   |
      |Religion                                              | <Choose>Religion 1<Choose>Religion 2   |
      |Ethnicity                                             | <Select> Ethnicity 1                   |
      |Sub Ethnicity 1                                       | <Select> Sub Ethnicity 1               |
      |Sub Ethnicity 2                                       | <Select> Sub Ethnicity 2               |
      |Nationality                                           | <Choose>Nationality 1<Choose>Nationality 2 |
      |Comments                                              | Some Comments Relation                 |
      |Occupation                                            | Some Ocupation Relation                |
      |Current Address                                       | The Current Address Relation           |
      |Is this a permanent location?                         | <Select> No                            |
      |Current Location                                      | The Current Location                   |
      |Last Known Address                                    | The Last Known Address                 |
      |Last Known Location                                   | The Last Known Location                |
      |Telephone                                             | The Telephone                          |
      |Other persons well known to the child                 | Some Other Person Well Known the Child |
    And I press "Save"
    Then I should see "Case record successfully created" on the page
    And I should see a value for "Size of Family" on the show page with the value of "3"
    And I should see a value for "Notes about Family" on the show page with the value of "Some Family Notes"
    And I should see a value for "What is the child’s intended address?" on the show page with the value of "Some Child Address"
    #Verify values from the subform
    And I should see "First Name Relation" on the page
    And I should see "Mother" on the page
    And I should see "Yes" on the page
    And I should see "Yes" on the page
    And I should see "Yes" on the page
    And I should see "Yes" on the page
    And I should see "Agency1 ,Agency 2" on the page
    And I should see "First Nickname Relation" on the page
    And I should see "Alive" on the page
    And I should see "No Dead Notes" on the page
    And I should see "5" on the page
    And I should see "21/May/2000" on the page
    And I should see "Language 1, Language 2" on the page
    And I should see "Religion 1, Religion 2" on the page
    And I should see "Ethnicity 1" on the page
    And I should see "Sub Ethnicity 1" on the page
    And I should see "Sub Ethnicity 2" on the page
    And I should see "Nationality 1, Nationality 2" on the page
    And I should see "Some Comments Relation" on the page
    And I should see "Some Ocupation Relation" on the page
    And I should see "The Current Address Relation" on the page
    And I should see "No" on the page
    And I should see "The Current Location" on the page
    And I should see "The Last Known Address" on the page
    And I should see "The Last Known Location" on the page
    And I should see "The Telephone" on the page
    And I should see "Some Other Person Well Known the Child" on the page
