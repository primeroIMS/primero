#JIRA PRIMERO-421

@javascript @primero @search
Feature: Tracing Request Record Owner
  As a Social worker, I want to enter information related to the record owner for tracing requests

  Background:
    Given I am logged in as an admin with username "primero_cp" and password "primero"
    When I access "tracing requests page"
    And I press the "New Tracing Request" button
    And I press the "Record Owner" button
    And I fill in the following:
      | Field/Case/Social Worker | Tom                   |
      | Caseworker Code          | <Select> Case Worker1 |
      | Agency                   | <Select> Agency1      |
      | Previous Owner           | Owner 1               |
      | Previous Agency          | Other Agency          |

  Scenario: As a logged in user, I create a tracing request by fill up record owner form
    And I press "Save"
    Then I should see "Tracing Request record successfully created" on the page
    And I should see a value for "Record state" on the show page with the value of "Valid record"
    And I should see a value for "Field/Case/Social Worker" on the show page with the value of "Tom"
    And I should see a value for "Caseworker Code" on the show page with the value of "Case Worker1"
    And I should see a value for "Agency" on the show page with the value of "Agency1"
    And I should see a value for "Previous Owner" on the show page with the value of "Owner 1"
    And I should see a value for "Previous Agency" on the show page with the value of "Other Agency"

  Scenario: As a logged in user, I edit a tracing request by changing record owner form
    And I press "Save"
    And I press the "Edit" button
    And I fill in the following:
      | Field/Case/Social Worker | James                 |
      | Caseworker Code          | <Select> Case Worker2 |
      | Agency                   | <Select> Agency2      |
      | Previous Owner           | Owner 2               |
      | Previous Agency          | Other Agency 2        |
    And I press "Save"
    Then I should see "Tracing Request was successfully updated" on the page
    And I should see a value for "Record state" on the show page with the value of "Valid record"
    And I should see a value for "Field/Case/Social Worker" on the show page with the value of "James"
    And I should see a value for "Caseworker Code" on the show page with the value of "Case Worker2"
    And I should see a value for "Agency" on the show page with the value of "Agency2"
    And I should see a value for "Previous Owner" on the show page with the value of "Owner 2"
    And I should see a value for "Previous Agency" on the show page with the value of "Other Agency 2"
