Feature: API Retrieve form sections

  As an API user
  I want to hit a URI that gives me all published form sections
  So that an API client can have all fields related to entering information

  Background:
    Given a registration worker "tim" with a password "123"
    And I login as tim with password 123 and imei 10001

  Scenario: A logged in API user should be able to retrieve all published form sections
    When I send a GET request to "/published_form_sections"
    Then the JSON should be an array
    Then the JSON at "1" should have the following:
      | order        | 10               |
      | perm_enabled | true             |
      | editable     | true             |
      | visible      | true             |
      | unique_id    | "basic_identity" |

      | name/en        | "Basic Identity"                                                       |
      | description/en | "Basic identity information about a separated or unaccompanied child." |

      | fields/3/display_name/en  | "Name"       |
      | fields/3/type             | "text_field" |
      | fields/3/visible          | true         |
      | fields/3/name             | "name"       |
      | fields/3/highlight_information/highlighted | true |
      | fields/3/highlight_information/order       | 1    |
