#JIRA PRIMERO-291

@javascript @primero
Feature: Date Of Birth Age Recalculate Edit
  As an user, I want that age will recalculated when enter on edit screen if the age is out of synchronization
  respect to the current year.

  Scenario: As a logged in user and enter to edit, I want that age be recalculated
   Given I am logged in as an admin with username "primero" and password "primero"
   And the following cases exist in the system:
     | name   | unique_identifier | age | date_of_birth |
     | timmy  | timmy             | 10  | 30-May-1990   |
   And I add to cases "timmy" the following subform "family_details_section":
     | relation_age | relation_date_of_birth |
     |     35       |   30-May-1975          |
     |     36       |   30-May-1974          |
   When I access "cases page"
   And I click the "timmy" link
   And I press the "Edit" button
   And I press "Save"
   Then I should see "Case was successfully updated" on the page
   And I should see a value for "Date of Birth" on the show page with the value of "30-May-1990"
   And I should see the calculated Age of a child born in "1990"
   And I press the "Family / Partner Details" button
   And I click on "Family Details" in form group "Family / Partner Details"
   And I should see in the 1st "Family Details Section" subform with the follow:
     | Age           | Calculated age from 1975  |
     | Date of Birth | 30-May-1975               |
   And I should see in the 2nd "Family Details Section" subform with the follow:
     | Age           | Calculated age from 1974  |
     | Date of Birth | 30-May-1974               |
