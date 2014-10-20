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
    #And I fill in "Options" with "ONE"
    #And I fill in "Options" with "TWO"
    #And I click the "Save" button

    #Then I should see "Lookup Successfully Added"

    #Then I follow "Edit"
    #Then I should see "???"
    #And I fill in "???" with "???"
    #And I click on "Add Option"
    #And I fill in "????"
    #And I click the "Save" button

    #Then I should see "???"

    #And I follow "Delete"
    #And I click OK in the browser popup
    #Then I should not see "Test Lookup"
    #And I should not see "????"