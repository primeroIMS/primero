# JIRA PRIMERO-198

@javascript @primero
Feature: Partner Details Form
  As a user, I want to enter information on the marital details of a case person, so that I can track information about spouses or significant others. 

  Scenario: As a logged in user, I should access the form section Partner Details
    Given I am logged in as an admin with username "primero" and password "primero"
    When I access "form section page"
    And I press the "Partner Details" button
    And I should see the following fields:
      | Partner's Details                                   |
      | Length of Marriage/Relationship                     |
      | Number of Children                                  |
      | Marital Status During Separation                    |
      | Partner's Details During Separation                 |
      | Length of Marriage/Relationship During Separation   |
      | Number of Children During Separation                |
      | Marital Status Prior to Separation                  |
      | Partner's Details Prior to Separation               |
      | Length of Marriage/Relationship Prior to Separation |
      | Number of Children Prior to Separation              |

  Scenario: As a user, I want to enter information on the marital details of a case person, so that I can track information about spouses or significant others. 
    Given I am logged in as an admin with username "primero" and password "primero"
    When I access "cases page"
    And I press the "Create a New Case" button
    And I press the "Partner Details" button
    And I fill in the following:
      | Partner's Details                                   |Some details|
      | Length of Marriage/Relationship                     |6           |
      | Number of Children                                  |2           |
      | Partner's Details During Separation                 |Some details|
      | Length of Marriage/Relationship During Separation   |1           |
      | Number of Children During Separation                |2           |
      | Partner's Details Prior to Separation               |Some details|
      | Length of Marriage/Relationship Prior to Separation |1           |
      | Number of Children Prior to Separation              |2           |
    And I select "Married" from "Marital Status During Separation"
    And I select "Single" from "Marital Status Prior to Separation"
    And I press "Save"
    Then I should see "Case record successfully created" on the page
    And I should see a value for "Partner's Details" on the show page with the value of "Some details"
    And I should see a value for "Length of Marriage/Relationship" on the show page with the value of "6"
    And I should see a value for "Number of Children" on the show page with the value of "2"
    And I should see a value for "Partner's Details During Separation" on the show page with the value of "Some details"
    And I should see a value for "Length of Marriage/Relationship During Separation" on the show page with the value of "1"
    And I should see a value for "Number of Children During Separation" on the show page with the value of "2"
    And I should see a value for "Partner's Details Prior to Separation" on the show page with the value of "Some details"
    And I should see a value for "Length of Marriage/Relationship Prior to Separation" on the show page with the value of "1"
    And I should see a value for "Number of Children Prior to Separation" on the show page with the value of "2"