# JIRA PRIMERO-41
# TODO: Advanced Search link removed, and advanced search still pending.
@javascript @primero @wip
Feature: Primero nav search reports
  As a logged in user I can access search, advanced search, and reports from the nav bar

  Scenario Outline: I can access the search, advanced search and reports from any page
    Given I am logged in as an admin with username "primero" and password "primero"
    When I access <page>
    Then I should see a "Advanced Search" button on the page
    And I should see a "REPORTS" button on the page
    And I should see the "query" field
    Examples:
      | page |
      | new child page |
      | system settings page |
      | create form page |

  Scenario: I try to access advanced search from the nav bar
    Given I am logged in as an admin with username "primero" and password "primero"
    When I press the "Advanced Search" button
    Then I should see "Select A Criteria"

  Scenario: I try to access reports from the nav bar
    Given I am logged in as an admin with username "primero" and password "primero"
    When I press the "REPORTS" button
    Then I should see "RapidFTR Reports"

  @search
  Scenario: I try to search for something that does not exist
    Given I am logged in as an admin with username "primero" and password "primero"
    When I fill in the "query" field with "test"
    Then I press the "Go" button
    And I should see "No entries found"