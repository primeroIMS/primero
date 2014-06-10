# JIRA PRIMERO-42
# JIRA PRIMERO-73

@javascript @primero
Feature: Protection Concern Form
  As an administrator, I want to enter information related to protection concerns 
  so that we can know the vulnerabilities of the child.
  
  Background:
    Given I am logged in as an admin with username "primero" and password "primero"
    When I access "cases page"
    And I press the "Create a New Case" button
    And I press the "Protection Concern" button

  Scenario: As a logged in user, I create a case by entering something in every field in the protection concern form    
    Then I should see the following fields:
    | Type of Protection Concern   |
    | Period when identified?      |
    | Details of the concern       |
    | Intervention needed?         |
    | Intervention needed by       |
    | Has action been taken?       |
    | Details of Action Taken      |
    | Date when action was taken   |
 
    And I fill in the following:
      | Details of the concern     | Test Details        |
      | Intervention needed by     | 12/May/2014         |
      | Details of Action Taken    | Test Action Details |
      | Date when action was taken | 12/May/2014         |

    And I select "Migrant" from "Type of Protection Concern"
    And I select "Registration" from "Period when identified?"
    And I select "Urgent Intervention" from "Intervention needed?"
    And I select "Yes" from "Has action been taken?"
    And I press "Save"

    Then I should see "Case record successfully created" on the page
    And I should see a value for "Type of Protection Concern" on the show page with the value of "Migrant"
    And I should see a value for "Period when identified?" on the show page with the value of "Registration"
    And I should see a value for "Intervention needed?" on the show page with the value of "Urgent Intervention"    
    And I should see a value for "Has action been taken?" on the show page with the value of "Yes"
    And I should see a value for "Details of the concern" on the show page with the value of "Test Details"
    And I should see a value for "Intervention needed by" on the show page with the value of "12/May/2014"
    And I should see a value for "Details of Action Taken" on the show page with the value of "Test Action Details"
    And I should see a value for "Date when action was taken" on the show page with the value of "12/May/2014"
  