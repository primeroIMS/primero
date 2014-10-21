# JIRA PRIMERO-440

@javascript @primero
Feature: Customize Lookups

  Background:
    Given I am logged in as an admin with username "primero" and password "primero"
    When I access "lookups page"

  Scenario: Add, edit and delete lookup
    And I should see "New Lookup"
    When I follow "New Lookup"
    Then I should see "New Lookup"
    And I should see 2 lookup values on the page
    And I fill in "Name" with "Test Lookup"
    And I click the "Save" button
    Then I should see "Please select at least one lookup value"
    And I update the 1st lookup value with "ONE"
    And I update the 2nd lookup value with "TWO"
    And I click the "Save" button
    Then I should see "Lookup successfully added"
    And I should see "Test Lookup"
    Then I follow "Edit"
    And I add a lookup value
    And I should see 3 lookup values on the page
    And I update the 3rd lookup value with "THREE"
    And I click the "Save" button
    Then I follow "Edit"
    And I remove the 1st lookup value
    And I should see 2 lookup values on the page
    And I click the "Save" button
    And I follow "Delete"
    And I click OK in the browser popup
    Then I should not see "Test Lookup"