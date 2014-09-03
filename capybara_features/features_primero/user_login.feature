# JIRA PRIMERO-25
@javascript @primero
Feature: Primero user login
  As a logged out user, I can not access content until I log in

  Scenario Outline: I am a logged out user who tries to access any page
    When I access <page>
    Then I should see "Login details" on the page
    And I should not see "New Case" on the page
    Examples:
      | page |
      | new child page |
      | system settings page |
      | create form page |

  Scenario: I log in successfully
    Given a user "primero" with a password "primero"
    When I log in as user "primero" using password "primero"
    Then I am redirected to the dashboard
    And there is a visual cue in the header showing me "Logged in as:  primero"