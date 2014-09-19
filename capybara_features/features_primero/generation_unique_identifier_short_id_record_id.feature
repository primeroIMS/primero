#JIRA PRIMERO-616

@javascript @primero
Feature: Generation unique_identifier short_id record_id
  As a logged in user, I want to see the id's generated after successfully save the record.

  Scenario: As logged in user, I should see empty 'Case ID' and 'Long ID' on the new CP case
    Given I am logged in as an admin with username "primero_cp" and password "primero"
    When I access "cases page"
    And I press the "New Case" button
    And I should see a value for "Long ID" on the edit page with the value of ""
    And I should see a value for "Case ID" on the edit page with the value of ""

  Scenario: As logged in user, I should see empty 'Case ID' and 'Long ID' on the new GBV case
    Given I am logged in as an admin with username "primero_gbv" and password "primero"
    When I access "cases page"
    And I press the "New Case" button
    And I should see a value for "Long ID" on the edit page with the value of ""
    And I should see a value for "Case ID" on the edit page with the value of ""

  Scenario: As logged in user, I should see empty 'Case ID' and 'Long ID' on the new GBV incident
    Given I am logged in as an admin with username "primero_gbv" and password "primero"
    When I access "incidents page"
    And I press the "New Incident" button
    And I should see a value for "Long ID" on the edit page with the value of ""
    And I should see a value for "Incident ID" on the edit page with the value of ""

  Scenario: As logged in user, I should see empty 'Case ID' and 'Long ID' on the new MRM incident
    Given I am logged in as an admin with username "primero_mrm" and password "primero"
    When I access "incidents page"
    And I press the "New Incident" button
    And I should see a value for "Long ID" on the edit page with the value of ""
    And I should see a value for "Incident ID" on the edit page with the value of ""

  Scenario: As logged in user, I should see empty 'Case ID' and 'Long ID' on the new tracing request
    Given I am logged in as an admin with username "primero_cp" and password "primero"
    When I access "tracing requests page"
    And I press the "New Tracing Request" button
    And I should see a value for "Long ID" on the edit page with the value of ""
    And I should see a value for "Inquirer ID" on the edit page with the value of ""

  Scenario: As logged in user, I should see empty 'Case ID' and 'Long ID' on errors saving new CP case
    Given I am logged in as an admin with username "primero_cp" and password "primero"
    When I access "cases page"
    And I press the "New Case" button
    And I fill in the following:
      | Date of Registration or Interview | 21-21-1990 |
    And I press "Save"
    And I should see "There were problems with the following fields:" on the page
    And I should see a value for "Long ID" on the edit page with the value of ""
    And I should see a value for "Case ID" on the edit page with the value of ""

  Scenario: As logged in user, I should see empty 'Case ID' and 'Long ID' on errors saving new GBV case
    Given I am logged in as an admin with username "primero_gbv" and password "primero"
    When I access "cases page"
    And I press the "New Case" button
    And I fill in the following:
      | Date of Birth | 21-21-1990 |
    And I press "Save"
    And I should see "There were problems with the following fields:" on the page
    And I should see a value for "Long ID" on the edit page with the value of ""
    And I should see a value for "Case ID" on the edit page with the value of ""

  Scenario: As logged in user, I should see empty 'Case ID' and 'Long ID' on errors saving new GBV incident
    Given I am logged in as an admin with username "primero_gbv" and password "primero"
    When I access "incidents page"
    And I press the "New Incident" button
    And I fill in the following:
      | Date of Interview | 21-21-1990 |
    And I press "Save"
    And I should see "There were problems with the following fields:" on the page
    And I should see a value for "Long ID" on the edit page with the value of ""
    And I should see a value for "Incident ID" on the edit page with the value of ""

  Scenario: As logged in user, I should see empty 'Case ID' and 'Long ID' on errors saving new MRM incident
    Given I am logged in as an admin with username "primero_mrm" and password "primero"
    When I access "incidents page"
    And I press the "New Incident" button
    And I fill in the following:
      | Date of First Report | 21-21-1990 |
    And I press "Save"
    And I should see "There were problems with the following fields:" on the page
    And I should see a value for "Long ID" on the edit page with the value of ""
    And I should see a value for "Incident ID" on the edit page with the value of ""

  Scenario: As logged in user, I should see empty 'Case ID' and 'Long ID' on errors saving new tracing request
    Given I am logged in as an admin with username "primero_cp" and password "primero"
    When I access "tracing requests page"
    And I press the "New Tracing Request" button
    And I fill in the following:
      | Date of Inquiry | 21-21-1990 |
    And I press "Save"
    And I should see "There were problems with the following fields:" on the page
    And I should see a value for "Long ID" on the edit page with the value of ""
    And I should see a value for "Inquirer ID" on the edit page with the value of ""
