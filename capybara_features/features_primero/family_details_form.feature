#JIRA PRIMERO-97
#JIRA PRIMERO-222
#JIRA PRIMERO-228
#JIRA PRIMERO-232
#JIRA PRIMERO-240
#JIRA PRIMERO-238
#JIRA PRIMERO-353
#JIRA PRIMERO-363
#JIRA PRIMERO-365
#JIRA PRIMERO-243
#JIRA PRIMERO-244

@javascript @primero
Feature: Family Details Form
  As a Social worker, I want to enter the information related to the family details.
  
  Background:
    Given I am logged in as an admin with username "primero" and password "primero"
    When I access "cases page"
    And I press the "Create a New Case" button
    And I press the "Family / Partner Details" button
    And I click on "Family Details" in form group "Family / Partner Details"

  Scenario: I create a case with family details information.
    And I fill in the following:
      | Size of Family                        | 3                  |
      | Notes about Family                    | Some Family Notes  |
      | What is the child’s intended address? | Some Child Address |
    #Added Family Details
    And I fill in the 1st "Family Details Section" subform with the follow:
      |Name                                                  | Socorro                                    |
      |How are they related to the child?                    | <Select> Mother                            |
      |Is this person the caregiver?                         | <Radio> Yes                                |
      |Did the child live with this person before separation?| <Radio> Yes                                |
      |Is the child in contact with this person?             | <Radio> Yes                                |
      |Is the child separated from this person?              | <Radio> Yes                                |
      |List any agency identifiers as a comma separated list | Agency1 ,Agency 2                          |
      |Nickname                                              | Coco                                       |
      |Are they alive?                                       | <Select> Alive                             |
      |If dead, please provide details                       | No Dead Notes                              |
      |Language                                              | <Choose>Language1<Choose>Language2         |
      |Religion                                              | <Choose>Religion1<Choose>Religion2         |
      |Ethnicity                                             | <Select> Ethnicity1                        |
      |Sub Ethnicity 1                                       | <Select> Ethnicity1                        |
      |Sub Ethnicity 2                                       | <Select> Ethnicity2                        |
      |Nationality                                           | <Choose>Nationality1<Choose>Nationality2   |
      |Comments                                              | Some Comments About Coco                   |
      |Occupation                                            | Some Ocupation About Coco                  |
      |Current Address                                       | Coco's Current Address                     |
      |Is this a permanent location?                         | <Radio> Yes                                |
      |Current Location                                      | Coco's Current Location                    |
      |Last Known Address                                    | Coco's Last Known Address                  |
      |Last Known Location                                   | Coco's Last Known Location                 |
      |Telephone                                             | Coco's Telephone                           |
      |Other persons well known to the child                 | Pedro                                      |
    And I fill in the 2st "Family Details Section" subform with the follow:
      |Name                                                  | Pedro                                      |
      |How are they related to the child?                    | <Select> Father                            |
      |Is this person the caregiver?                         | <Radio> No                                 |
      |Did the child live with this person before separation?| <Radio> No                                 |
      |Is the child in contact with this person?             | <Radio> No                                 |
      |Is the child separated from this person?              | <Radio> No                                 |
      |List any agency identifiers as a comma separated list | Agency3 ,Agency 4                          |
      |Nickname                                              | Pepe                                       |
      |Are they alive?                                       | <Select> Unknown                           |
      |If dead, please provide details                       | Unknown Information                        |
      |Language                                              | <Choose>Language2                          |
      |Religion                                              | <Choose>Religion2                          |
      |Ethnicity                                             | <Select> Ethnicity2                        |
      |Sub Ethnicity 1                                       | <Select> Ethnicity2                        |
      |Sub Ethnicity 2                                       | <Select> Ethnicity1                        |
      |Nationality                                           | <Choose>Nationality2                       |
      |Comments                                              | Some Comments About Pepe                   |
      |Occupation                                            | Some Ocupation About Pepe                  |
      |Current Address                                       | Pepe's Current Address                     |
      |Is this a permanent location?                         | <Radio> No                                 |
      |Current Location                                      | Pepe's Current Location                    |
      |Last Known Address                                    | Pepe's Last Known Address                  |
      |Last Known Location                                   | Pepe's Last Known Location                 |
      |Telephone                                             | Pepe's Telephone                           |
      |Other persons well known to the child                 | Juan                                       |
    And I press "Save"
    Then I should see "Case record successfully created" on the page
    And I should see a value for "Size of Family" on the show page with the value of "3"
    And I should see a value for "Notes about Family" on the show page with the value of "Some Family Notes"
    And I should see a value for "What is the child’s intended address?" on the show page with the value of "Some Child Address"
    #Verify values from the subform
    And I should see in the 1st "Family Details Section" subform with the follow:
      |Name                                                  | Socorro                      |
      |How are they related to the child?                    | Mother                       |
      |Is this person the caregiver?                         | Yes                          |
      |Did the child live with this person before separation?| Yes                          |
      |Is the child in contact with this person?             | Yes                          |
      |Is the child separated from this person?              | Yes                          |
      |List any agency identifiers as a comma separated list | Agency1 ,Agency 2            |
      |Nickname                                              | Coco                         |
      |Are they alive?                                       | Alive                        |
      |If dead, please provide details                       | No Dead Notes                |
      |Language                                              | Language1, Language2         |
      |Religion                                              | Religion1, Religion2         |
      |Ethnicity                                             | Ethnicity1                   |
      |Sub Ethnicity 1                                       | Ethnicity1                   |
      |Sub Ethnicity 2                                       | Ethnicity2                   |
      |Nationality                                           | Nationality1, Nationality2   |
      |Comments                                              | Some Comments About Coco     |
      |Occupation                                            | Some Ocupation About Coco    |
      |Current Address                                       | Coco's Current Address       |
      |Is this a permanent location?                         | Yes                          |
      |Current Location                                      | Coco's Current Location      |
      |Last Known Address                                    | Coco's Last Known Address    |
      |Last Known Location                                   | Coco's Last Known Location   |
      |Telephone                                             | Coco's Telephone             |
      |Other persons well known to the child                 | Pedro                        |
    And I should see in the 2nd "Family Details Section" subform with the follow:
      |Name                                                  | Pedro                        |
      |How are they related to the child?                    | Father                       |
      |Is this person the caregiver?                         | No                           |
      |Did the child live with this person before separation?| No                           |
      |Is the child in contact with this person?             | No                           |
      |Is the child separated from this person?              | No                           |
      |List any agency identifiers as a comma separated list | Agency3 ,Agency 4            |
      |Nickname                                              | Pepe                         |
      |Are they alive?                                       | Unknown                      |
      |If dead, please provide details                       | Unknown Information          |
      |Language                                              | Language2                    |
      |Religion                                              | Religion2                    |
      |Ethnicity                                             | Ethnicity2                   |
      |Sub Ethnicity 1                                       | Ethnicity2                   |
      |Sub Ethnicity 2                                       | Ethnicity1                   |
      |Nationality                                           | Nationality2                 |
      |Comments                                              | Some Comments About Pepe     |
      |Occupation                                            | Some Ocupation About Pepe    |
      |Current Address                                       | Pepe's Current Address       |
      |Is this a permanent location?                         | No                           |
      |Current Location                                      | Pepe's Current Location      |
      |Last Known Address                                    | Pepe's Last Known Address    |
      |Last Known Location                                   | Pepe's Last Known Location   |
      |Telephone                                             | Pepe's Telephone             |
      |Other persons well known to the child                 | Juan                         |

  Scenario: I create a case that auto calculate date of birth for family detail
    And I fill in the 1st "Family Details Section" subform with the follow:
      | Age | 39 |
    And I fill in the 2nd "Family Details Section" subform with the follow:
      | Age | 25 |
    And I press "Save"
    Then I should see "Case record successfully created" on the page
    And I should see in the 1st "Family Details Section" subform with the follow:
      | Age           | 39                            |
      | Date of Birth | Calculated date 39 years ago  |
    And I should see in the 2nd "Family Details Section" subform with the follow:
      | Age           | 25                            |
      | Date of Birth | Calculated date 25 years ago  |

  Scenario: I create a case that auto calculate age for family detail
    And I fill in the 1st "Family Details Section" subform with the follow:
      | Date of Birth | 01-Jan-1975 |
    And I fill in the 2nd "Family Details Section" subform with the follow:
      | Date of Birth | 01-Jan-1989 |
    And I press "Save"
    Then I should see "Case record successfully created" on the page
    And I should see in the 1st "Family Details Section" subform with the follow:
      | Age           | Calculated age from 1975  |
      | Date of Birth | 01-Jan-1975               |
    And I should see in the 2nd "Family Details Section" subform with the follow:
      | Age           | Calculated age from 1989  |
      | Date of Birth | 01-Jan-1989               |

  Scenario: As a logged in user When I enter an invalid number in 'Age' field I should see a validation message
    And I fill in the 1st "Family Details Section" subform with the follow:
      | Name              | Jimmy     |
      | Age               | Jimmy Age |
    And I fill in the 2nd "Family Details Section" subform with the follow:
      | Name              | Timmy     |
      | Age               | 160       |
    And I press "Save"
    Then I should see "There were problems with the following fields:" on the page
    And I should see "Family Details: Age must be a valid number" on the page
    And I should see "Family Details: Age must be between 0 and 130" on the page
