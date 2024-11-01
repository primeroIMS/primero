# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

require 'rails_helper'
require 'will_paginate'

describe Incident do
  before do
    clean_data(
      SearchableIdentifier, User, Agency, Role, Incident, Child, PrimeroModule, PrimeroProgram, UserGroup, FormSection,
      Field, Violation, Response, IndividualVictim, Source, Perpetrator, GroupVictim
    )

    create(:agency)
  end

  describe 'save' do
    it 'should save with generated incident_id' do
      Incident.any_instance.stub(:field_definitions).and_return([])
      incident = create_incident_with_created_by('jdoe', 'description' => 'London')
      incident.save!
      incident.id.should_not be_nil
    end
  end

  describe 'new_with_user_name' do
    before(:all) { create(:agency) }
    before :each do
      Incident.any_instance.stub(:field_definitions).and_return([])
    end

    it 'should create regular incident fields' do
      incident = create_incident_with_created_by('jdoe', 'description' => 'London', 'age' => '6')
      expect(incident.data['description']).to eq('London')
      expect(incident.data['age'].to_s).to eq('6')
    end

    it 'should create a unique id' do
      SecureRandom.stub('uuid').and_return('bbfca678-18fc-44a4-9a0d-0764e0941316')
      incident = create_incident_with_created_by('jdoe')
      incident.save!
      incident.unique_identifier.should == 'bbfca678-18fc-44a4-9a0d-0764e0941316'
    end

    it 'should create a created_by field with the user name' do
      incident = create_incident_with_created_by('jdoe', 'some_field' => 'some_value')
      incident.data['created_by'].should == 'jdoe'
    end

    describe 'when the created at field is not supplied' do
      it 'should create a created_at field with time of creation' do
        DateTime.stub(:now).and_return(Time.utc(2010, 'jan', 14, 14, 5, 0))
        incident = create_incident_with_created_by('some_user', 'some_field' => 'some_value')
        incident.created_at.should == DateTime.parse('2010-01-14 14:05:00UTC')
      end
    end

    describe 'when the created at field is supplied' do
      it 'should use the supplied created at value' do
        incident = create_incident_with_created_by(
          'some_user', 'some_field' => 'some_value', 'created_at' => '2010-01-14 14:05:00UTC'
        )
        incident.data['created_at'].should == '2010-01-14 14:05:00UTC'
      end
    end

    describe 'when violations data is present' do
      let(:incident_data) do
        {
          'unique_id' => '790f958d-ac8e-414b-af64-e75831e3353a',
          'module_id' => PrimeroModule::MRM,
          'incident_code' => '0123456',
          'description' => 'this is a test',
          'recruitment' => [
            {
              'unique_id' => '8dccaf74-e9aa-452a-9b58-dc365b1062a2',
              'violation_tally' => { 'boys' => 3, 'girls' => 1, 'unknown' => 0, 'total' => 4 },
              'name' => 'violation1'
            }
          ],
          'responses' => [
            {
              'unique_id' => '36c09588-5489-4d0f-a129-8f5868222cf2',
              'name' => 'intervention2',
              'violations_ids' => ['8dccaf74-e9aa-452a-9b58-dc365b1062a2']
            }
          ],
          'individual_victims' => [
            {
              'unique_id' => '53baed05-a012-42e9-ad8d-5c5660ac5159',
              'name' => 'individual1',
              'violations_ids' => ['8dccaf74-e9aa-452a-9b58-dc365b1062a2']
            }
          ],
          'sources' => [
            {
              'unique_id' => '7742b9db-2db2-4421-bff7-9aae6272fc4a',
              'name' => 'source1',
              'violations_ids' => ['8dccaf74-e9aa-452a-9b58-dc365b1062a2']
            }
          ],
          'perpetrators' => [
            {
              'unique_id' => 'ac4ea377-4223-453d-a8eb-01475c7dcec6',
              'name' => 'perpetrator1',
              'violations_ids' => ['8dccaf74-e9aa-452a-9b58-dc365b1062a2']
            }
          ],
          'group_victims' => [
            {
              'unique_id' => 'ae0de249-d8d9-44a6-9f7f-9dd316b46385',
              'name' => 'group1',
              'violations_ids' => ['8dccaf74-e9aa-452a-9b58-dc365b1062a2']
            }
          ]
        }
      end
      before :each do
        clean_data(SearchableIdentifier, Incident, Violation, Response, IndividualVictim, Source, Perpetrator,
                   GroupVictim)
        incident_record = Incident.new_with_user(fake_user, incident_data)
        incident_record.save!
      end

      it 'creates a incident record' do
        incident = Incident.first
        expect(Incident.count).to eq(1)
        expect(incident.incident_code).to eq('0123456')
      end

      it 'creates a violation record' do
        violation = Violation.first
        expect(Violation.count).to eq(1)
        expect(violation.unique_id).to eq('8dccaf74-e9aa-452a-9b58-dc365b1062a2')
      end

      it 'creates a responses record' do
        response = Response.first
        expect(Response.count).to eq(1)
        expect(response.unique_id).to eq('36c09588-5489-4d0f-a129-8f5868222cf2')
      end

      it 'creates a individual_victims record' do
        individual_victim = IndividualVictim.first
        expect(IndividualVictim.count).to eq(1)
        expect(individual_victim.unique_id).to eq('53baed05-a012-42e9-ad8d-5c5660ac5159')
      end

      it 'creates a sources record' do
        source = Source.first
        expect(Source.count).to eq(1)
        expect(source.unique_id).to eq('7742b9db-2db2-4421-bff7-9aae6272fc4a')
      end

      it 'creates a perpetrators record' do
        perpetrator = Perpetrator.first
        expect(Perpetrator.count).to eq(1)
        expect(perpetrator.unique_id).to eq('ac4ea377-4223-453d-a8eb-01475c7dcec6')
      end

      it 'creates a group_victims record' do
        group_victim = GroupVictim.first
        expect(GroupVictim.count).to eq(1)
        expect(group_victim.unique_id).to eq('ae0de249-d8d9-44a6-9f7f-9dd316b46385')
      end

      context 'when an associations is added to a violation' do
        let(:data) do
          { 'status' => 'open',
            'incident_title' => 'incident for rspec',
            'violation_category' => %w[killing maiming],
            'is_incident_date_range' => false,
            'incident_date' => Date.today,
            'estimated_indicator' => false,
            'incident_location' => 'IQG08Q02N02',
            'incident_description' => 'none',
            'incident_total_tally' => { 'boys' => 1, 'total' => 1 },
            incident_code: '9f88531',
            'individual_victims' =>
             [{ 'violations_ids' => ['222d97fb-b49d-401a-aff5-55dbe81a6fbf'],
                'individual_multiple_violations' => false,
                'individual_sex' => 'female',
                'individual_age' => 2,
                'individual_age_estimated' => false,
                'depriviation_liberty_date_range' => false,
                'unique_id' => 'ffbf1366-03b7-4fb6-acf7-a3ea678e0976' },
              { 'violations_ids' => ['9c0a3d5d-96b9-4179-9f0d-6a064ece25dd'],
                'individual_multiple_violations' => false,
                'individual_sex' => 'male',
                'individual_age' => 3,
                'individual_age_estimated' => false,
                'depriviation_liberty_date_range' => false,
                'unique_id' => 'fdab72b7-9186-4986-a521-f63fb8a6e762' },
              { 'violations_ids' => ['9c0a3d5d-96b9-4179-9f0d-6a064ece25dd'],
                'individual_multiple_violations' => false,
                'individual_sex' => 'unknown',
                'individual_age' => 4,
                'individual_age_estimated' => false,
                'depriviation_liberty_date_range' => false,
                'unique_id' => 'ab75e7ac-ec72-40d3-9565-200652b6ebe4' }],
            'killing' =>
             [{ 'violation_tally' => { 'total' => 1, 'girls' => 1 },
                'context_km' => 'military_clashes',
                'attack_type' => 'undetermined',
                'weapon_category' => 'unknown',
                'weapon_type' => 'unknown',
                'verified' => 'report_pending_verification',
                'ctfmr_verified' => 'report_pending_verification',
                'unique_id' => '222d97fb-b49d-401a-aff5-55dbe81a6fbf' }],
            'maiming' =>
             [{ 'violation_tally' => { 'boys' => 1, 'unknown' => 1, 'total' => 2 },
                'context_km' => 'intercommunal_violence',
                'attack_type' => 'indirect_attack',
                'weapon_category' => 'small_arms_lights_weapons',
                'weapon_type' => 'assault_rifle',
                'verified' => 'report_pending_verification',
                'ctfmr_verified' => 'report_pending_verification',
                'unique_id' => '9c0a3d5d-96b9-4179-9f0d-6a064ece25dd' }],
            'module_id' => 'primeromodule-mrm' }
        end
        before :each do
          clean_data(SearchableIdentifier, Incident, Violation, Response, IndividualVictim, Source, Perpetrator,
                     GroupVictim)
          incident_record = Incident.new_with_user(fake_user, data)
          incident_record.save!
        end

        it 'creates a incident record' do
          incident = Incident.first
          expect(Incident.count).to eq(1)
          expect(incident.incident_code).to eq('9f88531')
        end

        it 'creates a violation record' do
          expect(Incident.first.violations.count).to eq(2)
          expect(Incident.first.violations.map(&:unique_id)).to match_array(
            %w[222d97fb-b49d-401a-aff5-55dbe81a6fbf 9c0a3d5d-96b9-4179-9f0d-6a064ece25dd]
          )
        end

        it 'creates a individual_victims record' do
          expect(IndividualVictim.count).to eq(3)
          individual_victim_unique_ids = Incident.first.violations.map do |violation|
            violation.individual_victims.map(&:unique_id)
          end.flatten
          expect(individual_victim_unique_ids).to match_array(
            %w[
              ab75e7ac-ec72-40d3-9565-200652b6ebe4
              fdab72b7-9186-4986-a521-f63fb8a6e762
              ffbf1366-03b7-4fb6-acf7-a3ea678e0976
            ]
          )
        end

        it 'create the correct associations for killing violation' do
          killing_violation = Incident.first.violations.find { |inc| inc.type == 'killing' }
          individual_victims = killing_violation.associations_as_data['individual_victims']
          expect(individual_victims.count).to eq(1)
          expect(individual_victims[0]['unique_id']).to eq('ffbf1366-03b7-4fb6-acf7-a3ea678e0976')
        end

        it 'create the correct associations for maiming violation' do
          killing_violation = Incident.first.violations.find { |inc| inc.type == 'maiming' }
          individual_victims = killing_violation.associations_as_data['individual_victims']
          expect(individual_victims.count).to eq(2)
          expect(individual_victims.map { |iv| iv['unique_id'] }).to match_array(
            %w[fdab72b7-9186-4986-a521-f63fb8a6e762 ab75e7ac-ec72-40d3-9565-200652b6ebe4]
          )
        end
      end
    end
  end

  describe 'unique id' do
    before :each do
      Incident.any_instance.stub(:field_definitions).and_return([])
    end

    it 'should create a unique id' do
      SecureRandom.stub('uuid').and_return('191fc236-71f4-4a76-be09-f2d8c442e1fd')
      incident = Incident.new
      incident.save!
      incident.unique_identifier.should == '191fc236-71f4-4a76-be09-f2d8c442e1fd'
    end

    it 'should return last 7 characters of unique id as short id' do
      SecureRandom.stub('uuid').and_return('191fc236-71f4-4a76-be09-f2d8c442e1fd')
      incident = Incident.new
      incident.save!
      incident.short_id.should == '442e1fd'
    end
  end

  describe 'organization' do
    it 'should get created user' do
      incident = Incident.new
      incident.created_by = 'test'

      User.should_receive(:find_by_user_name).with('test').and_return('test1')
      incident.created_by_user.should == 'test1'
    end

    it 'should be set from user' do
      User.stub(:find_by_user_name).with('mj').and_return(double(organization: double(unique_id: 'UNICEF')))
      incident = Incident.create 'description' => 'My Test Incident Description', :created_by => 'mj'

      incident.created_organization.should == 'UNICEF'
    end
  end

  describe '.copy_from_case' do
    before(:each) do
      clean_data(SearchableIdentifier, Incident, Child, PrimeroModule, User) && module_cp
      module_cp = PrimeroModule.new(
        unique_id: 'primeromodule-cp',
        field_map: {
          map_to: 'primeromodule-cp',
          fields: [
            { source: 'age', target: 'age' },
            { source: 'sex', target: 'sex' },
            { source: 'protection_concerns', target: 'protection_concerns' }
          ]
        }
      )
      module_cp.save(validate: false)
    end

    let(:incident_user) do
      incident_user = User.new(user_name: 'incident_user', agency_id: Agency.last.id)
      incident_user.save(validate: false)
      incident_user
    end

    let(:case_cp) do
      cp_user = User.new(user_name: 'cp_user', agency_id: Agency.last.id)
      cp_user.save(validate: false)
      case_cp = Child.new_with_user(
        cp_user,
        name: 'Niall McPherson', age: 12, sex: 'male',
        protection_concerns: %w[unaccompanied separated], ethnicity: 'other',
        module_id: 'primeromodule-cp',
        created_by: 'user1'
      )
      case_cp.save!
      case_cp.reload
    end

    it 'copies data from the linked case according to the configuration' do
      incident = Incident.new_with_user(
        nil,
        survivor_code: 'abc123', module_id: 'primeromodule-cp', incident_case_id: case_cp.id
      )
      incident.save!

      expect(incident.data['age']).to eq(case_cp.age)
      expect(incident.data['sex']).to eq(case_cp.sex)
      expect(incident.data['protection_concerns']).to eq(case_cp.protection_concerns)
      expect(incident.case.id).to eq(case_cp.id)
    end

    it 'does not copy data from the linked incident if the link already exists' do
      incident = Incident.new_with_user(
        nil,
        survivor_code: 'abc123', module_id: 'primeromodule-cp', incident_case_id: case_cp.id
      )
      incident.save!
      case_cp.age = 13
      case_cp.save!
      incident.survivor_code = 'xyz123'
      incident.save

      expect(incident.survivor_code).to eq('xyz123')
      expect(incident.data['age']).to eq(12)
    end

    it 'copies data from the linked case according to the configuration' do
      incident = Incident.new_with_user(
        incident_user,
        survivor_code: 'abc123', module_id: 'primeromodule-cp', incident_case_id: case_cp.id
      )
      incident.save!
      case_cp.reload

      expect(case_cp.last_updated_by).to eq('incident_user')
    end
  end

  describe '.update_violations' do
    let(:incident_data) do
      {
        'unique_id' => '790f958d-ac8e-414b-af64-e75831e3353a',
        'incident_code' => '0123456',
        'module_id' => 'primeromodule-mrm',
        'incident_date' => Date.new(2022, 12, 23),
        'description' => 'this is a test',
        'killing' => [{ 'violation_tally' => { 'total' => 1, 'girls' => 1 },
                        'context_km' => 'military_clashes',
                        'attack_type' => 'undetermined',
                        'weapon_category' => 'unknown',
                        'weapon_type' => 'unknown',
                        'verified' => 'report_pending_verification',
                        'ctfmr_verified' => 'verified',
                        'ctfmr_verified_date' => Date.new(2023, 1, 23),
                        'unique_id' => '222d97fb-b49d-401a-aff5-55dbe81a6fbf' }]
      }
    end

    before do
      travel_to Time.zone.local(2023, 1, 30, 11, 30, 44)
    end

    before :each do
      clean_data(SearchableIdentifier, Incident, Violation)
      incident_record = Incident.new_with_user(fake_user, incident_data)
      incident_record.save!
    end

    after do
      travel_back
    end

    shared_examples_for 'prop_change_update_violations' do |prop, additional = {}|
      it "updates violations if #{prop} attributes changed" do
        incident = Incident.first

        incident.update(additional.merge(prop.to_s => Date.today))

        expect(incident.violations.first.is_late_verification).to be(false)
      end
    end

    it_should_behave_like 'prop_change_update_violations', 'incident_date'
    it_should_behave_like 'prop_change_update_violations', 'incident_date_end', is_incident_date_range: true

    it 'does not update violations other attributes changed' do
      incident = Incident.first
      incident.incident_code = 'new-code'
      incident.save!

      expect(incident.violations.first.is_late_verification).to be(true)
    end
  end

  describe 'add_alert_on_case' do
    before(:each) do
      clean_data(
        SearchableIdentifier, Agency, SystemSettings, User, Incident, Child, PrimeroModule, Violation
      ) && module_cp

      Agency.create!(unique_id: 'agency-1', agency_code: 'a1', name: 'Agency')

      SystemSettings.create!(changes_field_to_form: { incident_details: 'incident_from_case' })
    end

    let(:case_cp) do
      cp_user = User.new(user_name: 'cp_user', agency_id: Agency.last.id)
      cp_user.save(validate: false)

      case_cp = Child.new_with_user(
        cp_user,
        name: 'Niall McPherson', age: 12, sex: 'male',
        protection_concerns: %w[unaccompanied separated], ethnicity: 'other',
        module_id: 'primeromodule-cp'
      )
      case_cp.save!
      case_cp.reload
      case_cp
    end

    let(:incident_user) { User.new(user_name: 'incident_user', agency_id: Agency.last.id) }

    context 'when incident creator is not the case owner' do
      before do
        incident = Incident.new_with_user(
          incident_user,
          survivor_code: 'abc123',
          module_id: 'primeromodule-cp'
        )
        incident.case = case_cp
        incident.save!

        case_cp.reload
      end

      it 'should add an alert for the case' do
        expect(case_cp.alerts.size).to eq(1)
        expect(case_cp.alerts.first.type).to eq('incident_from_case')
        expect(case_cp.alerts.first.form_sidebar_id).to eq('incident_from_case')
      end
    end

    it 'should add a record history in the case after incident is created' do
      last_updated_at = case_cp.last_updated_at

      incident = Incident.new_with_user(
        incident_user,
        survivor_code: 'abc123', module_id: 'primeromodule-cp'
      )
      incident.case = case_cp
      incident.save!

      case_cp.reload

      expect(
        case_cp.record_histories.map { |history| history.record_changes.keys }.flatten.include?('incidents')
      ).to be_truthy
      expect(case_cp.last_updated_at > last_updated_at).to be_truthy
    end
  end

  describe '#update_properties' do
    let(:incident) do
      Incident.create!(
        unique_id: '1a2b3c', incident_code: '0123456', description: 'this is a test', module_id: PrimeroModule::MRM
      )
    end

    before do
      data = incident.data.clone
      data['recruitment'] = [
        {
          'unique_id' => '8dccaf74-e9aa-452a-9b58-dc365b1062a2',
          'violation_tally' => { 'boys' => 3, 'girls' => 1, 'unknown' => 0, 'total' => 4 },
          'name' => 'violation1'
        }
      ]
      data['responses'] = [
        {
          'unique_id' => '36c09588-5489-4d0f-a129-8f5868222cf2',
          'name' => 'intervention2',
          'violations_ids' => ['8dccaf74-e9aa-452a-9b58-dc365b1062a2']
        }
      ]
      data['individual_victims'] = [
        {
          'unique_id' => '53baed05-a012-42e9-ad8d-5c5660ac5159',
          'name' => 'individual1',
          'violations_ids' => ['8dccaf74-e9aa-452a-9b58-dc365b1062a2']
        }
      ]
      data['sources'] = [
        {
          'unique_id' => '7742b9db-2db2-4421-bff7-9aae6272fc4a',
          'name' => 'source1',
          'violations_ids' => ['8dccaf74-e9aa-452a-9b58-dc365b1062a2']
        }
      ]
      data['perpetrators'] = [
        {
          'unique_id' => 'ac4ea377-4223-453d-a8eb-01475c7dcec6',
          'name' => 'perpetrator1',
          'violations_ids' => ['8dccaf74-e9aa-452a-9b58-dc365b1062a2']
        }
      ]
      data['group_victims'] = [
        {
          'unique_id' => 'ae0de249-d8d9-44a6-9f7f-9dd316b46385',
          'name' => 'group1',
          'violations_ids' => ['8dccaf74-e9aa-452a-9b58-dc365b1062a2']
        }
      ]
      incident.update_properties(fake_user, data)
      incident.save!
    end

    it 'creates a violation record' do
      violation = Violation.first
      expect(Violation.count).to eq(1)
      expect(violation.unique_id).to eq('8dccaf74-e9aa-452a-9b58-dc365b1062a2')
    end

    it 'creates a responses record' do
      response = Response.first
      expect(Response.count).to eq(1)
      expect(response.unique_id).to eq('36c09588-5489-4d0f-a129-8f5868222cf2')
    end

    it 'creates a individual_victims record' do
      individual_victim = IndividualVictim.first
      expect(IndividualVictim.count).to eq(1)
      expect(individual_victim.unique_id).to eq('53baed05-a012-42e9-ad8d-5c5660ac5159')
    end

    it 'creates a sources record' do
      source = Source.first
      expect(Source.count).to eq(1)
      expect(source.unique_id).to eq('7742b9db-2db2-4421-bff7-9aae6272fc4a')
    end

    it 'creates a perpetrators record' do
      perpetrator = Perpetrator.first
      expect(Perpetrator.count).to eq(1)
      expect(perpetrator.unique_id).to eq('ac4ea377-4223-453d-a8eb-01475c7dcec6')
    end

    it 'creates a group_victims record' do
      group_victim = GroupVictim.first
      expect(GroupVictim.count).to eq(1)
      expect(group_victim.unique_id).to eq('ae0de249-d8d9-44a6-9f7f-9dd316b46385')
    end
  end

  describe '#associations_as_data' do
    let(:incident) do
      Incident.create!(
        unique_id: '1a2b3c', incident_code: '987654', description: 'this is a test', module_id: PrimeroModule::MRM
      )
    end

    let(:incident2) do
      Incident.create!(
        unique_id: '15e65cf1-6980-4c7c-a591-94f900f5d721',
        incident_code: '6980',
        description: 'this is a second test',
        module_id: PrimeroModule::MRM
      )
    end

    before(:each) do
      clean_data(SearchableIdentifier, Incident, Violation, IndividualVictim)
      data = incident.data.clone
      data['recruitment'] = [
        {
          'unique_id' => '8dccaf74-e9aa-452a-9b58-dc365b1062a2',
          'violation_tally' => { 'boys' => 3, 'girls' => 1, 'unknown' => 0, 'total' => 4 },
          'name' => 'violation1'
        }
      ]
      data['responses'] = [
        {
          'unique_id' => '36c09588-5489-4d0f-a129-8f5868222cf2',
          'name' => 'intervention2',
          'violations_ids' => ['8dccaf74-e9aa-452a-9b58-dc365b1062a2']
        }
      ]
      data['individual_victims'] = [
        {
          'unique_id' => '53baed05-a012-42e9-ad8d-5c5660ac5159',
          'name' => 'individual1',
          'violations_ids' => ['8dccaf74-e9aa-452a-9b58-dc365b1062a2']
        }
      ]
      data['sources'] = [
        {
          'unique_id' => '7742b9db-2db2-4421-bff7-9aae6272fc4a',
          'name' => 'source1',
          'violations_ids' => ['8dccaf74-e9aa-452a-9b58-dc365b1062a2']
        }
      ]
      data['perpetrators'] = [
        {
          'unique_id' => 'ac4ea377-4223-453d-a8eb-01475c7dcec6',
          'name' => 'perpetrator1',
          'violations_ids' => ['8dccaf74-e9aa-452a-9b58-dc365b1062a2']
        }
      ]
      data['group_victims'] = [
        {
          'unique_id' => 'ae0de249-d8d9-44a6-9f7f-9dd316b46385',
          'name' => 'group1',
          'violations_ids' => ['8dccaf74-e9aa-452a-9b58-dc365b1062a2']
        }
      ]
      incident.update_properties(fake_user, data)
      incident.save!
    end

    it 'creates a violation record' do
      incident_associations_as_data =
        {
          'killing' => [],
          'maiming' => [],
          'recruitment' => [
            {
              'name' => 'violation1',
              'type' => 'recruitment',
              'unique_id' => '8dccaf74-e9aa-452a-9b58-dc365b1062a2',
              'violation_tally' => { 'boys' => 3, 'girls' => 1, 'total' => 4, 'unknown' => 0 }
            }
          ],
          'sexual_violence' => [],
          'abduction' => [],
          'attack_on_hospitals' => [],
          'attack_on_schools' => [],
          'military_use' => [],
          'denial_humanitarian_access' => [],
          'sources' => [
            { 'name' => 'source1', 'unique_id' => '7742b9db-2db2-4421-bff7-9aae6272fc4a',
              'violations_ids' => ['8dccaf74-e9aa-452a-9b58-dc365b1062a2'] }
          ],
          'perpetrators' => [
            { 'name' => 'perpetrator1', 'unique_id' => 'ac4ea377-4223-453d-a8eb-01475c7dcec6',
              'violations_ids' => ['8dccaf74-e9aa-452a-9b58-dc365b1062a2'] }
          ],
          'individual_victims' => [
            { 'name' => 'individual1', 'unique_id' => '53baed05-a012-42e9-ad8d-5c5660ac5159',
              'violations_ids' => ['8dccaf74-e9aa-452a-9b58-dc365b1062a2'] }
          ],
          'group_victims' => [
            { 'name' => 'group1', 'unique_id' => 'ae0de249-d8d9-44a6-9f7f-9dd316b46385',
              'violations_ids' => ['8dccaf74-e9aa-452a-9b58-dc365b1062a2'] }
          ],
          'responses' => [
            { 'name' => 'intervention2', 'unique_id' => '36c09588-5489-4d0f-a129-8f5868222cf2',
              'violations_ids' => '8dccaf74-e9aa-452a-9b58-dc365b1062a2' }
          ]
        }
      expect(incident.incident_code).to eq('987654')
      expect(incident.associations_as_data('user')).to eq(incident_associations_as_data)
    end

    it 'adding a violation association' do
      data_to_update = {
        'individual_victims' => [
          {
            'id_number' => '1',
            'violations_ids' => ['8dccaf74-e9aa-452a-9b58-dc365b1062a2'],
            'individual_sex' => 'male',
            'nationality' => %w[nationality1],
            'unique_id' => '8d18d459-d75f-4a68-9862-3846b47ca3a0'
          }
        ]
      }
      incident.update_properties(fake_user, data_to_update)
      incident.save!
      individual_victims_result = incident.associations_as_data('user')['individual_victims']
      individual_victims_result_unique_id = individual_victims_result.map do |individual_victim|
        individual_victim['unique_id']
      end

      expect(individual_victims_result.count).to eq(2)
      expect(individual_victims_result_unique_id).to match_array(
        %w[8d18d459-d75f-4a68-9862-3846b47ca3a0 53baed05-a012-42e9-ad8d-5c5660ac5159]
      )
    end

    it 'adding new source association' do
      data_to_update = {
        'sources' => [
          {
            'id_number' => '1',
            'violations_ids' => ['8dccaf74-e9aa-452a-9b58-dc365b1062a2'],
            'source_interview_date' => '2023-02-01',
            'source_category' => 'secondary',
            'source_type' => 'photograph',
            'unique_id' => 'ba604357-5dce-4861-b740-af5d40398ef7'
          }
        ]
      }
      incident.update_properties(fake_user, data_to_update)
      incident.save!
      source_result = incident.associations_as_data('user')['sources']

      expect(source_result.count).to eq(2)
      expect(source_result.map { |source| source['unique_id'] }).to match_array(
        %w[ba604357-5dce-4861-b740-af5d40398ef7 7742b9db-2db2-4421-bff7-9aae6272fc4a]
      )
    end

    it 'updating a violation association' do
      data_to_update = {
        'individual_victims' => [
          {
            'name' => 'individual2',
            'unique_id' => '53baed05-a012-42e9-ad8d-5c5660ac5159'
          }
        ]
      }
      incident.update_properties(fake_user, data_to_update)
      incident.save!
      individual_victims_result = incident.associations_as_data('user')['individual_victims']
      individual_victim = individual_victims_result.find do |data|
        data['unique_id'] = '53baed05-a012-42e9-ad8d-5c5660ac5159'
      end
      expect(individual_victim['name']).to eq('individual2')
    end

    context 'when add a new violation with its response' do
      it 'insert the violation and violation association' do
        data_to_update = {
          'responses' => [
            {
              'intervention_action_notes' => 'random test',
              'violations_ids' => 'dca4d9fa-9522-49fb-8050-1d92497669f4',
              'intervention_armed_force_group' => 'test',
              'intervention_task_force_type' => %w[public_statement none_required],
              'unique_id' => '535d15f1-f01a-4884-86e8-7de9333b49b3'
            }
          ],
          'killing' => [
            {
              'attack_type' => 'direct_attack',
              'weapon_type' => 'airstrike',
              'type' => 'killing',
              'unique_id' => 'dca4d9fa-9522-49fb-8050-1d92497669f4',
              'violation_tally' => { 'boys' => 3, 'girls' => 1, 'total' => 4, 'unknown' => 0 }
            }

          ]
        }
        incident2.update_properties(fake_user, data_to_update)
        incident2.save!
        killing_data = incident2.associations_as_data('user')['killing']
        responses_data = incident2.associations_as_data('user')['responses']
        killing_unique_ids = killing_data.map { |data| data['unique_id'] }
        responses_unique_ids = responses_data.map { |data| data['unique_id'] }

        expect(killing_unique_ids.count).to eq(1)
        expect(killing_unique_ids).to match_array(
          %w[dca4d9fa-9522-49fb-8050-1d92497669f4]
        )

        expect(responses_unique_ids.count).to eq(1)
        expect(responses_unique_ids).to match_array(
          %w[535d15f1-f01a-4884-86e8-7de9333b49b3]
        )
      end
    end
  end

  describe '#can_be_assigned?' do
    let(:child) do
      Child.create!(
        data: {
          short_id: 'abc123', name: 'Test1', hidden_name: true, age: 5, sex: 'male', owned_by: 'user1'
        }
      )
    end
    let(:incident) do
      Incident.create!(
        unique_id: '1a2b3c', incident_code: '987654', description: 'this is a test', incident_case_id: child.id
      )
    end

    it 'when incident_case_id is present?' do
      expect(incident.can_be_assigned?).to be false
    end

    it 'when incident_case_id is blank?' do
      incident.update(incident_case_id: nil)
      expect(incident.can_be_assigned?).to be true
    end
  end

  describe 'phonetic tokens' do
    before do
      clean_data(SearchableIdentifier, Incident)
    end

    it 'generates the phonetic tokens' do
      incident = Incident.create!(data: { super_incident_name: 'George', incident_description: 'New Incident' })
      expect(incident.tokens).to eq(%w[JRJ N ANST])
    end
  end

  describe '#calculate_incident_date_derived' do
    before do
      clean_data(Incident)
    end

    it 'sets the incident_date_derived field' do
      incident = Incident.create!(data: { super_incident_name: 'George', incident_description: 'New Incident',
                                          incident_date: '2024-10-08' })

      expect(incident.incident_date_derived).to eq(Date.new(2024, 10, 8))
    end
  end

  private

  def create_incident_with_created_by(created_by, options = {})
    user = User.new(user_name: created_by, agency_id: Agency.last.id)
    Incident.new_with_user(user, options)
  end

  after do
    clean_data(
      SearchableIdentifier, User, Agency, Role, Incident, Child, PrimeroModule, PrimeroProgram, UserGroup, FormSection,
      Field, Violation, Response, IndividualVictim, Source, Perpetrator, GroupVictim
    )
  end
end
