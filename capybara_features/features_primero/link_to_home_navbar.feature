# JIRA PRIMERO-28
@javascript @primero
Feature: Primero Home Link in Nav Bar
  I want users to be able to navigate to the dashboard from any page in the application so that they can always access their dashboard data

  Scenario Outline: I want the Primero name on every page with a link to the homepage
    Given I am logged in as an admin with username "primero" and password "primero"
    When I access <page>
    Then I should see a "HOME" button on the page
    And I press the "HOME" button
    And I should see "Scheduled Activities"
    Examples:
      | page |
      | new child page |
      | system settings page |
      | create form page |

