#JIRA PRIMERO-138

@javascript @primero
Feature: Limits Uploads
  As a Primero Product Owner, I want there to be limits on the number of photos and audio files that can be uploaded
  so that the system does not become overloaded
  
  Scenario: Limit upload photos files
    Given I am logged in as a social worker with username "primero" and password "primero"
    When I access "cases page"
    And I press the "Create a New Case" button
    And I press the "Photos and Audio" button
    And I press the "Add another photo" button "9" times
    Then I should not see "Add another photo" on the page
