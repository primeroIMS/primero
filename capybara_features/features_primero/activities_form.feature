# JIRA PRIMERO-144
# JIRA PRIMERO-232
# JIRA PRIMERO-353
# JIRA PRIMERO-363

@javascript @primero
Feature: Activities Form
  As a Social Worker, I want to fill in form information for children (individuals) in particular circumstances
  so that we can track and report on areas of particular concern.

  Scenario: As a logged in user, I create a case with activities information
    Given I am logged in as an admin with username "primero" and password "primero"
    When I access "cases page"
    And I press the "Create a New Case" button
    And I press the "Services / Follow Up" button
    And I press the "Activities" button
    And I select "Yes" for "Is the Child in school or training?" radio button
    And I fill in the following:
      | Name of School | Child School Name |
    And I choose from "If not, why not?":
      | Child Labour           |
      | Sent abroad for job    |
      | Lack of Infrastructure |
    And I select "Early Childhood" from "If yes, what type of education?"
    And I select "GS3" from "If relevant, what level have they achieved?"
    And I fill in the following:
      | Start Date of Training                 | 04-May-1992 |
      | Duration of Training                   | 3           |
      | Other details about school or training | Some Other Details School/Training | 
    And I choose from "What other activities is the child involved in?":
      | Recreational Activities |
      | Livelihood activities   |
    And I fill in the following:
      | Other details about additional activities          | Some Other Details Activities  |
    And I press "Save"
    Then I should see "Case record successfully created" on the page
    And I press the "Activities" button
    And I should see a value for "Is the Child in school or training?" on the show page with the value of "Yes"
    And I should see a value for "Name of School" on the show page with the value of "Child School Name"
    And I should see a value for "If not, why not?" on the show page with the value of "Child Labour, Lack of Infrastructure, Sent abroad for job"
    And I should see a value for "If yes, what type of education?" on the show page with the value of "Early Childhood"
    And I should see a value for "If relevant, what level have they achieved?" on the show page with the value of "GS3"
    And I should see a value for "Start Date of Training" on the show page with the value of "04-May-1992"
    And I should see a value for "Duration of Training" on the show page with the value of "3"
    And I should see a value for "Other details about school or training" on the show page with the value of "Some Other Details School/Training"
    And I should see a value for "What other activities is the child involved in?" on the show page with the value of "Livelihood activities, Recreational Activities"
    And I should see a value for "Other details about additional activities" on the show page with the value of "Some Other Details Activities"
