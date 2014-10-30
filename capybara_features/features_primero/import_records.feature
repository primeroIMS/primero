# JIRA PRIMERO-687

@javascript @primero @search
Feature: Abduction Form
  As a Primero user, I want to import zipped and password protected files sent to me by another Primero user so that I do not have to do anything to the files before importing them into my Primero instance

  Scenario Outline: Import zipped and password protected files
    Given I am logged in as an admin with username <user> and password "primero"
    When I access <page>
    And I hover the "Actions" link
    And I press the "Import" button
    And I attach the file <import_file> to "import_file"
    And I fill in "password" with <password>
    And I press "Import"
    And I should see "File was imported successfully" on the page
    And I should see <short_id_1> on the page
    And I should see <short_id_2> on the page

    Examples:
      | user          | page                  | import_file                                                       | password | short_id_1 | short_id_2 |
      | "primero_cp"  | cases page            | "capybara_features/resources/primero_cp-child.csv.zip"            | "123"    | "de93f60"  | "ca2c756"  |
      | "primero_cp"  | cases page            | "capybara_features/resources/primero_cp-child.xls.zip"            | "123"    | "de93f60"  | "ca2c756"  |
      | "primero_cp"  | cases page            | "capybara_features/resources/primero_cp-child.json.zip"           | "123"    | "de93f60"  | "ca2c756"  |
      | "primero_mrm" | incidents page        | "capybara_features/resources/primero_mrm-incident.csv.zip"        | "123"    | "f9ad646"  | "0f9fea7"  |
      | "primero_mrm" | incidents page        | "capybara_features/resources/primero_mrm-incident.xls.zip"        | "123"    | "f9ad646"  | "0f9fea7"  |
      | "primero_mrm" | incidents page        | "capybara_features/resources/primero_mrm-incident.json.zip"       | "123"    | "f9ad646"  | "0f9fea7"  |
      | "primero_cp"  | tracing requests page | "capybara_features/resources/primero_cp-tracing_request.csv.zip"  | "123"    | "c355ae8"  | "ef409a6"  |
      | "primero_cp"  | tracing requests page | "capybara_features/resources/primero_cp-tracing_request.xls.zip"  | "123"    | "c355ae8"  | "ef409a6"  |
      | "primero_cp"  | tracing requests page | "capybara_features/resources/primero_cp-tracing_request.json.zip" | "123"    | "c355ae8"  | "ef409a6"  |

  Scenario: Import zipped archive with multiple file types
    Given I am logged in as an admin with username "primero_cp" and password "primero"
    When I access cases page
    And I hover the "Actions" link
    And I press the "Import" button
    And I attach the file "capybara_features/resources/primero_cp-child.csv_json.zip" to "import_file"
    And I select "Autodetect based on file extension" from "import_type"
    And I press "Import"
    And I should see "File was imported successfully" on the page
    And I should see "d654485" on the page
    And I should see "b5175e8" on the page