#JIRA PRIMERO-187

@javascript @primero
Feature: Child Wishes Form
  As a Social worker, I want to enter the information related to the child's wishes.

  Scenario: As a logged in user, I should access the form section child's preferences subform
    Given I am logged in as an admin with username "primero" and password "primero"
    When I access "form section page"
    And I press the "Nested Child's Preferences" button
    Then I should see the following fields:
      |Person(s) child wishes to locate|
      |Preference of the child to be relocated with this person|
      |What is this person's relationship to the child?|
      |Last Known Address|
      |Landmark|
      |Last Known Location|
      |Telephone|

  Scenario: As a logged in user, I should access the form section child's wishes
    Given I am logged in as an admin with username "primero" and password "primero"
    When I access "form section page"
    And I press the "Child's Wishes" button
    Then I should see the following fields:
      |Does child want to trace family members?|
      |If the child does NOT want family tracing , explain why|
      |Does the child want family reunification?|
      |If 'No', 'Not sure', or 'Yes, but later', explain why|
      |Has the child heard from/been in contact with any relatives?|
      |Please Give Details|
      |Child's Preferences|
      |Does the child wish to continue in the current care arrangement?|
      |If the child does NOT want to stay in the current care arrangement, explain why|
      |Type of care arrangement child wishes to have|
      |If type of care arrangement child wishes to have is Other, specify|
      |Where does the child wish/plan to live?|
      |Street where does the child wish/plan to live?|
      |Landmarks where does the child wish/plan to live?|

  Scenario: I create a case with child's wishes information.
    Given I am logged in as an admin with username "primero" and password "primero"
    When I access "cases page"
    And I press the "Create a New Case" button
    And I press the "Child's Wishes" button
    And I fill in the following:
      | If the child does NOT want family tracing , explain why | Family Tracing Explain       |
      | If 'No', 'Not sure', or 'Yes, but later', explain why   | Family Reunification Explain |
      | Please Give Details                                     | Some Details                 |
      | If the child does NOT want to stay in the current care arrangement, explain why | Care Arrangement Reason |
      | If type of care arrangement child wishes to have is Other, specify              | Other Arrangement Type  |
      | Where does the child wish/plan to live?           | Child Live           |
      | Street where does the child wish/plan to live?    | Live Street Child    |
      | Landmarks where does the child wish/plan to live? | Live Landmarks Child |
    And I select "Yes" from "Does child want to trace family members?"
    And I select "Yes, but later" from "Does the child want family reunification?"
    And I select "No" from "Has the child heard from/been in contact with any relatives?"
    And I select "Yes" from "Does the child wish to continue in the current care arrangement?"
    And I select "With husband/wife/partner" from "Type of care arrangement child wishes to have"
    #Added First Child's Preference
    And I fill in the 1st "Child Preferences Section" subform with the follow:
      | Person(s) child wishes to locate                         | Father's Name         |
      | Preference of the child to be relocated with this person | <Select> Third choice |
      | What is this person's relationship to the child?         | <Select> Father       |
      | Last Known Address                                       | Third Address         |
      | Landmark                                                 | Third Landmark        |
      | Last Known Location                                      | Third the Location    |
      | Telephone                                                | Third the Telephone   |
    #Added Second Child's Preference
    And I fill in the 2st "Child Preferences Section" subform with the follow:
      | Person(s) child wishes to locate                         | Mother's Name         |
      | Preference of the child to be relocated with this person | <Select> First choice |
      | What is this person's relationship to the child?         | <Select> Mother       |
      | Last Known Address                                       | First Address         |
      | Landmark                                                 | First Landmark        |
      | Last Known Location                                      | First Location        |
      | Telephone                                                | First Telephone       |
    #Added Third Child's Preference
    And I fill in the 3st "Child Preferences Section" subform with the follow:
      | Person(s) child wishes to locate                         | Grandmother's Name     |
      | Preference of the child to be relocated with this person | <Select> Second choice |
      | What is this person's relationship to the child?         | <Select> Mother        |
      | Last Known Address                                       | Second Address         |
      | Landmark                                                 | Second Landmark        |
      | Last Known Location                                      | Second Location        |
      | Telephone                                                | Second Telephone       |
    And I press "Save"
    Then I should see "Case record successfully created" on the page
    And I press the "Child's Wishes" button
    And I should see a value for "If the child does NOT want family tracing , explain why" on the show page with the value of "Family Tracing Explain"
    And I should see a value for "If 'No', 'Not sure', or 'Yes, but later', explain why" on the show page with the value of "Family Reunification Explain"
    And I should see a value for "Please Give Details" on the show page with the value of "Some Details"
    And I should see a value for "If the child does NOT want to stay in the current care arrangement, explain why" on the show page with the value of "Care Arrangement Reason"
    And I should see a value for "If type of care arrangement child wishes to have is Other, specify" on the show page with the value of "Other Arrangement Type"
    And I should see a value for "Where does the child wish/plan to live?" on the show page with the value of "Child Live"
    And I should see a value for "Street where does the child wish/plan to live?" on the show page with the value of "Live Street Child"
    And I should see a value for "Landmarks where does the child wish/plan to live?" on the show page with the value of "Live Landmarks Child"
    And I should see a value for "Does child want to trace family members?" on the show page with the value of "Yes"
    And I should see a value for "Does the child want family reunification?" on the show page with the value of "Yes, but later"
    And I should see a value for "Has the child heard from/been in contact with any relatives?" on the show page with the value of "No"
    And I should see a value for "Does the child wish to continue in the current care arrangement?" on the show page with the value of "Yes"
    And I should see a value for "Type of care arrangement child wishes to have" on the show page with the value of "With husband/wife/partner"
    #Verify values from the subform
    And I should see in the 1st "Child's Preference" subform with the follow:
      | Person(s) child wishes to locate                         | Father's Name         |
      | Preference of the child to be relocated with this person | Third choice          |
      | What is this person's relationship to the child?         | Father                |
      | Last Known Address                                       | Third Address         |
      | Landmark                                                 | Third Landmark        |
      | Last Known Location                                      | Third the Location    |
      | Telephone                                                | Third the Telephone   |
    And I should see in the 2nd "Child's Preference" subform with the follow:
      | Person(s) child wishes to locate                         | Mother's Name         |
      | Preference of the child to be relocated with this person | First choice          |
      | What is this person's relationship to the child?         | Mother                |
      | Last Known Address                                       | First Address         |
      | Landmark                                                 | First Landmark        |
      | Last Known Location                                      | First Location        |
      | Telephone                                                | First Telephone       |
    And I should see in the 3rd "Child's Preference" subform with the follow:
      | Person(s) child wishes to locate                         | Grandmother's Name    |
      | Preference of the child to be relocated with this person | Second choice         |
      | What is this person's relationship to the child?         | Mother                |
      | Last Known Address                                       | Second Address        |
      | Landmark                                                 | Second Landmark       |
      | Last Known Location                                      | Second Location       |
      | Telephone                                                | Second Telephone      |

  Scenario: I create a case with child's wishes with more that 3 child's preferences.
    Given I am logged in as an admin with username "primero" and password "primero"
    When I access "cases page"
    And I press the "Create a New Case" button
    And I press the "Child's Wishes" button
    And I fill in the 1st "Child Preferences Section" subform with the follow:
      | Person(s) child wishes to locate                         | Father's Name |
    And I fill in the 1st "Child Preferences Section" subform with the follow:
      | Person(s) child wishes to locate                         | Mother's Name |
    And I fill in the 1st "Child Preferences Section" subform with the follow:
      | Person(s) child wishes to locate                         | Grandmother's Name |
    And I fill in the 1st "Child Preferences Section" subform with the follow:
      | Person(s) child wishes to locate                         | Grandfather's Name |
    And I press "Save"
    Then I should see "You are only allowed 3 child's preferences."
