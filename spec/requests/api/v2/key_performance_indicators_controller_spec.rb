# frozen_string_literal: true

require 'rails_helper'

# Most of the tests after the HTTP status should be moved into unit tests.
describe Api::V2::KeyPerformanceIndicatorsController, type: :request do
  def form(id, fields)
    FormSection.create_or_update!(
      unique_id: id,
      parent_form: 'case',
      name_en: id.to_s.split('_').map(&:capitalize).join(' '),
      description_en: id.to_s.split('_').map(&:capitalize).join(' '),
      fields: fields
    )
  end

  def field(id, config = {})
    Field.new(config.merge(
                name: id,
                display_name_en: id.to_s.split('_').map(&:capitalize).join(' ')
              ))
  end

  before(:each) do
    clean_data(Lookup, Location, Agency, Role, UserGroup, User, Child, FormSection)

    @uk = Location.create!(
      location_code: 'GBR',
      name: 'United Kingdom',
      placename: 'United Kingdom',
      type: 'Country',
      hierarchy_path: 'GBR',
      admin_level: 0
    )
    @england = Location.create!(
      location_code: '01',
      name: 'England',
      placename: 'England',
      type: 'Region',
      hierarchy_path: 'GBR.01',
      admin_level: 1
    )
    @london = Location.create!(
      location_code: '41',
      name: 'London',
      placename: 'London',
      type: 'County',
      hierarchy_path: 'GBR.01.41',
      admin_level: 2
    )

    @unicef = Agency.create!(agency_code: 'UNICEF', name: 'UNICEF')
    @gbv_manager = Role.create!(name: 'GBV Manager', permissions: [
                                  Permission.new(
                                    resource: Permission::KPI,
                                    actions: Permission::RESOURCE_ACTIONS[Permission::KPI]
                                  )
                                ])
    @primero_gbv_group = UserGroup.create!(name: 'Primero GBV')

    @primero_kpi = User.new(
      user_name: 'primero_kpi',
      agency: @unicef,
      role: @gbv_manager,
      user_groups: [@primero_gbv_group],
      location: @london.location_code
    )
    @primero_kpi.save(validate: false)

    Sunspot.commit
  end

  let(:json) { JSON.parse(response.body, symbolize_names: true) }

  describe 'GET /api/v2/kpis/number_of_cases', search: true do
    with 'a valid active case' do
      it 'should show one case in the last month in London' do
        Child.new_with_user(@primero_kpi, {}).save!
        Sunspot.commit

        sign_in(@primero_kpi)

        get '/api/v2/kpis/number_of_cases', params: {
          from: Date.today - 31,
          to: Date.today + 1
        }

        expect(response).to have_http_status(200)
        expect(json[:data][0]).to be
        expect(json[:data][0][:reporting_site]).to eq(@london.placename)
        expect(json[:data][0][json[:dates].last.to_sym]).to eq(1)
      end
    end
  end

  describe 'GET /api/v2/kpis/number_of_incidents', search: true do
    with 'a valid incident dated 6 days ago' do
      it 'shows 1 incident in the last month in London' do
        Incident.new_with_user(@primero_kpi,
                               incident_date: Date.today.prev_day(6)).save!
        Sunspot.commit

        sign_in(@primero_kpi)

        get '/api/v2/kpis/number_of_incidents', params: {
          from: Date.today - 31,
          to: Date.today + 1
        }

        expect(response).to have_http_status(200)
        expect(json[:data][0]).to be
        expect(json[:data][0][:reporting_site]).to eq(@london.placename)
        expect(json[:data][0][json[:dates].last.to_sym]).to eq(1)
      end
    end
  end

  describe 'GET /api/v2/kpis/reporting_delay', search: true do
    with 'a valid incident dated 6 days ago' do
      it 'shows 1 incident in the 6-14days range' do
        Incident.new_with_user(@primero_kpi,
                               incident_date: Date.today.prev_day(6)).save!
        Sunspot.commit

        sign_in(@primero_kpi)

        get '/api/v2/kpis/reporting_delay', params: {
          from: Date.today - 31,
          to: Date.today + 1
        }

        expect(response).to have_http_status(200)
        expect(json[:data]).to be
        result = json[:data]
                 .select { |bucket| bucket[:total_incidents] > 0 }
                 .first

        expect(result[:delay]).to eql('6-14days')
        expect(result[:total_incidents]).to eql(1)
        expect(result[:percentage]).to eql(1.0)
      end
    end
  end

  describe 'GET /api/v2/kpis/completed_case_safety_plans', search: true do
    with '1 case with a filled out case safety plan' do
      it 'shows safety plan completed status of 100%' do
        form(:safety_plan, [
               field(:safety_plan_needed, mandatory_for_completion: true),
               field(:safety_plan_completion_date, mandatory_for_completion: true)
             ])

        Child.new_with_user(@primero_kpi,
                            'safety_plan' => [{
                              'safety_plan_needed' => 'yes',
                              'safety_plan_developed_with_survivor' => 'yes',
                              'safety_plan_completion_date' => Date.today,
                              'safety_plan_main_concern' => 'covid-19',
                              'safety_plan_preparedness_signal' => 'Firing workers',
                              'safety_plan_preparedness_gathered_things' => 'Ill prespared'
                            }]).save!
        Sunspot.commit

        sign_in(@primero_kpi)

        get '/api/v2/kpis/completed_case_safety_plans', params: {
          from: Date.today - 31,
          to: Date.today + 1
        }

        expect(response).to have_http_status(200)
        expect(json[:data][:completed]).to eql(1.0)
      end
    end
  end

  describe 'GET /api/v2/kpis/completed_case_action_plans', search: true do
    with '1 case with a filled out case action plan' do
      it 'shows action plan completed status of 100%' do
        form(:action_plan_form, [
               field(:action_plan_section,
                     subform_section: form(:action_plan_subform_section, [
                                             field(:service_type, mandatory_for_completion: true)
                                           ]))
             ])

        Child.new_with_user(@primero_kpi,
                            'action_plan_form' => [{
                              'action_plan_section' => [{
                                'service_type' => 'fiscal',
                                'service_referral' => 'advice',
                                'service_referral_written_consent' => 'yes'
                              }]
                            }]).save!
        Sunspot.commit

        sign_in(@primero_kpi)

        get '/api/v2/kpis/completed_case_action_plans', params: {
          from: Date.today - 31,
          to: Date.today + 1
        }

        expect(response).to have_http_status(200)
        expect(json[:data][:completed]).to eql(1.0)
      end
    end
  end

  describe 'GET /api/v2/kpis/completed_supervisor_approved_case_action_plans', search: true do
    skip
  end

  describe 'GET /api/v2/kpis/services_provided', search: true do
    with 'service-type lookups and a case with a service_type_provided' do
      it 'it returns a list of 1 service and a count of the times it was provided' do
        Lookup.create!(
          unique_id: 'lookup-service-type',
          name_en: 'Service Type',
          lookup_values_en: [
            { id: 'safehouse_service', display_text: 'Safehouse Service' }.with_indifferent_access
          ]
        )
        form(:action_plan_form, [
               field(:gbv_follow_up_subform_section,
                     subform_section: form(:gbv_follow_up_subform_section, [
                                             field(:service_type_provided)
                                           ]))
             ])

        Child.new_with_user(@primero_kpi,
                            'action_plan_form' => [{
                              'gbv_follow_up_subform_section' => [{
                                'service_type_provided' => 'safehouse_service'
                              }]
                            }]).save!
        Sunspot.commit

        sign_in(@primero_kpi)

        get '/api/v2/kpis/services_provided', params: {
          from: Date.today - 31,
          to: Date.today + 1
        }

        expect(response).to have_http_status(200)
        expect(json[:data][:services_provided].length).to eql(1)
      end
    end
  end

  describe 'GET /api/v2/kpis/average_referrals', search: true do
    with 'a single case that has been referred once' do
      it 'should return an average referral rate of 1.0' do
        form(:action_plan_form, [
               field(:action_plan_subform_section,
                     subform_section: form(:action_plan_subform_section, [
                                             field(:service_referral)
                                           ]))
             ])

        Child.new_with_user(@primero_kpi,
                            'action_plan_form' => [{
                              'action_plan_subform_section' => [{
                                'service_referral' => 'Referred'
                              }]
                            }]).save!
        Sunspot.commit

        sign_in(@primero_kpi)

        get '/api/v2/kpis/average_referrals', params: {
          from: Date.today - 31,
          to: Date.today + 1
        }

        expect(response).to have_http_status(200)
        expect(json[:data][:average_referrals]).to eql(1.0)
      end
    end
  end

  describe 'GET /api/v2/kpis/average_followup_meetings_per_case', search: true do
    with 'a single case that has been followedup 4 times' do
      it 'should return an average referral rate of 4.0' do
        form(:action_plan_form, [
               field(:gbv_follow_up_subform_section,
                     subform_section: form(:gbv_follow_up_subform_section, [
                                             field(:followup_date)
                                           ]))
             ])

        Child.new_with_user(@primero_kpi,
                            'action_plan_form' => [{
                              'gbv_follow_up_subform_section' => [{
                                'followup_date' => Date.today
                              }, {
                                'followup_date' => Date.today
                              }, {
                                'followup_date' => Date.today
                              }, {
                                'followup_date' => Date.today
                              }]
                            }]).save!
        Sunspot.commit

        sign_in(@primero_kpi)

        get '/api/v2/kpis/average_followup_meetings_per_case', params: {
          from: Date.today - 31,
          to: Date.today + 1
        }

        expect(response).to have_http_status(200)
        expect(json[:data][:average_meetings]).to eql(4.0)
      end
    end
  end

  describe 'GET /api/v2/kpis/goal_progress_per_need', search: true do
    with 'a single case with all needs filled out, some mets, some not' do
      it 'should return an average of 0 for all unmet needs and 1.0 for met needs' do
        form(:action_plan_form, [
               field(:gbv_follow_up_subform_section,
                     subform_section: form(:gbv_follow_up_subform_section, [
                                             field(:gbv_assessment_progress_safety),
                                             field(:gbv_assessment_progress_health),
                                             field(:gbv_assessment_progress_psychosocial),
                                             field(:gbv_assessment_progress_justice),
                                             field(:gbv_assessment_other_goals)
                                           ]))
             ])

        Child.new_with_user(@primero_kpi,
                            'action_plan_form' => [{
                              'gbv_follow_up_subform_section' => [{
                                'gbv_assessment_progress_safety' => 'n_a',
                                'gbv_assessment_progress_health' => 'in_progress',
                                'gbv_assessment_progress_psychosocial' => 'in_progress',
                                'gbv_assessment_progress_justice' => 'met',
                                'gbv_assessment_other_goals' => 'met'
                              }]
                            }]).save!
        Sunspot.commit

        sign_in(@primero_kpi)

        get '/api/v2/kpis/goal_progress_per_need', params: {
          from: Date.today - 31,
          to: Date.today + 1
        }

        expect(response).to have_http_status(200)
        expect(json[:data][0][:percentage]).to eql(0.0)
        expect(json[:data][1][:percentage]).to eql(0.0)
        expect(json[:data][2][:percentage]).to eql(0.0)
        expect(json[:data][3][:percentage]).to eql(1.0)
        expect(json[:data][4][:percentage]).to eql(1.0)
      end
    end
  end

  describe 'GET /api/v2/kpis/time_from_case_open_to_close', search: true do
    with 'A single case created in the past and closed today' do
      it 'should return a single bin with 100% of the cases (1)' do
        child = Child.new_with_user(@primero_kpi, {})
        child.save!
        child.created_at = Date.new(2020, 7, 1).to_time
        child.date_closure = Date.new(2020, 9, 1)
        child.save!
        Sunspot.commit

        sign_in(@primero_kpi)

        get '/api/v2/kpis/time_from_case_open_to_close', params: {
          from: Date.new(2020, 8, 1),
          to: Date.new(2020, 10, 1)
        }

        expect(response).to have_http_status(200)
        expect(json[:data][1][:percent]).to eql(1.0)
      end
    end
  end

  describe 'GET /api/v2/kpis/case_closure_rate', search: true do
    with 'A single case created in the past and closed today' do
      it 'should return a single bin with 100% of the cases (1)' do
        child = Child.new_with_user(@primero_kpi, {})
        child.save!
        # Ensure at least a months difference.
        # TODO: Replace dynamic dates with hard coded dates
        child.created_at = Date.today.prev_day(32).to_time
        child.date_closure = Date.today
        child.save!
        Sunspot.commit

        sign_in(@primero_kpi)

        get '/api/v2/kpis/case_closure_rate', params: {
          from: Date.today - 31,
          to: Date.today + 1
        }

        expect(response).to have_http_status(200)
        expect(json[:data][0][:reporting_site]).to eql(@london.placename)
      end
    end
  end

  describe 'GET /api/v2/kpis/client_satisfaction_rate', search: true do
    with 'A single case with a client feedback form filled out all "yes"' do
      it 'should return a client satisfaction rate of 100% (1.0)' do
        Child.new_with_user(@primero_kpi,
                            'client_feedback' => [{
                              'opening_hours_when_client_could_attend' => 'yes',
                              'client_comfortable_with_case_worker' => 'yes',
                              'same_case_worker_each_visit' => 'yes',
                              'could_client_choose_support_person' => 'yes',
                              'client_informed_of_options' => 'yes',
                              'client_decided_what_next' => 'yes',
                              'client_referred_elsewhere' => 'yes',
                              'survivor_discreet_access' => 'yes',
                              'staff_respect_confidentiality' => 'yes',
                              'client_private_meeting' => 'yes',
                              'staff_friendly' => 'yes',
                              'staff_open_minded' => 'yes',
                              'staff_answered_all_questions' => 'yes',
                              'staff_client_could_understand' => 'yes',
                              'staff_allowed_enough_time' => 'yes',
                              'staff_helpful' => 'yes',
                              'client_feel_better' => 'yes',
                              'would_client_recommend_friend' => 'yes'
                            }]).save!
        Sunspot.commit

        sign_in(@primero_kpi)

        get '/api/v2/kpis/client_satisfaction_rate', params: {
          from: Date.today - 90,
          to: Date.today + 1
        }

        expect(response).to have_http_status(200)
        expect(json[:data][:satisfaction_rate]).to eql(1.0)
      end
    end
  end

  describe 'GET /api/v2/kpis/supervisor_to_caseworker_ratio', search: true do
    with 'A single supervisor and case worker' do
      it 'the supervisor/caseworker ratio should be 1:1' do
        supervisor_role = Role.create!(
          name: 'supervisor',
          unique_id: 'role-gbv-case-management-supervisor',
          permissions: [Permission.new]
        )
        supervisor = User.new(
          user_name: 'supervisor',
          agency: @unicef,
          role: supervisor_role,
          user_groups: [@primero_gbv_group],
          location: @london.location_code
        )
        supervisor.save(validate: false)
        case_worker_role = Role.create!(
          name: 'case_worker',
          unique_id: 'role-gbv-caseworker',
          permissions: [Permission.new]
        )
        case_worker = User.new(
          user_name: 'case_worker',
          agency: @unicef,
          role: case_worker_role,
          user_groups: [@primero_gbv_group],
          location: @london.location_code
        )
        case_worker.save(validate: false)
        Sunspot.commit

        sign_in(@primero_kpi)

        get '/api/v2/kpis/supervisor_to_caseworker_ratio', params: {
          from: Date.today - 90,
          to: Date.today + 1
        }

        expect(response).to have_http_status(200)
        expect(json[:data][:supervisors]).to eql(1)
        expect(json[:data][:case_workers]).to eql(1)
      end
    end
  end

  describe 'GET /api/v2/kpis/case_load', search: true do
    with 'A single user with 1 open case' do
      it 'should indicate that 100% of case workers have <10 cases' do
        Child.new_with_user(@primero_kpi, {}).save!
        Sunspot.commit

        sign_in(@primero_kpi)

        get '/api/v2/kpis/case_load', params: {
          from: Date.today - 90,
          to: Date.today + 1
        }

        expect(response).to have_http_status(200)
        expect(json[:data][0][:percent]).to eql(1.0)
      end
    end
  end
end
