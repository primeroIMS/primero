require_relative "setup.rb"

Child.new_with_user(TEST_USER, {
  'action_plan' => [{
    'gbv_follow_up_subform_section' => [{
      'gbv_assessment_progress_safety' => 'met',
      'gbv_assessment_progress_health' => 'met',
      'gbv_assessment_progress_psychosocial' => 'met',
      'gbv_assessment_progress_justice' => 'met',
      'gbv_assessment_other_goals' => 'met'
    }]
  }]
}).save!


Child.new_with_user(TEST_USER, {
  'action_plan' => [{
    'gbv_follow_up_subform_section' => [{
      'gbv_assessment_progress_safety' => 'n_a',
      'gbv_assessment_progress_health' => 'in_progress',
      'gbv_assessment_progress_psychosocial' => 'in_progress',
      'gbv_assessment_progress_justice' => 'met',
      'gbv_assessment_other_goals' => 'met'
    }]
  }]
}).save!

Child.new_with_user(TEST_USER, {
  'action_plan' => [{
    'gbv_follow_up_subform_section' => [{
      'gbv_assessment_progress_safety' => 'in_progress',
      'gbv_assessment_progress_health' => 'n_a',
      'gbv_assessment_progress_psychosocial' => 'n_a',
      'gbv_assessment_progress_justice' => 'in_progress',
      'gbv_assessment_other_goals' => 'met'
    }]
  }]
}).save!

Child.new_with_user(TEST_USER, {
  'action_plan' => [{
    'gbv_follow_up_subform_section' => [{
      'gbv_assessment_progress_safety' => 'in_progress',
      'gbv_assessment_progress_health' => 'n_a',
      'gbv_assessment_progress_psychosocial' => 'n_a',
      'gbv_assessment_progress_justice' => 'in_progress',
      'gbv_assessment_other_goals' => 'met'
    }, {
      'gbv_assessment_progress_safety' => 'met',
      'gbv_assessment_progress_health' => 'met',
      'gbv_assessment_progress_psychosocial' => 'in_progress',
      'gbv_assessment_progress_justice' => 'met',
      'gbv_assessment_other_goals' => 'n_a'
    }]
  }]
}).save!

puts 'Created 4 cases with with varying goals completed / in_progress'
