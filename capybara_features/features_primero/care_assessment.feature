# JIRA PRIMERO-164
# JIRA PRIMERO-212
# JIRA PRIMERO-353
# JIRA PRIMERO-363

@javascript @primero
Feature: Care Assessment
  As a Social Worker, I want to fill in form information for children (individuals) in particular circumstances,
  so that we can track and report on areas of particular concern.

  Scenario: As a logged in user, I create a case with Care Assessment information
    Given I am logged in as an admin with username "primero_cp" and password "primero"
    When I access "cases page"
    And I press the "New Case" button
    And I press the "Assessment" button
    And I press the "Care Assessment" button
    And I select "No Further Action Needed" from "Personal intervention needed?"
    And I select "Ongoing Monitoring" from "Family intervention needed?"
    And I select "Urgent Intervention" from "Health intervention needed?"
    And I select "No Further Action Needed" from "Medical intervention needed?"
    And I select "Urgent Intervention" from "Other Intervention needed?"
    And I fill in the following:
      | Personal Intervention Notes | Personal Notes |
      | Family Intervention Notes   | Family Notes   |
      | Health Intervention Notes   | Health Notes   |
      | Medical Intervention Notes  | Medical Notes  |
      | Other Intervention Notes    | Other Notes    |
    And I press "Save"
    Then I should see "Case record successfully created" on the page
    And I press the "Care Assessment" button
    And I should see a value for "Personal intervention needed?" on the show page with the value of "No Further Action Needed"
    And I should see a value for "Personal Intervention Notes" on the show page with the value of "Personal Notes"
    And I should see a value for "Family intervention needed?" on the show page with the value of "Ongoing Monitoring"
    And I should see a value for "Family Intervention Notes" on the show page with the value of "Family Notes"
    And I should see a value for "Health intervention needed?" on the show page with the value of "Urgent Intervention"
    And I should see a value for "Health Intervention Notes" on the show page with the value of "Health Notes"
    And I should see a value for "Medical intervention needed?" on the show page with the value of "No Further Action Needed"
    And I should see a value for "Medical Intervention Notes" on the show page with the value of "Medical Notes"
    And I should see a value for "Economic intervention needed?" on the show page with the value of ""
    And I should see a value for "Economic Intervention Notes" on the show page with the value of ""
    And I should see a value for "UNHCR intervention needed?" on the show page with the value of ""
    And I should see a value for "UNHCR Intervention Notes" on the show page with the value of ""
    And I should see a value for "Other Intervention needed?" on the show page with the value of "Urgent Intervention"
    And I should see a value for "Other Intervention Notes" on the show page with the value of "Other Notes"
