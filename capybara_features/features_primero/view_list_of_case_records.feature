# JIRA PRIMERO-48
@javascript @primero
Feature: Primero View List of Case Records
  I want to be able to access the record of a registered child (or other individual) so that I can find and
  update my case records with information about my interactions with the cases in my care after registration

  Scenario: I want to see my cases and update them
    Given I am logged in as an admin with username "primero" and password "primero"
    And the following cases exist in the system:
      | name     | last_known_location | reporter | unique_id    | reunited | flag  | duplicate | created_at             |flagged_at                    | reunited_at                  | created_by |
      | andreas  | London              | zubair   | zubairlon123 | true     | false | true      | 2004-02-03 04:05:06UTC | DateTime.new(2001,2,3,4,5,6) | DateTime.new(2001,2,3,4,5,6) | primero    |
      | zak      | London              | zubair   | zubairlon456 | false    | true  | false     | 2003-02-03 04:05:06UTC | DateTime.new(2004,2,3,4,5,6) | DateTime.new(2004,2,3,4,5,6) | primero    |
      | jaco     | NYC                 | james    | james456     | true     | true  | false     | 2002-02-03 04:05:06UTC | DateTime.new(2002,2,3,4,5,6) | DateTime.new(2002,2,3,4,5,6) | primero    |
      | meredith | Austin              | james    | james123     | false    | false | false     | 2001-02-03 04:05:06UTC | DateTime.new(2003,2,3,4,5,6) | DateTime.new(2002,2,3,4,5,6) | primero    |
      | jane     | Eyre                | james    | james153     | false    | false | true      | 2001-02-02 04:05:06UTC | DateTime.new(2008,2,3,4,5,6) | DateTime.new(2008,2,3,4,5,6) | primero    |
    When I press the "Cases" button

