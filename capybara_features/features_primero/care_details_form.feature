# JIRA PRIMERO-354
# JIRA PRIMERO-353
# JIRA PRIMERO-363

@javascript @primero
Feature: Care Details Form
  We want to break up Basic Identity into multiple forms so it will be easier for users to navigate and also so 
  that it's easier for users to opt to not use certain sections (like protection or care concerns)

  Scenario: As a logged in user, I create a case by entering care details information
    Given I am logged in as an admin with username "primero" and password "primero"
    When I access "cases page"
    And I press the "Create a New Case" button
    And I press the "Care Details" button
    And I fill in the following:
      | If the survivor is a child, does he/she live alone?                                        | <Radio> No        |
      | If the survivor lives with someone, what is the relation between her/him and the caretaker?| <Select> Relative |
      | If other relation between her/him and the caretaker, please specify.                       | Second Cousin     |
      | What is the caretaker's current marital status?                                            | <Select> Widowed  |
      | What is the caretaker's primary occupation?                                                | Teacher           |
    And I press "Save"
    Then I should see "Case record successfully created" on the page
    And I should see a value for "If the survivor is a child, does he/she live alone?" on the show page with the value of "No"
    And I should see a value for "If the survivor lives with someone, what is the relation between her/him and the caretaker?" on the show page with the value of "Relative"
    And I should see a value for "If other relation between her/him and the caretaker, please specify." on the show page with the value of "Second Cousin"
    And I should see a value for "What is the caretaker's current marital status?" on the show page with the value of "Widowed"
    And I should see a value for "What is the caretaker's primary occupation?" on the show page with the value of "Teacher"
