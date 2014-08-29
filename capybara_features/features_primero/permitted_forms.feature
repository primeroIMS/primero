#PRIMERO-275
#PRIMERO-264

@javascript @primero
Feature: Permitted Forms
  As a user I want to access only the relevant module forms when managing a record so that I am able to maintain only the information relevant to my work.

  Scenario: As a CP user I create a new CP case record
    Given I am logged in as a social worker with username "primero_cp" and password "primero"
    When I access "cases page"
    And I press the "Create a New Case" button
    Then I should be able to access the following grouped forms:
      | Basic Identity |
      | Protection Concerns |
      | Other Identity Details |
      | Interview Details |
    And I shouldn't be able to access the following top level forms:
      | Survivor Information |


  Scenario: As a GBV user I create a new GBV case record
    Given I am logged in as a social worker with username "primero_gbv" and password "primero"
    When I access "cases page"
    And I press the "Create a New Case" button
    Then I should be able to access the following top level forms:
      | Survivor Information |
    And I shouldn't be able to access the following grouped forms:
      | Basic Identity |
      | Protection Concerns |
      | Other Identity Details |
      | Interview Details |


  Scenario: As a GBV user I create a new GBV incident record
    Given I am logged in as a social worker with username "primero_gbv" and password "primero"
    When I access "incidents page"
    And I press the "Create a New Incident" button
    #Then I should be able to access the following forms:
    #  | TBD |
    And I shouldn't be able to access the following top level forms:
      | Individual Details |
      | Group Details |
      | Source |


  Scenario: As an MRM user I create a new MRM incident record
    Given I am logged in as a social worker with username "primero_mrm" and password "primero"
    When I access "incidents page"
    And I press the "Create a New Incident" button
    Then I should be able to access the following top level forms:
      | Individual Details |
      | Group Details |
      | Source |
    #And I shouldn't be able to access the following forms:
    # | TBD |




