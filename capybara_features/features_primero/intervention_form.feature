#JIRA PRIMERO-325

@javascript @primero
Feature: Intervention Form
  As a User, I want to report on action taken by the monitoring agency (or other task force member), so that we can report on this information to help encourage change in legislation, or to track the lack of resources

  Scenario: As a logged in user, I will create a incident for intervention
    Given I am logged in as an admin with username "primero" and password "primero"
    When I access "incidents page"
    And I press the "Create a New Incident" button
    And I press the "Intervention" button
    And I fill in the following:
      | Action Taken by Survivors/Families          | Action taken                  |
      | Action Date                                 | 23-Jul-2014                   |
      | Type of Action                              | <Select> Medical Intervention |
      | Body to which MRM Taskforce directed action | <Select> Option2              |
      | Taskforce notes                             | Intervention action notes     |
      | Follow Up Action - Type                     | <Select> Armed Intervention   |
      | Due Date                                    | 23-Jul-2014                   |
      | Intervention follow up notes                | Follow up notes               |
    And I press "Save"
    Then I should see "Incident record successfully created" on the page
    And I should see a value for "Action Taken by Survivors/Families" on the show page with the value of "Action taken"
    And I should see a value for "Action Date" on the show page with the value of "23-Jul-2014"
    And I should see a value for "Type of Action" on the show page with the value of "Medical Intervention"
    And I should see a value for "Body to which MRM Taskforce directed action" on the show page with the value of "Option2"
    And I should see a value for "Taskforce notes" on the show page with the value of "Intervention action notes"
    And I should see a value for "Follow Up Action - Type" on the show page with the value of "Armed Intervention"
    And I should see a value for "Due Date" on the show page with the value of "23-Jul-2014"
    And I should see a value for "Intervention follow up notes" on the show page with the value of "Follow up notes"
    And I press the "Edit" button
    And I fill in the following:
      | Action Taken by Survivors/Families          | Some other action taken        |
      | Action Date                                 | 25-Jul-2014                    |
      | Type of Action                              | <Select> Report to Police      |
      | Body to which MRM Taskforce directed action | <Select> Option3               |
      | Taskforce notes                             | Some intervention action notes |
      | Follow Up Action - Type                     | <Select> Negotiation           |
      | Due Date                                    | 25-Jul-2014                    |
      | Intervention follow up notes                | Some follow up notes           |
    And I press "Save"
    Then I should see "Incident was successfully updated." on the page
    And I should see a value for "Action Taken by Survivors/Families" on the show page with the value of "Some other action taken"
    And I should see a value for "Action Date" on the show page with the value of "25-Jul-2014"
    And I should see a value for "Type of Action" on the show page with the value of "Report to Police"
    And I should see a value for "Body to which MRM Taskforce directed action" on the show page with the value of "Option3"
    And I should see a value for "Taskforce notes" on the show page with the value of "Some intervention action notes"
    And I should see a value for "Follow Up Action - Type" on the show page with the value of "Negotiation"
    And I should see a value for "Due Date" on the show page with the value of "25-Jul-2014"
    And I should see a value for "Intervention follow up notes" on the show page with the value of "Some follow up notes"