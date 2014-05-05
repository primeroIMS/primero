# JIRA PRIMERO-40
@javascript @primero
Feature: Link to system settings page
  As a logged in user I should be able to see a link to the system settings page

  Scenario: The system settings link exists
    Given I am logged in as an admin with username "primero" and password "primero"
    When I see the header
    Then I should have a "System Settings" link which will lead me to the "System Settings" page