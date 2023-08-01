# frozen_string_literal: true

require_relative './setup'

Child.new_with_user(TEST_USER, {
                      'action_plan' => [{
                        'action_plan_subform_section' => [{
                          'service_referral' => 'Referred'
                        }]
                      }]
                    }).save!

puts 'Created case with a referral'
