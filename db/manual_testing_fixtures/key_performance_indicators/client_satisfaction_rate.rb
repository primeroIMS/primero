require_relative "setup.rb"

# Some cases with client satisfaction forms filled out.

Child.new_with_user(TEST_USER, {
  "client_feedback" => [{
    "opening_hours_when_client_could_attend" => "yes",
    "client_comfortable_with_case_worker" => "yes",
    "same_case_worker_each_visit" => "yes",
    "could_client_choose_support_person" => "yes",
    "client_informed_of_options" => "yes",
    "client_decided_what_next" => "yes",
    "client_referred_elsewhere" => "yes",
    "survivor_discreet_access" => "yes",
    "staff_respect_confidentiality" => "yes",
    "client_private_meeting" => "yes",
    "staff_friendly" => "yes",
    "staff_open_minded" => "yes",
    "staff_answered_all_questions" => "yes",
    "staff_client_could_understand" => "yes",
    "staff_allowed_enough_time" => "yes",
    "staff_helpful" => "yes",
    "client_feel_better" => "yes",
    "would_client_recommend_friend" => "yes"
  }]
}).save!

Child.new_with_user(TEST_USER, {
  "client_feedback" => [{
    "opening_hours_when_client_could_attend" => "no",
    "client_comfortable_with_case_worker" => "no",
    "same_case_worker_each_visit" => "no",
    "could_client_choose_support_person" => "no",
    "client_informed_of_options" => "no",
    "client_decided_what_next" => "no",
    "client_referred_elsewhere" => "no",
    "survivor_discreet_access" => "no",
    "staff_respect_confidentiality" => "no",
    "client_private_meeting" => "no",
    "staff_friendly" => "no",
    "staff_open_minded" => "no",
    "staff_answered_all_questions" => "no",
    "staff_client_could_understand" => "no",
    "staff_allowed_enough_time" => "no",
    "staff_helpful" => "no",
    "client_feel_better" => "no",
    "would_client_recommend_friend" => "no"
  }]
}).save!

Child.new_with_user(TEST_USER, {
  "client_feedback" => [{
    "opening_hours_when_client_could_attend" => "n_a",
    "client_comfortable_with_case_worker" => "n_a",
    "same_case_worker_each_visit" => "n_a",
    "could_client_choose_support_person" => "n_a",
    "client_informed_of_options" => "n_a",
    "client_decided_what_next" => "n_a",
    "client_referred_elsewhere" => "n_a",
    "survivor_discreet_access" => "n_a",
    "staff_respect_confidentiality" => "n_a",
    "client_private_meeting" => "n_a",
    "staff_friendly" => "n_a",
    "staff_open_minded" => "n_a",
    "staff_answered_all_questions" => "n_a",
    "staff_client_could_understand" => "n_a",
    "staff_allowed_enough_time" => "n_a",
    "staff_helpful" => "n_a",
    "client_feel_better" => "n_a",
    "would_client_recommend_friend" => "n_a"
  }]
}).save!

Child.new_with_user(TEST_USER, {
  "client_feedback" => [{
    "opening_hours_when_client_could_attend" => "yes",
    "client_comfortable_with_case_worker" => "yes",
    "same_case_worker_each_visit" => "yes",
    "could_client_choose_support_person" => "n_a",
    "client_informed_of_options" => "n_a",
    "client_decided_what_next" => "n_a",
    "client_referred_elsewhere" => "n_a",
    "survivor_discreet_access" => "no",
    "staff_respect_confidentiality" => "no",
    "client_private_meeting" => "no",
    "staff_friendly" => "n_a",
    "staff_open_minded" => "n_a",
    "staff_answered_all_questions" => "n_a",
    "staff_client_could_understand" => "n_a",
    "staff_allowed_enough_time" => "n_a",
    "staff_helpful" => "n_a",
    "client_feel_better" => "n_a",
    "would_client_recommend_friend" => "n_a"
  }]
}).save!

puts "Created 4 cases with client_feedback forms filled out"
