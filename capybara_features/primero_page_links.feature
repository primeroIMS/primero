# JIRA PRIMERO-39

@javascript
Feature: Primero page links

  Scenario: As a logged in user I should be able to see a link and navigate to the contact & help page
    Given I am logged in as an admin with username "primero" and password "primero"
    When I see the header
    Then I should have a "Contact & Help" link which will lead me to the "Contact & Help" page