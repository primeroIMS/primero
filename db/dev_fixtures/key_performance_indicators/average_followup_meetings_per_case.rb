# frozen_string_literal: true

require_relative 'setup'

Child.new_with_user(TEST_USER, {
                      'action_plan' => [{
                        'gbv_follow_up_subform_section' => [{
                          'followup_date' => Date.today
                        }, {
                          'followup_date' => Date.today
                        }, {
                          'followup_date' => Date.today
                        }, {
                          'followup_date' => Date.today
                        }]
                      }]
                    }).save!

puts 'Add case with 4 followup meetings'
