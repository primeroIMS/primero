# JIRA PRIMERO-247
# JIRA PRIMERO-248
# JIRA PRIMERO-463
# JIRA PRIMERO-562
# JIRA PRIMERO-724

@javascript @primero @search
Feature: Hide Name
  As a Social Worker I want to hide the survivor's name so that only people with access to the record can view the actual name of the child

  Scenario: As a logged in user, I create a case and hide the survivor's name
    Given I am logged in as an admin with username "primero_cp" and password "primero"
    When I access "cases page"
    And I press the "New Case" button
    And I fill in the following:
      | Name                                     | Tiki Thomas Taliaferro             |
      | Nickname                                 | Tommy                              |
      | Other Name                               | Bob                                |
      | Name(s) given to child after separation? | <Radio> No                         |
      | Sex                                      | <Select> Male                      |
    And I press "Save"
    Then I should see "Case record successfully created" on the page
    And I should see a value for "Case ID" on the show page
    And I should see a value for "Long ID" on the show page
    And I should see a value for "Name" on the show page with the value of "Tiki Thomas Taliaferro"
    And I should see a value for "Nickname" on the show page with the value of "Tommy"
    And I should see a value for "Other Name" on the show page with the value of "Bob"
    And I should see a value for "Name(s) given to child after separation?" on the show page with the value of "No"
    And I should see a value for "Date of Registration or Interview" on the show page with the value of "today's date"
    And I should see a value for "Sex" on the show page with the value of "Male"
    And I press the "Edit" button
    And I press the "Hide Name" link
    And the "Name" field should be disabled
    And the disabled "Name" field should have the value of "*****"
    And I press "Save"
    And I should see "Case was successfully updated" on the page
    And I should see a value for "Case ID" on the show page
    And I should see a value for "Long ID" on the show page
    And I should see a value for "Name" on the show page with the value of "*****"
    And I should see a value for "Nickname" on the show page with the value of "Tommy"
    And I should see a value for "Other Name" on the show page with the value of "Bob"
    And I should see a value for "Name(s) given to child after separation?" on the show page with the value of "No"
    And I should see a value for "Date of Registration or Interview" on the show page with the value of "today's date"
    And I should see a value for "Sex" on the show page with the value of "Male"
    And I press the "Edit" button
    And I press the "View Name" link
    And the "Name" field should contain "Tiki Thomas Taliaferro"
    And I press "Save"
    And I should see "Case was successfully updated" on the page
    And I should see a value for "Case ID" on the show page
    And I should see a value for "Long ID" on the show page
    And I should see a value for "Name" on the show page with the value of "Tiki Thomas Taliaferro"
    And I should see a value for "Nickname" on the show page with the value of "Tommy"
    And I should see a value for "Other Name" on the show page with the value of "Bob"
    And I should see a value for "Name(s) given to child after separation?" on the show page with the value of "No"
    And I should see a value for "Date of Registration or Interview" on the show page with the value of "today's date"
    And I should see a value for "Sex" on the show page with the value of "Male"
    When I access "cases page"
    And I should see "Tiki Thomas Taliaferro" on the page
    And I should not see "*****" on the page
    And I press the "New Case" button
    And I fill in the following:
      | Name                                     | Tiki Thomas Taliaferro             |
    And I press "Save"
    Then I should see "Case record successfully created" on the page
    And I press the "Edit" button
    And I press the "Hide Name" link
    And the "Name" field should be disabled
    And the disabled "Name" field should have the value of "*****"
    And I press "Save"
    And I should see "Case was successfully updated" on the page
    And I should see a value for "Name" on the show page with the value of "*****"
    When I access "cases page"
    And I should see "Tiki Thomas Taliaferro" on the page
    And I should see "*****" on the page

  Scenario: On the Case forms, when I change a name, hide it, then save then go back and view the name, it should be the name I edited before hiding.
    Given I am logged in as an admin with username "primero_cp" and password "primero"
    When I access "cases page"
    And I press the "New Case" button
    And I fill in "Name" with "Tiki Thomas Taliaferro"
    And I press "Save"
    Then I should see "Case record successfully created" on the page
    And I press the "Edit" button
    And I fill in "Name" with "Edited Name"
    And I press the "Hide Name" link
    And the "Name" field should be disabled
    And the disabled "Name" field should have the value of "*****"
    And I press "Save"
    And I should see "Case was successfully updated" on the page
    And I should see a value for "Name" on the show page with the value of "*****"
    And I press the "Edit" button
    And I press the "View Name" link
    And the "Name" field should contain "Edited Name"

  Scenario Outline: As a logged in user, I want to hide the survivor's name when creating the record
    Given I am logged in as an admin with username <user> and password "primero"
    When I access "cases page"
    And I press the "New Case" button
    And I fill in "Name" with "Tiki Thomas Taliaferro"
    And I check the "Hide Name" field
    And I press "Save"
    Then I should see "Case record successfully created" on the page
    And I should see a value for "Name" on the show page with the value of "*****"
    Examples:
      | user         |
      | "primero_cp" |
      | "primero_gbv"|

  Scenario Outline: When a GBV Case is created and saved, the name should be saved as Hidden on the Survivor Information form
    Given I am logged in as an admin with username <user> and password "primero"
    When I access "cases page"
    And I press the "New Case" button
    And I fill in "Name" with "Tiki Thomas Taliaferro"
    And I press "Save"
    Then I should see "Case record successfully created" on the page
    And I should see a value for "Name" on the show page with the value of <name>
    Examples:
      | user         | name                     |
      | "primero_cp" | "Tiki Thomas Taliaferro" |
      | "primero_gbv"| "*****"                  |

  Scenario: As a GBV user I should be able to show the survivor's name
    Given I am logged in as an admin with username "primero_gbv" and password "primero"
    When I access "cases page"
    And I press the "New Case" button
    And I fill in "Name" with "Tiki Thomas Taliaferro"
    And I press "Save"
    Then I should see "Case record successfully created" on the page
    And I should see a value for "Name" on the show page with the value of "*****"
    And I press the "Edit" button
    And I press the "View Name" link
    And I should see "Hide Name" on the page
    And the "Name" field should contain "Tiki Thomas Taliaferro"
    And I press "Save"
    And I should see "Case was successfully updated" on the page
    And I should see a value for "Name" on the show page with the value of "Tiki Thomas Taliaferro"