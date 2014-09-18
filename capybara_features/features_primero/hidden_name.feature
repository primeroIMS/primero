# JIRA PRIMERO-247
# JIRA PRIMERO-248
# JIRA PRIMERO-463

@javascript @primero @search
Feature: Hide Name
  As a Social Worker I want to hide the survivor's name so that only people with access to the record can view the actual name of the child

  Scenario: As a logged in user, I create a case and hide the survivor's name
    Given I am logged in as an admin with username "primero_cp" and password "primero"
    When I access "cases page"
    And I press the "New Case" button
    And I fill in the following:
      | Case Status                              | <Select> Transferred               |
      | Name                                     | Tiki Thomas Taliaferro             |
      | Nickname                                 | Tommy                              |
      | Other Name                               | Bob                                |
      | Name(s) given to child after separation? | <Radio> No                         |
      | Sex                                      | <Select> Male                      |
      | Date of Birth                            | 04-May-1992                        |
      | Distinguishing Physical Characteristics  | Really tall, dark hair, brown eyes |
      | ICRC Ref No.                             | 131313                             |
      | RC ID No.                                | 141414                             |
      | UNHCR ID                                 | AAA000                             |
      | UN Number                                | EEE444                             |
      | Other Agency ID                          | ABC12345                           |
      | Other Agency Name                        | Test Agency                        |
    And the value of "Age" should be the calculated age of someone born in "1992"
    And I press "Save"
    Then I should see "Case record successfully created" on the page
    And I should see a value for "Case ID" on the show page
    And I should see a value for "Long ID" on the show page
    And I should see a value for "Case Status" on the show page with the value of "Transferred"
    And I should see a value for "Name" on the show page with the value of "Tiki Thomas Taliaferro"
    And I should see a value for "Nickname" on the show page with the value of "Tommy"
    And I should see a value for "Other Name" on the show page with the value of "Bob"
    And I should see a value for "Name(s) given to child after separation?" on the show page with the value of "No"
    And I should see a value for "Date of Registration or Interview" on the show page with the value of "today's date"
    And I should see a value for "Sex" on the show page with the value of "Male"
    And I should see the calculated Age of a child born in "1992"
    And I should see a value for "Date of Birth" on the show page with the value of "04-May-1992"
    And I should see a value for "Estimated" on the show page with the value of "No"
    And I should see a value for "Distinguishing Physical Characteristics" on the show page with the value of "Really tall, dark hair, brown eyes"
    And I should see a value for "ICRC Ref No." on the show page with the value of "131313"
    And I should see a value for "RC ID No." on the show page with the value of "141414"
    And I should see a value for "UNHCR ID" on the show page with the value of "AAA000"
    And I should see a value for "UN Number" on the show page with the value of "EEE444"
    And I should see a value for "Other Agency ID" on the show page with the value of "ABC12345"
    And I should see a value for "Other Agency Name" on the show page with the value of "Test Agency"
    And I press the "Edit" button
    And I press the "Hide Name" link
    And I wait for 2 seconds
    And the "Name" field should be disabled
    And the disabled "Name" field should have the value of "*****"
    And I press "Save"
    And I should see "Case was successfully updated" on the page
    And I should see a value for "Case ID" on the show page
    And I should see a value for "Long ID" on the show page
    And I should see a value for "Case Status" on the show page with the value of "Transferred"
    And I should see a value for "Name" on the show page with the value of "*****"
    And I should see a value for "Nickname" on the show page with the value of "Tommy"
    And I should see a value for "Other Name" on the show page with the value of "Bob"
    And I should see a value for "Name(s) given to child after separation?" on the show page with the value of "No"
    And I should see a value for "Date of Registration or Interview" on the show page with the value of "today's date"
    And I should see a value for "Sex" on the show page with the value of "Male"
    And I should see the calculated Age of a child born in "1992"
    And I should see a value for "Date of Birth" on the show page with the value of "04-May-1992"
    And I should see a value for "Estimated" on the show page with the value of "No"
    And I should see a value for "Distinguishing Physical Characteristics" on the show page with the value of "Really tall, dark hair, brown eyes"
    And I should see a value for "ICRC Ref No." on the show page with the value of "131313"
    And I should see a value for "RC ID No." on the show page with the value of "141414"
    And I should see a value for "UNHCR ID" on the show page with the value of "AAA000"
    And I should see a value for "UN Number" on the show page with the value of "EEE444"
    And I should see a value for "Other Agency ID" on the show page with the value of "ABC12345"
    And I should see a value for "Other Agency Name" on the show page with the value of "Test Agency"
    And I press the "Edit" button
    And I press the "View Name" link
    And I wait for 2 seconds
    And the "Name" field should contain "Tiki Thomas Taliaferro"
    And I press "Save"
    And I should see "Case was successfully updated" on the page
    And I should see a value for "Case ID" on the show page
    And I should see a value for "Long ID" on the show page
    And I should see a value for "Case Status" on the show page with the value of "Transferred"
    And I should see a value for "Name" on the show page with the value of "Tiki Thomas Taliaferro"
    And I should see a value for "Nickname" on the show page with the value of "Tommy"
    And I should see a value for "Other Name" on the show page with the value of "Bob"
    And I should see a value for "Name(s) given to child after separation?" on the show page with the value of "No"
    And I should see a value for "Date of Registration or Interview" on the show page with the value of "today's date"
    And I should see a value for "Sex" on the show page with the value of "Male"
    And I should see the calculated Age of a child born in "1992"
    And I should see a value for "Date of Birth" on the show page with the value of "04-May-1992"
    And I should see a value for "Estimated" on the show page with the value of "No"
    And I should see a value for "Distinguishing Physical Characteristics" on the show page with the value of "Really tall, dark hair, brown eyes"
    And I should see a value for "ICRC Ref No." on the show page with the value of "131313"
    And I should see a value for "RC ID No." on the show page with the value of "141414"
    And I should see a value for "UNHCR ID" on the show page with the value of "AAA000"
    And I should see a value for "UN Number" on the show page with the value of "EEE444"
    And I should see a value for "Other Agency ID" on the show page with the value of "ABC12345"
    And I should see a value for "Other Agency Name" on the show page with the value of "Test Agency"
    When I access "cases page"
    And I should see "Tiki Thomas Taliaferro" on the page
    And I should not see "*****" on the page
    And I press the "New Case" button
    And I fill in the following:
      | Name                                     | Tiki Thomas Taliaferro             |
    And I press "Save"
    Then I should see "Case record successfully created" on the page
    And I press the "Edit" button
    And I press the "Hide Name" link
    And I wait for 2 seconds
    And the "Name" field should be disabled
    And the disabled "Name" field should have the value of "*****"
    And I press "Save"
    And I should see "Case was successfully updated" on the page
    And I should see a value for "Name" on the show page with the value of "*****"
    When I access "cases page"
    And I should see "Tiki Thomas Taliaferro" on the page
    And I should see "*****" on the page