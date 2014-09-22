#JIRA PRIMERO-422

@javascript @primero @search
Feature: Tracing Request Inquirer
  As a Social worker, I want to enter information related to the inquirer for tracing requests

  Background:
    Given I am logged in as an admin with username "primero_cp" and password "primero"
    And the following location country exist in the system:
      | placename                 |
      | Current Location Value    |
      | Separation Location Value |
      | Last Location Value       |
      | Update Current Location Value    |
      | Update Separation Location Value |
      | Update Last Location Value place |
      
    When I access "tracing requests page"
    And I press the "New Tracing Request" button
    And I press the "Inquirer" button
    And I fill in the following:
      | Inquiry Status                          | <Select> Open             |
      | Name of inquirer                        | Tim                       |
      | How are they related to the child?      | <Select> Father           |
      | Nickname of inquirer                    | Timmy                     |
      | Date of Birth                           | 30-May-1990               |
      | Additional details / comments           | This is a test            |
      | Current Address                         | Current Address Value     |
      | Current Location                        | <Choose>Current Location Value    |
      | Is this a permanent location?           | <Tickbox>                 |
      | Telephone                               | Telephone Value           |
      | Date of Separation                      | 26-Jul-2006               |
      | What was the main cause of separation?  | <Select> Migration        |
      | Did the separation occur in relation to evacuation?  | <Tickbox>                         |
      | Circumstances of Separation (please provide details) | Details about the separation here |
      | Separation Address (Place)  | Separation Address (Place) Value  |
      | Separation Location         | <Choose>Separation Location Value |
      | Last Address                | Last Address Value                |
      | Last Landmark               | Last Landmark Value               |
      | Last Location               | <Choose>Last Location Value       |
      | Last Telephone              | Last Telephone Value              |
      | Additional info that could help in tracing? | It is at some place in the world  |

  Scenario: As a logged in user, I create a tracing request by fill up inquirer form
    And the value of "Age" should be the calculated age of someone born in "1990"
    And I press "Save"
    Then I should see "Tracing Request record successfully created" on the page
    And I should see a value for "Inquiry Status" on the show page with the value of "Open"
    And I should see a value for "Name of inquirer" on the show page with the value of "Tim"
    And I should see a value for "How are they related to the child?" on the show page with the value of "Father"
    And I should see a value for "Nickname of inquirer" on the show page with the value of "Timmy"
    And I should see the calculated Age of a child born in "1990"
    And I should see a value for "Date of Birth" on the show page with the value of "30-May-1990"
    And I should see a value for "Additional details / comments" on the show page with the value of "This is a test"
    And I should see a value for "Current Address" on the show page with the value of "Current Address Value"
    And I should see a value for "Current Location" on the show page with the value of "Current Location Value"
    And I should see a value for "Is this a permanent location?" on the show page with the value of "Yes"
    And I should see a value for "Telephone" on the show page with the value of "Telephone Value"
    And I should see a value for "Date of Separation" on the show page with the value of "26-Jul-2006"
    And I should see a value for "What was the main cause of separation?" on the show page with the value of "Migration"
    And I should see a value for "Did the separation occur in relation to evacuation?" on the show page with the value of "Yes"
    And I should see a value for "Circumstances of Separation (please provide details)" on the show page with the value of "Details about the separation here"
    And I should see a value for "Separation Address (Place)" on the show page with the value of "Separation Address (Place) Value"
    And I should see a value for "Separation Location" on the show page with the value of "Separation Location Value"
    And I should see a value for "Last Address" on the show page with the value of "Last Address Value"
    And I should see a value for "Last Landmark" on the show page with the value of "Last Landmark Value"
    And I should see a value for "Last Location" on the show page with the value of "Last Location Value"
    And I should see a value for "Last Telephone" on the show page with the value of "Last Telephone Value"
    And I should see a value for "Additional info that could help in tracing?" on the show page with the value of "It is at some place in the world"

  Scenario: As a logged in user, I edit a tracing request by changing inquirer form
    And the value of "Age" should be the calculated age of someone born in "1990"
    And I press "Save"
    And I press the "Edit" button
    And I fill in the following:
      | Inquiry Status                          | <Select> Closed           |
      | Name of inquirer                        | Timmy                     |
      | How are they related to the child?      | <Select> Uncle            |
      | Nickname of inquirer                    | Timmy Tim                 |
      | Date of Birth                           | 28-May-1991               |
      | Additional details / comments           | This is a test comments   |
      | Current Address                         | Update Current Address Value  |
      | Current Location                        | <Choose>Update Current Location Value |
      | Is this a permanent location?           | <Tickbox>                   |
      | Telephone                               | Update Telephone Value      |
      | Date of Separation                      | 20-Jul-2007                 |
      | What was the main cause of separation?  | <Select> Abandonment        |
      | Did the separation occur in relation to evacuation?  | <Tickbox>               |
      | Circumstances of Separation (please provide details) | separation here details |
      | Separation Address (Place)  | Update Separation Address (Place) Value               |
      | Separation Location         | <Choose>Update Separation Location Value |
      | Last Address                | Update Last Address Value place  |
      | Last Landmark               | Update Last Landmark Value place |
      | Last Location               | <Choose>Update Last Location Value place |
      | Last Telephone              | Update Last Telephone Value      |
      | Additional info that could help in tracing? |  somewhere       |
    And the value of "Age" should be the calculated age of someone born in "1991"
    And I press "Save"
    Then I should see "Tracing Request was successfully updated" on the page
    And I should see a value for "Inquiry Status" on the show page with the value of "Closed"
    And I should see a value for "Name of inquirer" on the show page with the value of "Timmy"
    And I should see a value for "How are they related to the child?" on the show page with the value of "Uncle"
    And I should see a value for "Nickname of inquirer" on the show page with the value of "Timmy Tim"
    And I should see the calculated Age of a child born in "1991"
    And I should see a value for "Date of Birth" on the show page with the value of "28-May-1991"
    And I should see a value for "Additional details / comments" on the show page with the value of "This is a test comments"
    And I should see a value for "Current Address" on the show page with the value of "Update Current Address Value"
    And I should see a value for "Current Location" on the show page with the value of "Update Current Location Value"
    And I should see a value for "Is this a permanent location?" on the show page with the value of "Yes"
    And I should see a value for "Telephone" on the show page with the value of "Update Telephone Value"
    And I should see a value for "Date of Separation" on the show page with the value of "20-Jul-2007"
    And I should see a value for "What was the main cause of separation?" on the show page with the value of "Abandonment"
    And I should see a value for "Did the separation occur in relation to evacuation?" on the show page with the value of "Yes"
    And I should see a value for "Circumstances of Separation (please provide details)" on the show page with the value of "separation here details"
    And I should see a value for "Separation Address (Place)" on the show page with the value of "Update Separation Address (Place) Value"
    And I should see a value for "Separation Location" on the show page with the value of "Update Separation Location Value"
    And I should see a value for "Last Address" on the show page with the value of "Update Last Address Value place"
    And I should see a value for "Last Landmark" on the show page with the value of "Update Last Landmark Value place"
    And I should see a value for "Last Location" on the show page with the value of "Update Last Location Value place"
    And I should see a value for "Last Telephone" on the show page with the value of "Update Last Telephone Value"
    And I should see a value for "Additional info that could help in tracing?" on the show page with the value of "somewhere"
