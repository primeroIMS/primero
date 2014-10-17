# JIRA PRIMERO-52
@javascript @primero
Feature: Primero Home Page Link
  As a Product Owner, I want the Primero page template to include the Primero name, so that the application is branded when it is deployed for use

  Scenario Outline: I want the Primero name on every page with a link to the homepage
    Given I am logged in as an admin with username "primero" and password "primero"
    When I access <page>
    Then I should see a "Primero" button on the page
    And I press the "Primero" button
    And I should see "Scheduled Activities"
    Examples:
      | page |
      | new child page |
      | system settings page |
      | create form page |

