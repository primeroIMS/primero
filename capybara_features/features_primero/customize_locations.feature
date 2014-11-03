# JIRA PRIMERO-443

@javascript @primero
Feature: Customize Locations

  Background:
    And the following location country exist in the system:
      | placename           |
      | A Location Country  |
    Given I am logged in as an admin with username "primero" and password "primero"
    When I access "locations page"

  Scenario: Add location
    And I should see "New Location"
    When I follow "New Location"
    Then I should see "New Location"
    And I fill in the following:
      | Placename                                | United States             |
      | Type                                     | <Select> country          |
    And I press "Save"
    Then I should see "Location successfully added"
    And I should see "United States"

  Scenario: Select Parent
    And I follow "New Location"
    And I fill in the following:
      | Placename                                | North Carolina              |
      | Type                                     | <Select> state              |
      | Parent                                   | <Select> A Location Country |
    And I press "Save"
    Then I should see "Location successfully added"
    And I should see "North Carolina"
    And I follow "New Location"
    And I fill in the following:
      | Placename                                | Davidson                                    |
      | Type                                     | <Select> city                               |
      | Parent                                   | <Select> A Location Country::North Carolina |
    And I press "Save"
    Then I should see "Location successfully added"
    And I should see "Davidson"

  Scenario: Edit location
    And I follow "Edit"
    Then I should see "Edit Location"
    And I fill in the following:
      | Placename                                | United States             |
      | Type                                     | <Select> country          |
    And I press "Save"
    And I should see "United States"

  Scenario: Delete location
    And I should see "A Location Country"
    Then I follow "Delete"
    And I click OK in the browser popup
    Then I should not see "A Location Country"