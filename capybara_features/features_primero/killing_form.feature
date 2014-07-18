#JIRA PRIMERO-296

@javascript @primero
Feature: Killing Form
  As a User, I want to capture the weapon type for killing or maiming violations so that information is recorded for reporting purposes

  Scenario: As a logged in user, I will create a incident for killing of children
    Given I am logged in as an admin with username "primero" and password "primero"
    When I access "incidents page"
    And I press the "Create a New Incident" button
    And I press the "Killing" button
    And I fill in the following:
      | Number of victims: boys                                                                     | 1                                      |
      | Number of victims: girls                                                                    | 2                                      |
      | Number of victims: unknown                                                                  | 3                                      |
      | Number of total victims                                                                     | 6                                      |
      | Method                                                                                      | <Select> Summary                       |
      | Means                                                                                       | <Select> Option1                       |
      | Cause                                                                                       | <Select> IED                           |
      | Details                                                                                     | Some details                           |
      | Circumstances                                                                               | <Select> Direct Attack                 |
      | Consequences                                                                                | <Select> Killing                       |
      | Context                                                                                     | <Select> Weapon Used Against The Child |
      | Mine Incident                                                                               | <Radio> No                             |
      | Was the victim/survivor directly participating in hostilities at the time of the violation? | <Select> Yes                           |
      | Did the violation occur during or as a direct result of abduction?                          | <Select> Yes                           |
    And I press "Save"
    Then I should see "Incident record successfully created" on the page
    And I should see a value for "Number of victims: boys" on the show page with the value of "1"
    And I should see a value for "Number of victims: girls" on the show page with the value of "2"
    And I should see a value for "Number of victims: unknown" on the show page with the value of "3"
    And I should see a value for "Number of total victims" on the show page with the value of "6"
    And I should see a value for "Method" on the show page with the value of "Summary"
    And I should see a value for "Means" on the show page with the value of "Option1"
    And I should see a value for "Cause" on the show page with the value of "IED"
    And I should see a value for "Details" on the show page with the value of "Some details"
    And I should see a value for "Circumstances" on the show page with the value of "Direct Attack"
    And I should see a value for "Consequences" on the show page with the value of "Killing"
    And I should see a value for "Context" on the show page with the value of "Weapon Used Against The Child"
    And I should see a value for "Mine Incident" on the show page with the value of "No"
    And I should see a value for "Was the victim/survivor directly participating in hostilities at the time of the violation?" on the show page with the value of "Yes"
    And I should see a value for "Did the violation occur during or as a direct result of abduction?" on the show page with the value of "Yes"

