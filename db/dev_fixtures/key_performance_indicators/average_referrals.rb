require_relative './setup.rb'

Child.new_with_user(TEST_USER, {
  'action_plan' => [{
    'action_plan_subform_section' => [{
      'service_referral' => 'Referred'
    }]
  }]
}).save!

puts 'Created case with a referral'
