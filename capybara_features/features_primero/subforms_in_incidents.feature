#JIRA PRIMERO-335
#JIRA PRIMERO-365

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
    Then I should see "Incident record successfully created" on the page
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
    Then I should see "Incident was successfully updated" on the page
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
    Then I should see "Incident was successfully updated" on the page
    And I should see in the 1st "Group Details Section" subform with the follow:
      |Description of the Group of Children | Jane Doe |
    And I should see in the 2nd "Group Details Section" subform with the follow:
      |Description of the Group of Children | Timmy    |

  Scenario: As a logged in user and create incident, I should be able to remove all subforms and create
    And I remove the 2nd "Group Details Section" subform
    And I click OK in the browser popup
    And I wait for 1 seconds
    And I press "Save"
    Then I should see "Incident record successfully created" on the page
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
    Then I should see "Incident was successfully updated" on the page
    And I should not see "John Doe" on the page
    And I should not see "Timmy" on the page
    And I should not see "Jane Doe" on the page
