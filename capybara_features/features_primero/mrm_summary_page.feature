# JIRA PRIMERO-720

@javascript @primero
Feature: MRM Summary Page
  As an administrator, See a summary of the submitted violations

  Scenario: As a logged in user, I create a incident with violations and view the summary page
    Given I am logged in as an admin with username "primero_mrm" and password "primero"
    When I access "incidents page"
    And I press the "New Incident" button
    And I press the "Incident" button
    And I fill in the following:
      | Account of Incident                | Test Account                                  |
      | Incident Total Victims/Survivors   | <Tally>Boys:3<Tally>Girls:22<Tally>Unknown:35 |
    And I press the "Incident" button
    And I choose from "Violation Category":
     | Killing of Children |
    And I press the "Violations" button
    And I press the "Killing" button
    And I fill in the following:
      | Number of victims | <Tally>Boys:1<Tally>Girls:2<Tally>Unknown:3  |
      | Cause             | <Select> IED                                 |
    And I press "Save"
    And I press the "Summary Page" button
    Then I should see a value for "Incident Total Victims/Survivors" on the show page with the value of "<Tally>Boys:3 <Tally>Girls:22 <Tally>Unknown:35 Total incident total victims/survivors:60"
    And I should see a value for "Account of Incident" on the show page with the value of "Test Account"
