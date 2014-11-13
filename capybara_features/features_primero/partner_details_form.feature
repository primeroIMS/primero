# JIRA PRIMERO-198
# JIRA PRIMERO-353
# JIRA PRIMERO-363
# JIRA PRIMERO-417
# JIRA PRIMERO-736

@javascript @primero
Feature: Partner Details Form
  As a user, I want to enter information on the marital details of a case person, so that I can track information about spouses or significant others.

  Scenario: As a user, I want to enter information on the marital details of a case person, so that I can track information about spouses or significant others.
    Given I am logged in as an admin with username "primero_cp" and password "primero"
    When I access "cases page"
    And I press the "New Case" button
    And I press the "Family / Partner Details" button
    And I click on "Partner/Spouse Details" in form group "Family / Partner Details"
    And I fill in the following:
      | Partner/Spouse Details                              |Some details|
      | Length of Marriage/Relationship                     |6 weeks     |
      | Number of Children                                  |2           |
      | Partner/Spouse Details During Separation            |Some details|
      | Length of Marriage/Relationship During Separation   |1 week      |
      | Number of Children During Separation                |2           |
      | Partner/Spouse Details Prior to Separation          |Some details|
      | Length of Marriage/Relationship Prior to Separation |2 weeks     |
      | Number of Children Prior to Separation              |2           |
    And I select "Married" from "Marital Status During Separation"
    And I select "Single" from "Marital Status Prior to Separation"
    And I press "Save"
    Then I should see a success message for new Case
    And I should see a value for "Partner/Spouse Details" on the show page with the value of "Some details"
    And I should see a value for "Length of Marriage/Relationship" on the show page with the value of "6 weeks"
    And I should see a value for "Number of Children" on the show page with the value of "2"
    And I should see a value for "Partner/Spouse Details During Separation" on the show page with the value of "Some details"
    And I should see a value for "Length of Marriage/Relationship During Separation" on the show page with the value of "1 week"
    And I should see a value for "Number of Children During Separation" on the show page with the value of "2"
    And I should see a value for "Partner/Spouse Details Prior to Separation" on the show page with the value of "Some details"
    And I should see a value for "Length of Marriage/Relationship Prior to Separation" on the show page with the value of "2 weeks"
    And I should see a value for "Number of Children Prior to Separation" on the show page with the value of "2"