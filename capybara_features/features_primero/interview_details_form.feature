# JIRA PRIMERO-354
# JIRA PRIMERO-353
# JIRA PRIMERO-363

@javascript @primero
Feature: Interview Details Form
  We want to break up Basic Identity into multiple forms so it will be easier for users to navigate and also so
  that it's easier for users to opt to not use certain sections (like protection or care concerns)

  Scenario: As a logged in user, I create a case by entering interview details information
    Given I am logged in as an admin with username "primero_cp" and password "primero"
    And the following location country exist in the system:
      | placename            |
      | A Location Country   |
    When I access "cases page"
    And I press the "New Case" button
    And I press the "Interview Details" button
    And I fill in the following:
      | Arrival Date                                            | 13-Apr-2014                       |
      | Interviewer Name                                        | Fred Jones                        |
      | Interviewer Position                                    | Field Worker                      |
      | Interviewer Agency                                      | <Select> Agency 4                 |
      | Interview Address                                       | 333 Elm St, Wilkesboro NC, 28697  |
      | Interview Location                                      | <Choose>A Location Country        |
      | Interview Landmark                                      | By the river                      |
      | Information Obtained From                               | <Select> GBV Survivor             |
      | If information obtained from Other, please specify.     | Doctor                            |
      | Has the child been interviewed by another organization? | <Radio> Yes                       |
      | Reference No. given to child by other organization      | CCC222                            |
    And I press "Save"
    Then I should see "Case record successfully created" on the page
    And I should see a value for "Arrival Date" on the show page with the value of "13-Apr-2014"
    And I should see a value for "Interviewer Name" on the show page with the value of "Fred Jones"
    And I should see a value for "Interviewer Position" on the show page with the value of "Field Worker"
    And I should see a value for "Interviewer Agency" on the show page with the value of "Agency 4"
    And I should see a value for "Interview Address" on the show page with the value of "333 Elm St, Wilkesboro NC, 28697"
    And I should see a value for "Interview Location" on the show page with the value of "A Location Country"
    And I should see a value for "Interview Landmark" on the show page with the value of "By the river"
    And I should see a value for "Information Obtained From" on the show page with the value of "GBV Survivor"
    And I should see a value for "If information obtained from Other, please specify." on the show page with the value of "Doctor"
    And I should see a value for "Has the child been interviewed by another organization?" on the show page with the value of "Yes"
    And I should see a value for "Reference No. given to child by other organization" on the show page with the value of "CCC222"
