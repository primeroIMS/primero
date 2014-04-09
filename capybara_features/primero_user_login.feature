# JIRA PRIMERO-25
Feature: As a logged out user, I can not access content until I log in

  Scenario: I am a logged out user who tries to access any page
    Given I am logged out
    When I visit any Primero Page
    Then I am redirected to the log in page

  Scenario: I log in successfully
    Given a user "primero" with a password "primero"
    When I log in as user "primero" using password "primero"
    Then I am redirected to the dashboard
    And there is a visual cue in the header showing me logged in as "primero"