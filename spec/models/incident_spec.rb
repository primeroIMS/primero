# frozen_string_literal: true

require 'rails_helper'
require 'will_paginate'

describe Incident do
  before(:all) do
    clean_data(Agency, User, Child, PrimeroProgram, UserGroup, PrimeroModule, FormSection, Field)
  end

  describe 'save' do
    before(:all) { create(:agency) }

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
      clean_data(Incident, Child, PrimeroModule) && module_cp
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

    let(:case_cp) do
      Child.create!(
        name: 'Niall McPherson', age: 12, sex: 'male',
        protection_concerns: %w[unaccompanied separated], ethnicity: 'other',
        module_id: 'primeromodule-cp'
      )
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
  end

  describe 'add_alert_on_case' do
    before(:each) do
      clean_data(Agency, SystemSettings, User, Incident, Child, PrimeroModule) && module_cp

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

    it 'should add an alert for the case if the incident creator is not the case owner' do
      incident = Incident.new_with_user(
        User.new(user_name: 'incident_user', agency_id: Agency.last.id),
        survivor_code: 'abc123', module_id: 'primeromodule-cp'
      )
      incident.case = case_cp
      incident.save!

      case_cp.reload

      expect(case_cp.alerts.size).to eq(1)
    end

    it 'should add a record history in the case after incident is created' do
      last_updated_at = case_cp.last_updated_at

      incident = Incident.new_with_user(
        User.new(user_name: 'incident_user', agency_id: Agency.last.id),
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

  private

  def create_incident_with_created_by(created_by,options = {})
    user = User.new(user_name: created_by, agency_id: Agency.last.id )
    Incident.new_with_user(user, options)
  end
end
