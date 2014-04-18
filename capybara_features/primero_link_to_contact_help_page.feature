# JIRA PRIMERO-39
@javascript
Feature: Link to contacts & help page
  As a logged in user I should be able to see a link to the contact & help page

  Scenario: The contact and help link exists
    Given I am logged in as an admin with username "primero" and password "primero"
    When I see the header
    Then I should have a "Contact & Help" link which will lead me to the "Contact & Help" page