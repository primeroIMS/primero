# JIRA PRIMERO-122
# JIRA PRIMERO-214
# JIRA PRIMERO-215
# JIRA PRIMERO-353
# JIRA PRIMERO-363
# JIRA PRIMERO-496
# JIRA PRIMERO-736

@javascript @primero
Feature: CAAFAG Profile
  As a Social Worker, I want to fill in form information for children (individuals) in particular circumstances
  so that we can track and report on areas of particular concern.

  Scenario: As a logged in user, I create a case with CAAFAG profile information
    Given I am logged in as an admin with username "primero_cp" and password "primero"
    When I access "cases page"
    And I press the "New Case" button
    And I press the "Assessment" button
    And I press the "CAAFAG Profile" button
    And I select "Other Paramilitary group" from "With which Armed Force or Armed Group was the child associated?"
    And I select "Financial reasons" from "If not forced, what was the main reason why the child became involved in the Armed Force or Armed Group? (type of recruitment)"
    And I select "Combat support" from "What was the main role of the child?"
    And I select "Yes" from "Did the child own/use a weapon"
    And I select "Other (Please specify)" from "How did the child leave the Armed Force or Armed Group?"
    And I select "Formal DDR program" from "Reason for release from Military"
    And I fill in the following:
      | UN DDR Number                                           | 50                                                 |
      | Other reason for enrollment                             | Some reason                                        |
      | When did the child join the Armed Force or Armed Group? | <Date Range>from: '01-Jan-2014', to: '01-Feb-2014' |
      | If Other, please specify                                | This is how child left                             |
    And I press "Save"
    Then I should see a success message for new Case
    And I press the "CAAFAG Profile" button
    And I should see a value for "UN DDR Number" on the show page with the value of "50"
    And I should see a value for "Other reason for enrollment" on the show page with the value of "Some reason"
    And I should see a value for "With which Armed Force or Armed Group was the child associated?" on the show page with the value of "Other Paramilitary group"
    And I should see a value for "If not forced, what was the main reason why the child became involved in the Armed Force or Armed Group? (type of recruitment)" on the show page with the value of "Financial reasons"
    And I should see a value for "What was the main role of the child?" on the show page with the value of "Combat support"
    And I should see a value for "Did the child own/use a weapon" on the show page with the value of "Yes"
    And I should see a value for "When did the child join the Armed Force or Armed Group?" on the show page with the value of "<Date Range> From: 01-Jan-2014 To: 01-Feb-2014"
    And I should see a value for "How did the child leave the Armed Force or Armed Group?" on the show page with the value of "Other (Please specify)"
    And I should see a value for "If Other, please specify" on the show page with the value of "This is how child left"
    And I should see a value for "Reason for release from Military" on the show page with the value of "Formal DDR program"
    And I press the "Edit" button
    And I fill in the following:
      | When did the child join the Armed Force or Armed Group?  | <Date Range>from: '15-Jan-2013', to: '22-Feb-2013' |
      | When did the child leave the Armed Force or Armed Group? | <Date Range>from: '01-Jan-2014', to: '01-Feb-2014' |
    And I press "Save"
    Then I should see a success message for updated Case
    And I should see a value for "When did the child join the Armed Force or Armed Group?" on the show page with the value of "<Date Range> From: 15-Jan-2013 To: 22-Feb-2013"
    And I should see a value for "When did the child leave the Armed Force or Armed Group?" on the show page with the value of "<Date Range> From: 01-Jan-2014 To: 01-Feb-2014"