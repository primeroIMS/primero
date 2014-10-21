# JIRA PRIMERO-440
#TODO - Fill in missing pieces after Josh has styled lookup customization

@javascript @primero
Feature: Customize Lookups

  Background:
    Given I am logged in as an admin with username "primero" and password "primero"
    When I access "lookups page"

  Scenario: Add, edit and delete lookup
    And I should see "New Lookup"

    When I follow "New Lookup"
    Then I should see "New Lookup"
    And I fill in "Name" with "Test Lookup"
    And I click the "Save" button

    Then I should see "Please select at least one lookup value"
    And I update the 1st lookup value with "ONE"
    And I update the 2nd lookup value with "TWO"
    And I click the "Save" button

    Then I should see "Lookup successfully added"

    Then I follow "Edit"
    #And I click the "Add Option" button
    #And I update the 3rd lookup value with "THREE"
    And I click the "Save" button

    And I follow "Delete"
    And I click OK in the browser popup
    Then I should not see "Test Lookup"
    #And I should not see "????"