#JIRA PRIMERO-286

@javascript @primero
Feature: Maiming Form
  As a Social Worker / Data Entry Person, I want to indicate the violation category
  so that I can report on all types of violations associated with the incident

  Scenario: As a logged in user, I will create a incident for maiming information
    Given I am logged in as an admin with username "primero" and password "primero"
    When I access "incidents page"
    And I press the "Create a New Incident" button
    And I press the "Maiming" button
    And I fill in the following:
      | Number of victims: boys    | 1 |
      | Number of victims: girls   | 2 |
      | Number of victims: unknown | 3 |
      | Number of total victims   | 6 |
      | Method of maiming         | <Select> Non-Victim Activated          |
      | Means of maiming          | <Select> Option 2                      |
      | Circumstances of maiming  | <Select> Indiscriminate Attack         |
      | Consequences of maiming   | <Select> Serious Injury                |
      | Context of maiming        | <Select> Weapon Used Against The Child |
      | Mine Incident             | <Radio> Yes                            |
      | Was the victim/survivor directly participating in hostilities at the time of the violation? | <Radio> No      |
      | Did the killing/maiming occur during or as a direct result of abduction?                    | <Radio> Unknown |
    And I press "Save"
    Then I should see "Incident record successfully created" on the page
    And I should see a value for "Number of victims: boys" on the show page with the value of "1"
    And I should see a value for "Number of victims: girls" on the show page with the value of "2"
    And I should see a value for "Number of victims: unknown" on the show page with the value of "3"
    And I should see a value for "Number of total victims" on the show page with the value of "6"
    And I should see a value for "Method of maiming" on the show page with the value of "Non-Victim Activated"
    And I should see a value for "Means of maiming" on the show page with the value of "Option 2"
    And I should see a value for "Circumstances of maiming" on the show page with the value of "Indiscriminate Attack"
    And I should see a value for "Consequences of maiming" on the show page with the value of "Serious Injury"
    And I should see a value for "Context of maiming" on the show page with the value of "Weapon Used Against The Child"
    And I should see a value for "Mine Incident" on the show page with the value of "Yes"
    And I should see a value for "Was the victim/survivor directly participating in hostilities at the time of the violation?" on the show page with the value of "No"
    And I should see a value for "Did the killing/maiming occur during or as a direct result of abduction?" on the show page with the value of "Unknown"
