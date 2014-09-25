#JIRA PRIMERO-607

@javascript @primero
Feature: Display Help Text View Empty Section
  As a User, I want to see a help text on empty forms sections

  Scenario: I should see a help text on "Photos and Audio" and "Other Documents" forms when is empty for cases
    Given I am logged in as an admin with username "primero_cp" and password "primero"
    When I access "cases page"
    And I press the "New Case" button
    And I press "Save"
    Then I should see "Case record successfully created" on the page
    And I press the "Photos and Audio" button
    And I should see "Click the EDIT button to add Photos and Audio details" on the page
    And I press the "Other Documents" button
    And I should see "Click the EDIT button to add Other Documents" on the page

  Scenario: I should see a help text on "Photos and Audio" and "Other Documents" forms when is empty for tracing requests
    Given I am logged in as an admin with username "primero_cp" and password "primero"
    When I access "tracing requests page"
    And I press the "New Tracing Request" button
    And I press "Save"
    Then I should see "Tracing Request record successfully created" on the page
    And I press the "Photos and Audio" button
    And I should see "Click the EDIT button to add Photos and Audio details" on the page

  Scenario: I should see a help text on "Other Documents" forms when is empty for incidents
    Given I am logged in as an admin with username "primero_mrm" and password "primero"
    When I access "incidents page"
    And I press the "New Incident" button
    And I press "Save"
    Then I should see "Incident record successfully created" on the page
    And I press the "Other Documents" button
    And I should see "Click the EDIT button to add Other Documents" on the page
