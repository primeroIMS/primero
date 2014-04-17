# JIRA PRIMERO-52
Feature: Home Page Link
  Primero Name in the Header

  Scenario Outline: I want the Primero name on every page with a link to the homepage
    Given I am logged in as an admin with username "primero" and password "primero"
    When I access "<page>"
    Then I should see a "Primero" button on the page
    And I press the "Primero" button
    And I should see "Welcome to RapidFTR"
    Examples:
      | page |
      | new child page |
      | system settings page |
      | create form page |

