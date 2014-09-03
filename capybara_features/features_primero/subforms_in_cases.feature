#JIRA PRIMERO-335
# JIRA PRIMERO-353
# JIRA PRIMERO-363
#JIRA PRIMERO-365

@javascript @primero
Feature: Subforms In Cases
  As a User, I want to be able to work with subforms.

  Background:
    Given I am logged in as an admin with username "primero_cp" and password "primero"
    When I access "cases page"
    And I press the "New Case" button
    And I press the "Family / Partner Details" button
    And I press the "Family Details" button
    And I add a "Family Details Section" subform
    And I fill in the following:
      | Name | John Doe |
    And I remove the 1st "Family Details Section" subform
    And I click OK in the browser popup
    # there is fadeout effect when remove subforms, so make a bit.
    And I wait for 1 seconds
    And I add a "Family Details Section" subform
    And I fill in the following:
      | Name | Jane Doe |

  Scenario: As a logged in user and create case, I should be able to remove all subforms and add new subforms
    And I press "Save"
    Then I should see "Case record successfully created" on the page
    And I should see in the 1st "Family Details Section" subform with the follow:
      |Name | Jane Doe |

  Scenario: As a logged in user and edit case, I should be able to remove all subforms and add new subforms
    And I press "Save"
    And I press the "Edit" button
    And I remove the 1st "Family Details Section" subform
    And I click OK in the browser popup
    And I wait for 1 seconds
    And I add a "Family Details Section" subform
    And I fill in the following:
      | Name | Timmy |
    And I press "Save"
    Then I should see "Case was successfully updated" on the page
    And I should see in the 1st "Family Details Section" subform with the follow:
      |Name | Timmy |

  Scenario: As a logged in user and edit case, I should be able to remove some subforms and add new subforms
    And I press "Save"
    And I press the "Edit" button
    And I fill in the 2nd "Family Details Section" subform with the follow:
      | Name | John Doe |
    And I press "Save"
    And I press the "Edit" button
    And I remove the 2nd "Family Details Section" subform
    And I click OK in the browser popup
    And I wait for 1 seconds
    And I fill in the 3rd "Family Details Section" subform with the follow:
      | Name | Timmy |
    And I press "Save"
    Then I should see "Case was successfully updated" on the page
    And I should see in the 1st "Family Details Section" subform with the follow:
      |Name | Jane Doe |
    And I should see in the 2nd "Family Details Section" subform with the follow:
      |Name | Timmy    |

  Scenario: As a logged in user and create case, I should be able to remove all subforms and create
    And I remove the 2nd "Family Details Section" subform
    And I click OK in the browser popup
    And I wait for 1 seconds
    And I press "Save"
    Then I should see "Case record successfully created" on the page
    And I should not see "John Doe" on the page
    And I should not see "Timmy" on the page
    And I should not see "Jane Doe" on the page

  Scenario: As a logged in user and edit case, I should be able to remove all subforms and update
    And I fill in the 3rd "Family Details Section" subform with the follow:
      | Name | Timmy |
    And I press "Save"
    And I press the "Edit" button
    And I remove the 1st "Family Details Section" subform
    And I click OK in the browser popup
    And I wait for 1 seconds
    And I remove the 2nd "Family Details Section" subform
    And I click OK in the browser popup
    And I wait for 1 seconds
    And I press "Save"
    Then I should see "Case was successfully updated" on the page
    And I should not see "John Doe" on the page
    And I should not see "Timmy" on the page
    And I should not see "Jane Doe" on the page
