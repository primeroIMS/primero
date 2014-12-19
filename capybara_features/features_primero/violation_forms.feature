#JIRA PRIMERO-942

@javascript @primero
Feature: Violation Forms

  Scenario: When creating a new MRM Incident, add any violation type on the Incident page, then save.
    Click on the Violation form group, text should say 'Click the edit button to add Violation details.'
    Given I am logged in as an admin with username "primero_mrm" and password "primero"
    When I access "incidents page"
    And I press the "New Incident" button
    And I press the "Incident" button
    And I choose from "Violation Category":
     | Killing of Children |
    And I press the "Violations" button
    And I press the "Killing" button
    And I press "Save"
    And I should see a success message for new Incident
    And I should see "Click the edit button to add Violation details" on the page