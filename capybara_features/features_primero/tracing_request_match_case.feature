#JIRA PRIMERO-477
#JIRA PRIMERO-842

@javascript @primero @search
Feature: Tracing Request Match Case
  As a Social worker, I want to match a tracing request to a case

  Background:
    Given I am logged in as an admin with username "primero_cp" and password "primero"
    And the following cases exist in the system:
      | name             | name_nickname | created_by     | date_of_birth | sex    | child_status | language  | religion    | nationality  | ethnicity   | sub_ethnicity_1 | unique_identifier                    |
      | Norville Rogers  | Shaggy        | primero_cp     | 2000/03/01    | male   | open         | Language2 | Religion1   | Nationality1 | Ethnicity1  | Ethnicity1      | 21c4cba8-b410-4af6-b349-68c557af3aa9 |
      | Fred Jones       |               | someone_else   | 2005/08/30    | male   | open         | Language4 | Religion3   | Nationality1 | Ethnicity1  | Ethnicity1      | 31c4cba8-b410-4af6-b349-68c557af3aa8 |
      | Daphne Blake     |               | another_person | 2006/07/10    | female | open         | Language3 | Religion1   | Nationality1 | Ethnicity1  | Ethnicity1      | 41c4cba8-b410-4af6-b349-68c557af3aa7 |
      | Velma Dinkley    |               | primero_cp     | 2006/06/10    | female | closed       | Language3 | Religion1   | Nationality1 | Ethnicity1  | Ethnicity1      | 51c4cba8-b410-4af6-b349-68c557af3aa6 |
      | Norville Smith   |               | primero_cp     | 2010/06/10    | male   | open         | Language3 | Religion1   | Nationality1 | Ethnicity2  | Ethnicity1      | 61c4cba8-b410-4af6-b349-68c557af3aa5 |
      | Norville Jones   |               | primero_cp     | 2014/06/10    | female | open         | Language1 | Religion1   | Nationality1 | Ethnicity1  | Ethnicity1      | 61c4cba8-b410-4af6-b349-68c557af3aa4 |
      | Fred Smith       |               | primero_cp     | 1998/06/10    | male   | open         | Language3 | Religion1   | Nationality1 | Ethnicity1  | Ethnicity1      | 61c4cba8-b410-4af6-b349-68c557af3aa3 |
      | Freddie Johnson  |               | primero_cp     | 2002/06/10    | male   | open         | Language3 | Religion1   | Nationality1 | Ethnicity1  | Ethnicity1      | 61c4cba8-b410-4af6-b349-68c557af3aa2 |
      | Lucy Smith       |               | primero_cp     | 2009/06/10    | female | open         | Language3 | Religion1   | Nationality4 | Ethnicity1  | Ethnicity4      | 61c4cba8-b410-4af6-b349-68c557af3aa1 |
      | Lucy Smith       |               | primero_cp     | 2009/06/10    | female | open         | Language3 | Religion1   | Nationality1 | Ethnicity3  | Ethnicity1      | 61c4cba8-b410-4af6-b349-68c557af3aa0 |
    And the following lookups exist in the system:
      | name           | lookup_values                                          |
      | language       | Language1, Language2, Language3, Language4             |
      | religion       | Religion1, Religion2, Religion3, Religion4             |
      | nationality    | Nationality1, Nationality2, Nationality3, Nationality4 |
      | ethnicity      | Ethnicity1, Ethnicity2, Ethnicity3, Ethnicity4         |
    When I access "tracing requests page"
    And I press the "New Tracing Request" button

  Scenario: As a logged in user, I match a tracing request by full name
    And I press the "Tracing Request" button
    And I update in the 1st "Tracing Request Subform Section" subform with the follow:
      | Name            | Norville Rogers      |
    And I press "Save"
    Then I should see a success message for new Tracing Request
    And I click the "Find Match" link
    And I should see "Displaying all 3 cases"
    And I should see an id "7af3aa9" link on the page
    And I should see an id "7af3aa5" link on the page
    And I should see an id "7af3aa4" link on the page
    And I click the "7af3aa9" link
    Then I should see a "Match" button on the page
    And I click the "Match" link
    Then I should see "Records Matched"

  Scenario: As a logged in user, I match a tracing request by nickname
    And I press the "Tracing Request" button
    And I update in the 1st "Tracing Request Subform Section" subform with the follow:
      | Nickname            | Shaggy      |
    And I press "Save"
    Then I should see a success message for new Tracing Request
    And I click the "Find Match" link
    And I should see "Displaying 1 case"
    And I should see an id "7af3aa9" link on the page

  Scenario: As a logged in user, I match a tracing request by sex
    And I press the "Tracing Request" button
    And I update in the 1st "Tracing Request Subform Section" subform with the follow:
      | Sex             | <Select> Female |
    And I press "Save"
    Then I should see a success message for new Tracing Request
    And I click the "Find Match" link
    # The closed case should not display
    And I should see "Displaying all 4 cases"
    And I should see an id "7af3aa7" link on the page
    And I should see an id "7af3aa4" link on the page
    And I should see an id "7af3aa1" link on the page
    And I should see an id "7af3aa0" link on the page

  Scenario: As a logged in user, I match a tracing request by approximate date of birth
    And I press the "Tracing Request" button
    And I update in the 1st "Tracing Request Subform Section" subform with the follow:
      | Date of Birth            | 25-Sep-1999      |
    And I press "Save"
    Then I should see a success message for new Tracing Request
    And I click the "Find Match" link
    And I should see "Displaying all 2 cases"
    And I should see an id "7af3aa9" link on the page
    And I should see an id "7af3aa3" link on the page

  Scenario: As a logged in user, I match a tracing request by multiple fields
    And I press the "Tracing Request" button
    And I update in the 1st "Tracing Request Subform Section" subform with the follow:
      | Name            | Norville Smith   |
      | Sex             | <Select> Male    |
      | Date of Birth   | 10-Jun-2010      |
    And I press "Save"
    Then I should see a success message for new Tracing Request
    And I click the "Find Match" link
    And I should see "Displaying all 5 cases"
    And I should see an id "7af3aa5" link on the page    
    And I should see an id "7af3aa9" link on the page
    And I should see an id "7af3aa3" link on the page
    And I should see an id "7af3aa1" link on the page
    And I should see an id "7af3aa0" link on the page

  Scenario: As a logged in user, I match a tracing request by language
    And I press the "Inquirer" button
    And I fill in the following:
      | Language                                | <Choose>Language1     |
    And I press the "Tracing Request" button
    And I update in the 1st "Tracing Request Subform Section" subform with the follow:
      | Name            | Norville  |
    And I press "Save"
    Then I should see a success message for new Tracing Request
    And I click the "Find Match" link
    And I should see "Displaying 1 case"
    And I should see an id "7af3aa4" link on the page

  Scenario: As a logged in user, I match a tracing request by religion
    And I press the "Inquirer" button
    And I fill in the following:
      | Religion                                | <Choose>Religion3     |
    And I press the "Tracing Request" button
    And I update in the 1st "Tracing Request Subform Section" subform with the follow:
      | Name            | Jones  |
    And I press "Save"
    Then I should see a success message for new Tracing Request
    And I click the "Find Match" link
    And I should see "Displaying 1 case"
    And I should see an id "7af3aa8" link on the page

  Scenario: As a logged in user, I match a tracing request by nationality
    And I press the "Inquirer" button
    And I fill in the following:
      | Nationality                                | <Choose>Nationality4     |
    And I press the "Tracing Request" button
    And I update in the 1st "Tracing Request Subform Section" subform with the follow:
      | Name            | Smith  |
    And I press "Save"
    Then I should see a success message for new Tracing Request
    And I click the "Find Match" link
    And I should see "Displaying 1 case"
    And I should see an id "7af3aa1" link on the page

  Scenario: As a logged in user, I match a tracing request by ethnicity
    And I press the "Inquirer" button
    And I fill in the following:
      | Ethnicity                                | <Select> Ethnicity2     |
    And I press the "Tracing Request" button
    And I update in the 1st "Tracing Request Subform Section" subform with the follow:
      | Name            | Smith  |
    And I press "Save"
    Then I should see a success message for new Tracing Request
    And I click the "Find Match" link
    And I should see "Displaying 1 case"
    And I should see an id "7af3aa5" link on the page

  Scenario: As a logged in user, I match a tracing request by sub ethnicity
    And I press the "Inquirer" button
    And I fill in the following:
      | Sub Ethnicity 1         | <Select> Ethnicity3     |
    And I press the "Tracing Request" button
    And I update in the 1st "Tracing Request Subform Section" subform with the follow:
      | Name            | Smith  |
    And I press "Save"
    Then I should see a success message for new Tracing Request
    And I click the "Find Match" link
    And I should see "Displaying 1 case"
    And I should see an id "7af3aa0" link on the page

  Scenario: As a logged in user, I match a tracing request if ethnicity matches sub ethnicity
    And I press the "Inquirer" button
    And I fill in the following:
      | Ethnicity         | <Select> Ethnicity4     |
    And I press the "Tracing Request" button
    And I update in the 1st "Tracing Request Subform Section" subform with the follow:
      | Name            | Smith  |
    And I press "Save"
    Then I should see a success message for new Tracing Request
    And I click the "Find Match" link
    And I should see "Displaying 1 case"
    And I should see an id "7af3aa1" link on the page