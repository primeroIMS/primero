#JIRA PRIMERO-335
#JIRA PRIMERO-365
#JIRA PRIMERO-713
#JIRA PRIMERO-714
#JIRA PRIMERO-736

@javascript @primero
Feature: Subforms In Incidents
  As a User, I want to be able to work with subforms.

  Background:
    Given I am logged in as an admin with username "primero_mrm" and password "primero"
    When I access "incidents page"
    And I press the "New Incident" button
    And I press the "Group Details" button
    And I fill in the following:
      | Description of the Group of Children | John Doe |
    And I remove the 1st "Group Details Section" subform
    And I click OK in the browser popup
    # there is fadeout effect when remove subforms, so wait a bit.
    And I wait for 1 seconds
    And I add a "Group Details Section" subform
    And I fill in the following:
      | Description of the Group of Children | Jane Doe |

  Scenario: As a logged in user and create incident, I should be able to remove all subforms and add new subforms
    And I press "Save"
    Then I should see a success message for new Incident
    And I should see in the 1st "Group Details Section" subform with the follow:
      |Description of the Group of Children | Jane Doe |

  Scenario: As a logged in user and edit incident, I should be able to remove all subforms and add new subforms
    And I press "Save"
    And I press the "Edit" button
    And I remove the 1st "Group Details Section" subform
    And I click OK in the browser popup
    And I wait for 1 seconds
    And I add a "Group Details Section" subform
    And I fill in the following:
      | Description of the Group of Children | Timmy |
    And I press "Save"
    Then I should see a success message for updated Incident
    And I should see in the 1st "Group Details Section" subform with the follow:
      |Description of the Group of Children | Timmy |

  Scenario: As a logged in user and edit incident, I should be able to remove some subforms and add new subforms
    And I press "Save"
    And I press the "Edit" button
    And I fill in the 2nd "Group Details Section" subform with the follow:
      | Description of the Group of Children | John Doe |
    And I press "Save"
    And I press the "Edit" button
    And I remove the 2nd "Group Details Section" subform
    And I click OK in the browser popup
    And I wait for 1 seconds
    And I fill in the 3rd "Group Details Section" subform with the follow:
      | Description of the Group of Children | Timmy |
    And I press "Save"
    Then I should see a success message for updated Incident
    And I should see in the 1st "Group Details Section" subform with the follow:
      |Description of the Group of Children | Jane Doe |
    And I should see in the 2nd "Group Details Section" subform with the follow:
      |Description of the Group of Children | Timmy    |

  Scenario: As a logged in user and create incident, I should be able to remove all subforms and create
    And I remove the 2nd "Group Details Section" subform
    And I click OK in the browser popup
    And I wait for 1 seconds
    And I press "Save"
    Then I should see a success message for new Incident
    And I should not see "John Doe" on the page
    And I should not see "Timmy" on the page
    And I should not see "Jane Doe" on the page

  Scenario: As a logged in user and edit incident, I should be able to remove all subforms and update
    And I fill in the 3rd "Group Details Section" subform with the follow:
      | Description of the Group of Children | Timmy |
    And I press "Save"
    And I press the "Edit" button
    And I remove the 1st "Group Details Section" subform
    And I click OK in the browser popup
    And I wait for 1 seconds
    And I remove the 2nd "Group Details Section" subform
    And I click OK in the browser popup
    And I wait for 1 seconds
    And I press "Save"
    Then I should see a success message for updated Incident
    And I should not see "John Doe" on the page
    And I should not see "Timmy" on the page
    And I should not see "Jane Doe" on the page

  Scenario: As a logged in user and create an incident, I should only have the same amount of subform created on error
    And I press the "Violations" button
    And I press the "Killing" button
    And I fill in the following:
       | Number of victims        | <Tally>Boys:bad_number  |
    And I press "Save"
    And I should see "Errors prohibited this record from being saved" on the page
    And I should see "There were problems with the following fields" on the page
    And I should see "Killing: Number of victims: boys must be a valid number" on the page
    And I should see 1 subform on the form page for "Killing"
    And I expanded the 1st "Killing" subform
    And I fill in the following:
       | Number of victims        | <Tally>Boys:3  |
    And I press the "Group Details" button
    And I should see 1 subform on the form page for "Group Details Section"
    And I add a "Group Details Section" subform
    And I fill in the following:
      | Description of the Group of Children | Jane Doe |
    And I press "Save"
    Then I should see a success message for new Incident
    And I should see 2 subform on the show page for "Group Details Section"
    And I press the "Violations" button
    And I press the "Killing" button
    And I should see 1 subform on the show page for "Killing"

  Scenario: As a logged in user I should be able to remove all violations subforms
    And I press the "Violations" button
    And I press the "Killing" button
    And I fill in the following:
      | Number of victims                                                                  | <Tally>Boys:1<Tally>Girls:2<Tally>Unknown:3  |
      | Method                                                                             | <Select> Summary                             |
      | Cause                                                                              | <Select> IED                                 |
    And I press "Save"
    Then I should see a success message for new Incident
    And I should see 1 subform on the show page for "Killing"
    And I should see in the 1st "Killing" subform with the follow:
      | Number of victims                                                                  |<Tally> Boys:1 Girls:2 Unknown:3 Total number of victims:6 |
      | Method                                                                             | Summary                       |
      | Cause                                                                              | IED                           |
    Then I should not see "Incident was successfully updated" on the page
    And I press the "Edit" button
    And I remove the 1st "Killing" subform
    And I click OK in the browser popup
    And I wait for 1 seconds
    And I press "Save"
    And I should see "Click the edit button to add Killing details" on the page
    Then I should see a success message for updated Incident