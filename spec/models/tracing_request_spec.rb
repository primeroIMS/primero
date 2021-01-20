# frozen_string_literal: true

require 'rails_helper'
require 'sunspot'
require 'will_paginate'

describe TracingRequest do
  before :each do
    clean_data(Trace, TracingRequest)
  end

  describe 'save' do
    before(:each) do
      clean_data(Agency)
      create(:agency)
    end

    it 'should save with generated tracing request_id and inquiry_date' do
      tracing_request = create_tracing_request_with_created_by(
        'jdoe', 'last_known_location' => 'London', 'relation_age' => '6'
      )
      tracing_request.save!
      tracing_request[:id].should_not be_nil
      tracing_request.inquiry_date.should_not be_nil
    end

    it 'should allow edit inquiry_date' do
      tracing_request = create_tracing_request_with_created_by(
        'jdoe', 'relation_age' => '6', 'inquiry_date' => '19/Jul/2014'
      )
      tracing_request.save!
      tracing_request[:id].should_not be_nil
      tracing_request.inquiry_date.should eq('19/Jul/2014')
    end

    it 'should save the traces' do
      tracing_request = create_tracing_request_with_created_by(
        'jdoe',
        'location_last' => 'London',
        'relation_age' => '6',
        'tracing_request_subform_section' => [{ 'name': 'Trace Name' }]
      )
      tracing_request.save!
      expect(tracing_request.location_last).to eq('London')
      expect(tracing_request.relation_age).to eq('6')
      expect(tracing_request.traces.map(&:name)).to eq(['Trace Name'])
    end
  end

  describe 'managing traces' do
    describe 'update_properties' do
      let(:tracing_request) { TracingRequest.create!(relation_name: 'William Jones') }
      let(:trace1) { Trace.create!(tracing_request: tracing_request, relation: 'father', name: 'Ethel') }
      let(:trace2) { Trace.create!(tracing_request: tracing_request, relation: 'father', name: 'Allister Jones') }
      let(:uuid) { SecureRandom.uuid }

      before do
        data = tracing_request.data.clone
        data['tracing_request_subform_section'] = [
          { 'unique_id' => uuid, 'relation' => 'uncle', 'name' => 'Maria Jones' },
          { 'unique_id' => trace1.id, 'relation' => 'father', 'name' => 'Ethel Jones' }
        ]
        tracing_request.update_properties(fake_user, data)
        tracing_request.save!
      end

      it 'creates associated trace records from the tracing_request_subform_section data key' do
        trace = Trace.find_by(id: uuid)
        expect(trace).to be
        expect(trace.relation).to eq('uncle')
      end

      it 'updates existing associated trace records from the tracing_request_subform_section data key' do
        trace1.reload
        expect(trace1.name).to eq('Ethel Jones')
      end

      it 'does not retain trace data under the tracing_request_subform_section data key' do
        expect(tracing_request.data['tracing_request_subform_section']).to be_nil
      end

      it 'does not remove associated traces that are not represented in the tracing_request_subform_section data key' do
        trace2.reload
        expect(trace2).to be
        expect(trace2.tracing_request_id).to eq(tracing_request.id)
      end
    end
  end

  describe 'new_with_user_name' do
    it 'should create regular tracing request fields' do
      tracing_request = create_tracing_request_with_created_by(
        'jdoe', 'location_last' => 'London', 'relation_age' => '6'
      )
      expect(tracing_request.location_last).to eq('London')
      expect(tracing_request.relation_age).to eq('6')
    end

    it 'should create a unique id' do
      SecureRandom.stub('uuid').and_return('191fc236-71f4-4a76-be09-f2d8c442e1fd')
      tracing_request = create_tracing_request_with_created_by('jdoe', 'last_known_location' => 'London')
      tracing_request.save!
      tracing_request.data['unique_identifier'].should == '191fc236-71f4-4a76-be09-f2d8c442e1fd'
    end

    it 'should not create a unique id if already exists' do
      tracing_request = create_tracing_request_with_created_by(
        'jdoe', 'last_known_location' => 'London', 'unique_identifier' => 'rapidftrxxx5bcde'
      )
      tracing_request.data['unique_identifier'].should == 'rapidftrxxx5bcde'
    end

    it 'should create a created_by field with the user name' do
      tracing_request = create_tracing_request_with_created_by('jdoe', 'some_field' => 'some_value')
      tracing_request.data['created_by'].should == 'jdoe'
    end

    it 'should create a posted_at field with the current date' do
      DateTime.stub(:now).and_return(Time.utc(2010, 'jan', 22, 14, 5, 0))
      tracing_request = create_tracing_request_with_created_by('some_user', 'some_field' => 'some_value')
      tracing_request.posted_at.should == DateTime.parse('2010-01-22 14:05:00UTC')
    end

    describe 'when the created at field is not supplied' do
      it 'should create a created_at field with time of creation' do
        DateTime.stub(:now).and_return(Time.utc(2010, 'jan', 14, 14, 5, 0))
        tracing_request = create_tracing_request_with_created_by('some_user', 'some_field' => 'some_value')
        tracing_request.created_at.should == DateTime.parse('2010-01-14 14:05:00UTC')
      end
    end

    describe 'when the created at field is supplied' do
      it 'should use the supplied created at value' do
        tracing_request = create_tracing_request_with_created_by(
          'some_user', 'some_field' => 'some_value', 'created_at' => DateTime.parse('2010-01-14 14:05:00UTC')
        )
        tracing_request.created_at.should == DateTime.parse('2010-01-14 14:05:00UTC')
      end
    end
  end

  describe 'unique id' do
    it 'should create a unique id' do
      SecureRandom.stub('uuid').and_return('191fc236-71f4-4a76-be09-f2d8c442e1fd')
      tracing_request = TracingRequest.new
      tracing_request.save!
      tracing_request.unique_identifier.should == '191fc236-71f4-4a76-be09-f2d8c442e1fd'
    end

    it 'should return last 7 characters of unique id as short id' do
      SecureRandom.stub('uuid').and_return('191fc236-71f4-4a76-be09-f2d8c442e1fd')
      tracing_request = TracingRequest.new
      tracing_request.save!
      tracing_request.short_id.should == '442e1fd'
    end
  end

  describe 'record history' do
    it 'should maintain history when tracing_request is reunited and message is added' do
      tracing_request = TracingRequest.create('created_by' => 'me', 'created_organization' => 'stc')
      tracing_request.reunited = true
      tracing_request.save!
      reunited_history = tracing_request.histories.first.record_changes['reunited']
      reunited_history['from'].should be_nil
      reunited_history['to'].should == true
    end
  end

  describe 'organization' do
    it 'should get created user' do
      tracing_request = TracingRequest.new
      tracing_request.created_by = 'test'

      User.should_receive(:find_by_user_name).with('test').and_return('test1')
      tracing_request.created_by_user.should == 'test1'
    end

    it 'should be set from user' do
      User.stub(:find_by_user_name).with('mj').and_return(double(organization: double(unique_id: 'UNICEF')))
      tracing_request = TracingRequest.create 'relation_name' => 'Jaco', :created_by => 'mj'

      tracing_request.created_organization.should == 'UNICEF'
    end
  end

  private

  def create_tracing_request(name, options = {})
    options.merge!(
      'relation_name' => name, 'location_last' => 'new york', 'created_by' => 'me', 'created_organization' => 'stc'
    )
    TracingRequest.create(options)
  end

  def create_tracing_request_with_created_by(created_by, options = {})
    user = User.new(user_name: created_by, agency_id: Agency.last.id)
    TracingRequest.new_with_user(user, options)
  end
end
