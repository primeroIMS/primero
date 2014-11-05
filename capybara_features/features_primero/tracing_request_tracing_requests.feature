#JIRA PRIMERO-423
#JIRA PRIMERO-731

@javascript @primero @search
Feature: Tracing Request Tracing Requests
  As a Social worker, I want to enter information related to the tracing request for tracing requests

  Background:
    Given I am logged in as an admin with username "primero_cp" and password "primero"
    And the following location country exist in the system:
      | placename                  |
      | Separation Location Value  |
      | Last Location Value        |
      | Update Separation Location Value |
      | Update Last Location Value       |
    When I access "tracing requests page"
    And I press the "New Tracing Request" button
    And I press the "Tracing Request" button
    And I update in the 1st "Tracing Request Subform Section" subform with the follow:
      | Tracing status  | <Select> Open |
      | Name            | Timmy         |
      | How are they related to the inquirer?                   | <Select> Brother  |
      | Did the child live with the inquirer before separation? | <Radio> Yes       |
      | Nickname        | Timmy Tim     |
      | Other Name      | Thomas        |
      | Sex             | <Select> Male |
      | Date of Birth   | 25-Sep-2006   |
      | Distinguishing Physical Characteristics      | Surgery mark stomach  |
      | Special Message for the person being sought  | Good Luck             |
      | Same separation details as on Inquirer form? | <Tickbox>             |
      | Date of Separation                           | 10-Oct-2010           |
      | What was the main cause of separation?       | <Select> Abandonment  |
      | Did the separation occur in relation to evacuation?  | <Tickbox>         |
      | Circumstances of Separation (please provide details) | No special reason |
      | Separation Address (Place) | Separation Address (Place) Value |
      | Separation Location        | <Choose>Separation Location Value|
      | Last Address               | Last Address Value               |
      | Last Landmark              | Last Landmark Value              |
      | Last Location              | <Choose>Last Location Value      |
      | Last Telephone             | Last Telephone Value             |
      | Additional info that could help in tracing? | Some Info Here  |

  Scenario: As a logged in user, I create a tracing request by fill up tracing request form
    And I press "Save"
    Then I should see "Tracing Request record successfully created" on the page
    And I should see header in the 1st "Tracing Request Subform Section" subform within "Timmy - Brother"
    And I should see in the 1st "Tracing Request Subform Section" subform with the follow:
      | Tracing status | Open  |
      | Name           | Timmy |
      | How are they related to the inquirer?                   | Brother |
      | Did the child live with the inquirer before separation? | Yes     |
      | Nickname        | Timmy Tim   |
      | Other Name      | Thomas      |
      | Sex             | Male        |
      | Date of Birth   | 25-Sep-2006 |
      | Distinguishing Physical Characteristics      | Surgery mark stomach  |
      | Special Message for the person being sought  | Good Luck             |
      | Same separation details as on Inquirer form? | Yes                   |
      | Date of Separation                           | 10-Oct-2010           |
      | What was the main cause of separation?       | Abandonment           |
      | Did the separation occur in relation to evacuation?  | Yes               |
      | Circumstances of Separation (please provide details) | No special reason |
      | Separation Address (Place) | Separation Address (Place) Value |
      | Separation Location        | Separation Location Value        |
      | Last Address               | Last Address Value               |
      | Last Landmark              | Last Landmark Value              |
      | Last Location              | Last Location Value              |
      | Last Telephone             | Last Telephone Value             |
      | Additional info that could help in tracing? | Some Info Here  |

  Scenario: As a logged in user, I edit a tracing request by changing tracing request form
    And I press "Save"
    And I press the "Edit" button
    And I update in the 1st "Tracing Request Subform Section" subform with the follow:
      | Tracing status  | <Select> Tracing in Progress |
      | Name            | James         |
      | How are they related to the inquirer?                   | <Select> Son |
      | Did the child live with the inquirer before separation? | <Radio> No   |
      | Nickname        | Jimmy         |
      | Other Name      | Jim           |
      | Sex             | <Select> Male |
      | Date of Birth   | 25-Sep-2005   |
      | Distinguishing Physical Characteristics      | Surgery mark head      |
      | Special Message for the person being sought  | Lucky                  |
      | Same separation details as on Inquirer form? | <Tickbox>              |
      | Date of Separation                           | 11-Oct-2010            |
      | What was the main cause of separation?       | <Select> Repatriation  |
      | Did the separation occur in relation to evacuation?  | <Tickbox>      |
      | Circumstances of Separation (please provide details) | No reason      |
      | Separation Address (Place) | Update Separation Address (Place) Value |
      | Separation Location        | <Choose>Update Separation Location Value|
      | Last Address               | Update Last Address Value               |
      | Last Landmark              | Update Last Landmark Value              |
      | Last Location              | <Choose>Update Last Location Value      |
      | Last Telephone             | Update Last Telephone Value             |
      | Additional info that could help in tracing? | Update Some Info Here  |
    And I press "Save"
    Then I should see "Tracing Request was successfully updated" on the page
    And I should see header in the 1st "Tracing Request Subform Section" subform within "James - Son"
    And I should see in the 1st "Tracing Request Subform Section" subform with the follow:
      | Tracing status  | Tracing in Progress |
      | Name            | James               |
      | How are they related to the inquirer?                   | Son   |
      | Did the child live with the inquirer before separation? | No    |
      | Nickname        | Jimmy         |
      | Other Name      | Jim           |
      | Sex             | Male          |
      | Date of Birth   | 25-Sep-2005   |
      | Distinguishing Physical Characteristics      | Surgery mark head     |
      | Special Message for the person being sought  | Lucky                 |
      | Same separation details as on Inquirer form? | Yes                   |
      | Date of Separation                           | 11-Oct-2010           |
      | What was the main cause of separation?       | Repatriation          |
      | Did the separation occur in relation to evacuation?  | Yes           |
      | Circumstances of Separation (please provide details) | No reason     |
      | Separation Address (Place) | Update Separation Address (Place) Value |
      | Separation Location        | Update Separation Location Value        |
      | Last Address               | Update Last Address Value               |
      | Last Landmark              | Update Last Landmark Value              |
      | Last Location              | Update Last Location Value              |
      | Last Telephone             | Update Last Telephone Value             |
      | Additional info that could help in tracing? | Update Some Info Here  |

  Scenario: The Cancel button should return to the List view (New record)
    And I press the "Cancel" button
    And I click OK in the browser popup
    And I should be on the tracing requests page

  Scenario: The Cancel button should return to the List view (Edit record)
    And I press "Save"
    And I press the "Edit" button
    And I press the "Cancel" button
    And I click OK in the browser popup
    And I should be on the tracing requests page