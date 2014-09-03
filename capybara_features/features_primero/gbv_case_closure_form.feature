# JIRA PRIMERO-486

@javascript @primero
Feature: GBV Case Closure Form
  As a Social GBV Worker / Data Entry Person, I want to create an case record in Primero
  so that I can enter details about a GBV case closure.

  Scenario: As a logged in user, I create a new case
    Given I am logged in as an admin with username "primero_gbv" and password "primero"
    When I access "cases page"
    And I press the "New Case" button
    And I press the "Case Closure" button
    And I fill in the following:
      | Case Closure Date                                                                                                                          | 03-Sep-2014                  |
      | Closure Assessement                                                                                                                        | Closure assessement          |
      | Survivor’s needs have been met to the extent possible or there has been no client contact for a specified period (e.g., more than 30 days) | <Radio> Yes                  |
      | Explain (survivor's needs)                                                                                                                 | Survivor's needs explanation |
      | Survivor’s safety plan has been reviewed and is in place                                                                                   | <Radio> No                   |
      | Explain (safety plan)                                                                                                                      | Safety plan explanation      |
      | The case plan is complete and satisfactory, and follow-up is finished                                                                      | <Radio> Yes                  |
      | Explain (complete and satisfactory)                                                                                                        | Some text                    |
      | The survivor client and caseworker agree that no further support is needed                                                                 | <Radio> Yes                  |
      | Survivor has been informed that she can resume services at any time                                                                        | <Radio> Yes                  |
      | Case supervisor has reviewed case closure/exit plan                                                                                        | <Radio> Yes                  |
    And I press "Save"
    Then I should see "Case record successfully created" on the page
    And I should see a value for "Case Closure Date" on the show page with the value of "03-Sep-2014"
    And I should see a value for "Closure Assessement" on the show page with the value of "Closure assessement"
    And I should see a value for "Survivor’s needs have been met to the extent possible or there has been no client contact for a specified period (e.g., more than 30 days)" on the show page with the value of "Yes"
    And I should see a value for "Explain (survivor's needs)" on the show page with the value of "Survivor's needs explanation"
    And I should see a value for "Survivor’s safety plan has been reviewed and is in place" on the show page with the value of "No"
    And I should see a value for "Explain (safety plan)" on the show page with the value of "Safety plan explanation"
    And I should see a value for "The case plan is complete and satisfactory, and follow-up is finished" on the show page with the value of "Yes"
    And I should see a value for "Explain (complete and satisfactory)" on the show page with the value of "Some text"
    And I should see a value for "The survivor client and caseworker agree that no further support is needed" on the show page with the value of "Yes"
    And I should see a value for "Survivor has been informed that she can resume services at any time" on the show page with the value of "Yes"
    And I should see a value for "Case supervisor has reviewed case closure/exit plan" on the show page with the value of "Yes"

  Scenario: Validations
  Given I am logged in as an admin with username "primero_gbv" and password "primero"
    When I access "cases page"
    And I press the "New Case" button
    And I press the "Case Closure" button
    And I fill in the following:
      | Case Closure Date | 03-Sep-2001 |
    And I press "Save"
    Then I should see "The Case Closure Date should be greater or equal than Case Opening Date." on the page
    And I fill in the following:
      | Case Closure Date | 03-Sep-2014 |
    And I press "Save"
    Then I should see "Case record successfully created" on the page
    And I should see a value for "Case Closure Date" on the show page with the value of "03-Sep-2014"