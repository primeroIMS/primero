# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

require 'rails_helper'
require 'sunspot' if Rails.configuration.solr_enabled

describe Child do
  describe 'quicksearch' do
    before do
      clean_data(SearchableIdentifier, Child, Family)
    end

    it 'has a searchable case id, survivor number' do
      expect(Child.quicksearch_fields).to include('case_id_display', 'survivor_code_no')
    end

    it 'can find a child by survivor code' do
      Child.create!(data: { name: 'Lonnie', survivor_code_no: 'ABC123XYZ' })

      search_result = PhoneticSearchService.search(Child, query: 'ABC123XYZ').records
      expect(search_result).to have(1).child
      expect(search_result.first.survivor_code_no).to eq('ABC123XYZ')
    end

    it 'can find a child by client code' do
      Child.create!(data: { name: 'Lonnie', client_code: 'ABC123XYZ' })

      search_result = PhoneticSearchService.search(Child, query: 'ABC123XYZ').records
      expect(search_result).to have(1).child
      expect(search_result.first.client_code).to eq('ABC123XYZ')
    end

    it 'can find a child by family number' do
      family = Family.create!(
        family_number: '4225',
        family_members: [
          { unique_id: '123', relation_name: 'Family Name', relation_age: 5, relation_sex: 'male' }
        ]
      )

      child = Child.create!(data: { name: 'Lonnie', survivor_code_no: 'ABC123XYZ' })
      child.family = family
      child.save!

      filter = SearchFilters::TextValue.new(field_name: 'family_number', value: '4225')
      search_result = PhoneticSearchService.search(Child, filters: [filter]).records
      expect(search_result).to have(1).child
      expect(search_result.first.family_number).to eq('4225')
    end
  end

  describe 'update_properties' do
    before do
      clean_data(SearchableIdentifier, Child)
    end

    it 'should replace old properties with updated ones' do
      child = Child.new(data: { 'name' => 'Dave', 'age' => 28, 'last_known_location' => 'London' })
      new_properties = { 'name' => 'Dave', 'age' => 35 }
      child.update_properties(fake_user, new_properties)
      expect(child.age).to eq(35)
      expect(child.name).to eq('Dave')
      expect(child.data['last_known_location']).to eq('London')
    end

    it 'should not replace old properties when when missing from update' do
      child = Child.new(data: { 'origin' => 'Croydon', 'last_known_location' => 'London' })
      new_properties = { 'last_known_location' => 'Manchester' }
      child.update_properties(fake_user, new_properties)
      expect(child.data['last_known_location']).to eq('Manchester')
      expect(child.data['origin']).to eq('Croydon')
    end

    it 'should populate last_updated_by field with the user_name who is updating' do
      child = Child.new
      child.update_properties(fake_user, {})
      expect(child.last_updated_by).to eq(fake_user_name)
    end
  end

  describe 'incidents from case' do
    describe 'update_properties' do
      let(:case1) { Child.create!(age: 12, sex: 'male') }
      let(:incident1) { Incident.create!(case: case1, description: 'incident1') }
      let(:incident2) { Incident.create!(case: case1, description: 'incident2') }
      let(:uuid) { SecureRandom.uuid }

      before do
        clean_data(SearchableIdentifier, Child)
        data = case1.data.clone
        data['incident_details'] = [
          { 'unique_id' => incident1.id, 'description' => 'incident1 - modified' },
          { 'unique_id' => uuid, 'description' => 'incident3' }
        ]
        case1.update_properties(fake_user, data)
        case1.save!
      end

      it 'creates associated incident records from the incident_details data key' do
        incident = Incident.find_by(id: uuid)
        expect(incident).to be
        expect(incident.data['description']).to eq('incident3')
      end

      it 'copies mapped fields from the case to the incident' do
        incident = Incident.find_by(id: uuid)
        expect(incident.data['age']).to eq(case1.age)
        expect(incident.data['sex']).to eq(case1.sex)
      end

      it 'updates existing associated incident records from the incident_details data key' do
        incident1.reload
        expect(incident1.data['description']).to eq('incident1 - modified')
      end

      it 'does not retain incident data under the incident_details data key' do
        expect(case1.data['incident_details']).to be_nil
      end

      it 'does not remove associated inicdents that are not represented in the incident_details data key' do
        incident2.reload
        expect(incident2).to be
        expect(incident2.incident_case_id).to eq(case1.id)
      end
    end
  end

  describe 'registry_record' do
    before do
      clean_data(SearchableIdentifier, Child, RegistryRecord)
    end

    let(:registry_record1) { RegistryRecord.create!(registry_type: 'farmer') }
    let(:case1) { Child.create!(age: 13, sex: 'female', registry_record: registry_record1) }
    let(:case2) { Child.create!(age: 11, sex: 'male', registry_record: registry_record1) }

    it 'links to a case' do
      expect(case1.registry_record).to eq(registry_record1)
      expect(case2.registry_record).to eq(registry_record1)
      expect(registry_record1.cases).to include(case1, case2)
    end

    after do
      clean_data(SearchableIdentifier, Child, RegistryRecord)
    end
  end

  describe 'family record' do
    before do
      clean_data(SearchableIdentifier, Child, Family)
    end

    let(:family1) do
      Family.create!(
        data: {
          family_number: '40bf9109',
          module_id: PrimeroModule::CP,
          family_size: 1,
          family_notes: 'Notes about the family',
          family_members: [
            {
              unique_id: '001',
              family_relationship: 'relationship1',
              family_relationship_notes: 'Notes about the relationship 001',
              family_relationship_notes_additional: 'Additional notes about the relationship 001',
              relation_name: 'Member 1',
              relation_sex: 'male',
              relation_age: 10
            }
          ]
        }
      )
    end

    let(:case1) { Child.create!(family: family1, data: { age: 13, sex: 'female', family_member_id: '001' }) }

    it 'links a family and a family_member to a case' do
      expect(case1.family).to eq(family1)
      expect(family1.cases).to include(case1)

      family_member = family1.family_members.find { |member| member['unique_id'] == '001' }

      expect(family_member['case_id']).to eq(case1.id)
      expect(family_member['case_id_display']).to eq(case1.case_id_display)
    end
  end

  describe 'validation' do
    it 'should allow blank age' do
      child = Child.new(data: { age: '', another_field: 'blah' })
      child.should be_valid
      child = Child.new(data: { foo: 'bar' })
      child.should be_valid
    end
  end

  describe 'save' do
    before(:each) do
      clean_data(User, Agency)
      create(:agency, name: 'unicef')
    end

    it 'should save with generated case_id and registration_date' do
      child = child_with_created_by('jdoe', 'last_known_location' => 'London', 'age' => '6')
      child.save!
      child.case_id.should_not be_nil
      child.registration_date.should_not be_nil
    end

    it 'should allow edit registration_date' do
      child = child_with_created_by(
        'jdoe',
        'last_known_location' => 'London', 'age' => '6',
        'registration_date' => Date.parse('19/Jul/2014')
      )
      child.save!
      child.case_id.should_not be_nil
      child.registration_date.should eq Date.parse('19/Jul/2014')
    end

    it 'should save blank age' do
      # TODO: - i18n could change depending on how we want name / display to look
      User.stub(:find_by_user_name).and_return(
        double(organization: 'stc', location: 'my_country::my_state::my_town', agency: 'unicef-un')
      )
      child = Child.new(
        data: {
          :age => '', :another_field => 'blah', 'created_by' => 'me', 'created_organization' => 'stc'
        }
      )
      expect(child.save).to be_truthy
      child = Child.new(data: { foo: 'bar' })
      expect(child.save).to be_truthy
    end
  end

  describe 'new_with_user_name' do
    before(:each) do
      clean_data(User, Agency)
      create(:agency, name: 'unicef')
    end

    it 'should create regular child fields' do
      child = child_with_created_by('jdoe', 'last_known_location' => 'London', 'age' => 6)
      expect(child.data['last_known_location']).to eq('London')
      expect(child.age).to eq(6)
    end

    it 'should create a unique id' do
      SecureRandom.stub('uuid').and_return('191fc236-71f4-4a76-be09-f2d8c442e1fd')
      child = child_with_created_by('jdoe', 'last_known_location' => 'London')
      child.save!
      child.unique_identifier.should == '191fc236-71f4-4a76-be09-f2d8c442e1fd'
    end

    it 'should not create a unique id if already exists' do
      child = child_with_created_by(
        'jdoe',
        'last_known_location' => 'London', 'unique_identifier' => 'rapidftrxxx5bcde'
      )
      child.unique_identifier.should == 'rapidftrxxx5bcde'
    end

    it 'should create a created_by field with the user name' do
      child = child_with_created_by('jdoe', 'some_field' => 'some_value')
      child.created_by.should == 'jdoe'
    end

    it 'should create a posted_at field with the current date' do
      DateTime.stub(:now).and_return(Time.utc(2010, 'jan', 22, 14, 5, 0))
      child = child_with_created_by('some_user', 'some_field' => 'some_value')
      child.posted_at.should == DateTime.parse('2010-01-22 14:05:00UTC')
    end

    it 'should assign name property as nil if name is not passed before saving child record' do
      child = Child.new_with_user(fake_user, 'some_field' => 'some_value')
      child.save
      child = Child.find(child.id)
      expect(child.name).to be_nil
    end

    describe 'when the created at field is not supplied' do
      it 'should create a created_at field with time of creation' do
        DateTime.stub(:now).and_return(Time.utc(2010, 'jan', 14, 14, 5, 0))
        child = child_with_created_by('some_user', 'some_field' => 'some_value')
        child.created_at.should == DateTime.parse('2010-01-14 14:05:00UTC')
      end
    end

    describe 'when the created at field is supplied' do
      it 'should use the supplied created at value' do
        child = child_with_created_by(
          'some_user',
          'some_field' => 'some_value', 'created_at' => '2010-01-14 14:05:00UTC'
        )
        child.created_at.should == '2010-01-14 14:05:00UTC'
      end
    end
  end

  describe 'unique id' do
    it 'should create a unique id' do
      SecureRandom.stub('uuid').and_return('191fc236-71f4-4a76-be09-f2d8c442e1fd')
      child = Child.new
      child.save!
      child.unique_identifier.should == '191fc236-71f4-4a76-be09-f2d8c442e1fd'
    end

    it 'should return last 7 characters of unique id as short id' do
      SecureRandom.stub('uuid').and_return('191fc236-71f4-4a76-be09-f2d8c442e1fd')
      child = Child.new
      child.save!
      child.short_id.should == '442e1fd'
    end
  end

  describe 'history log' do
    before :each do
      RecordHistory.delete_all
    end

    xit 'should maintain history when child is flagged and message is added' do
      child = Child.create(
        data: {
          'last_known_location' => 'London', 'created_by' => 'me', 'created_organization' => 'stc'
        }
      )
      child.add_flag('Duplicate record!', Date.today, 'me')
      flag_history = child.histories.first.record_changes['flags']
      expect(flag_history['from']).to be_nil
      expect(flag_history['to']['message']).to eq('Duplicate record!')
    end

    xit 'should maintain history when child is reunited and message is added' do
      child = Child.create(
        data: {
          'last_known_location' => 'London', 'created_by' => 'me', 'created_organization' => 'stc'
        }
      )
      child.reunited = true
      child.reunited_message = 'Finally home!'
      child.save!
      reunited_history = child.histories.first.record_changes['reunited']
      expect(reunited_history['from']).to be_nil
      expect(reunited_history['to']).to be_truthy
      reunited_message_history = child.histories.first.record_changes['reunited_message']
      expect(reunited_message_history['from']).to be_nil
      expect(reunited_message_history['to']).to eq('Finally home!')
    end
  end

  describe 'organization' do
    it 'should get created user' do
      child = Child.new
      child.created_by = 'test'

      User.should_receive(:find_by_user_name).with('test').and_return('test1')
      child.created_by_user.should == 'test1'
    end

    it 'should be set from user' do
      User.stub(:find_by_user_name).with('mj').and_return(double(organization: double(unique_id: 'UNICEF')))
      child = Child.create(data: { 'name' => 'Jaco', :created_by => 'mj' })

      child.created_organization.should == 'UNICEF'
    end
  end

  # TODO: For now skipping JSON datatype validation against form definition
  xdescribe 'validate dates and date ranges fields' do
    before do
      fields = [
        Field.new(
          'name' => 'a_date_field',
          'type' => 'date_field',
          'display_name_all' => 'A Date Field'
        ),
        Field.new(
          'name' => 'a_range_field',
          'type' => 'date_range',
          'display_name_all' => 'A Range Field'
        ),
        Field.new(
          'name' => 'b_range_field',
          'type' => 'date_range',
          'display_name_all' => 'B Range Field'
        )
      ]
      FormSection.create_or_update!(
        :unique_id => 'form_section_with_dates_fields',
        'visible' => true,
        :order => 1,
        'editable' => true,
        :fields => fields,
        :parent_form => 'case',
        'name_all' => 'Form Section With Dates Fields',
        'description_all' => 'Form Section With Dates Fields'
      )
    end

    it 'should validate single date field' do
      # date field invalid.
      child = create_child 'Bob McBobberson', a_date_field: 'asdlfkj',
                                              a_range_field_date_or_date_range: 'date_range',
                                              b_range_field_date_or_date_range: 'date_range'
      child.errors[:a_date_field].should eq(['Please enter the date in a valid format (dd-mmm-yyyy)'])

      # date valid.
      child = create_child 'Bob McBobberson', a_date_field: Date.parse('30-May-2014'),
                                              a_range_field_date_or_date_range: 'date_range',
                                              b_range_field_date_or_date_range: 'date_range'
      child.errors[:a_date_field].should eq([])
    end

    it 'should validate range fields' do
      # _from is wrong.
      child = create_child 'Bob McBobberson', a_range_field_from: 'aslkdjflkj', a_range_field_to: Date.parse('31-May-2014'),
                                              a_range_field_date_or_date_range: 'date_range',
                                              b_range_field_date_or_date_range: 'date_range'
      child.errors[:a_range_field].should eq(['Please enter the date in a valid format (dd-mmm-yyyy)'])

      # _to is wrong.
      child = create_child 'Bob McBobberson', a_range_field_from: '31-May-2014', a_range_field_to: 'alkdfjlj',
                                              a_range_field_date_or_date_range: 'date_range',
                                              b_range_field_date_or_date_range: 'date_range'
      child.errors[:a_range_field].should eq(['Please enter the date in a valid format (dd-mmm-yyyy)'])

      # _from and _to are wrong.
      child = create_child 'Bob McBobberson', a_range_field_from: 'aslkjlkj3', a_range_field_to: 'alkdfjlkj',
                                              a_range_field_date_or_date_range: 'date_range',
                                              b_range_field_date_or_date_range: 'date_range'
      child.errors[:a_range_field].should eq(['Please enter the date in a valid format (dd-mmm-yyyy)'])

      # range valid dates.
      child = create_child 'Bob McBobberson', a_range_field_from: '31-May-2014', a_range_field_to: '31-May-2014',
                                              a_range_field_date_or_date_range: 'date_range',
                                              b_range_field_date_or_date_range: 'date_range'
      child.errors[:a_range_field].should eq([])
    end

    it 'should validate range fields with single date selected' do
      # Single date selected wrong in the date range field.
      child = create_child 'Bob McBobberson', b_range_field: 'aslkdjflkj',
                                              b_range_field_date_or_date_range: 'date',
                                              a_range_field_date_or_date_range: 'date_range'
      child.errors[:b_range_field].should eq(['Please enter the date in a valid format (dd-mmm-yyyy)'])

      # valid date
      child = create_child 'Bob McBobberson', b_range_field: '31-May-2014', b_range_field_date_or_date_range: 'date',
                                              a_range_field_date_or_date_range: 'date_range'
      child.errors[:b_range_field].should eq([])
    end
  end

  describe 'record ownership' do
    before do
      clean_data(SearchableIdentifier, User, Agency, Incident, Child, Role, PrimeroModule, PrimeroProgram, UserGroup,
                 FormSection)

      @owner = create :user
      @previous_owner = create :user
      @referral = create :user

      @case = Child.new_with_user(@owner, previously_owned_by: @previous_owner.user_name,
                                          assigned_user_names: [@referral.user_name])
    end

    it 'can fetch the record owner' do
      expect(@case.owner).to eq(@owner)
    end

    after do
      clean_data(SearchableIdentifier, User, Agency, Incident, Child, Role, PrimeroModule, PrimeroProgram, UserGroup,
                 FormSection)
    end
  end

  describe 'case id code' do
    before do
      clean_data(SearchableIdentifier, User, Location, Role, Agency, PrimeroModule, PrimeroProgram, UserGroup,
                 SystemSettings)

      @permission_case ||= Permission.new(
        resource: Permission::CASE,
        actions: [Permission::READ, Permission::WRITE, Permission::CREATE]
      )
      @location_country = Location.create!(placename: 'Guinea', type: 'country', location_code: 'GUI')
      @location_region = Location.create!(
        placename: 'Kindia', type: 'region',
        location_code: 'GUI123', hierarchy_path: 'GUI.GUI123'
      )
      admin_role = Role.create!(name: 'Admin', permissions: Permission.all_available)
      agency = Agency.create!(agency_code: 'UN', name: 'UNICEF')
      @user = create(
        :user,
        user_name: 'bob123', full_name: 'full', password: 'passw0rd', password_confirmation: 'passw0rd',
        email: 'embob123@dd.net', agency_id: agency.id, role_id: admin_role.id, disabled: 'false',
        location: @location_region.location_code
      )
      @user2 = create(
        :user,
        user_name: 'joe456', full_name: 'full', password: 'passw0rd', password_confirmation: 'passw0rd',
        email: 'emjoe456@dd.net', agency_id: agency.id, role_id: admin_role.id, disabled: 'false'
      )
      @user3 = create(
        :user,
        user_name: 'tom789', full_name: 'full', password: 'passw0rd', password_confirmation: 'passw0rd',
        email: 'emtom789@dd.net', agency_id: agency.id, role_id: admin_role.id, disabled: 'false',
        location: @location_region.location_code
      )
    end

    context 'system case code format empty' do
      before :each do
        SystemSettings.create(default_locale: 'en')
        SystemSettings.current(true)
      end

      it 'should create an empty case id code' do
        child = Child.create!(data: { case_id: 'xyz123', created_by: @user.user_name })
        expect(child.case_id_code).to be_nil
      end

      it 'should create a case id display that matches short id' do
        child = Child.create!(data: { case_id: 'xyz123', created_by: @user.user_name })
        expect(child.case_id_display).to eq(child.short_id)
      end
    end

    context 'system case code separator empty' do
      before :each do
        ap1 = AutoPopulateInformation.new(
          field_key: 'case_id_code',
          format: %w[
            created_by_user.user_location.ancestor_by_type(country).location_code
            created_by_user.user_location.ancestor_by_type(region).location_code
            created_by_user.agency.agency_code
          ],
          auto_populated: true
        )
        SystemSettings.create(default_locale: 'en', auto_populate_list: [ap1])
        SystemSettings.current(true)
      end

      it 'should create a case id code without separators' do
        child = Child.create!(data: { case_id: 'xyz123', created_by: @user.user_name })
        expect(child.case_id_code).to eq('GUIGUI123UN')
      end

      it 'should create a case id display without separators' do
        child = Child.create!(data: { case_id: 'xyz123', created_by: @user.user_name })
        expect(child.case_id_display).to eq("GUIGUI123UN#{child.short_id}")
      end
    end

    context 'system case code format and separator present' do
      before :each do
        ap1 = AutoPopulateInformation.new(
          field_key: 'case_id_code',
          format: %w[
            created_by_user.user_location.ancestor_by_type(country).location_code
            created_by_user.user_location.ancestor_by_type(region).location_code
            created_by_user.agency.agency_code
          ],
          separator: '-', auto_populated: true
        )
        SystemSettings.create(default_locale: 'en', auto_populate_list: [ap1])
        SystemSettings.current(true)
      end

      it 'should create a case id code with separators' do
        child = Child.create!(data: { case_id: 'xyz123', created_by: @user.user_name })
        expect(child.case_id_code).to eq('GUI-GUI123-UN')
      end

      it 'should create a case id display with separators' do
        child = Child.create!(data: { case_id: 'xyz123', created_by: @user.user_name })
        expect(child.case_id_display).to eq("GUI-GUI123-UN-#{child.short_id}")
      end

      it 'should create a case id code if user location is missing' do
        child = Child.create!(data: { case_id: 'abc456', created_by: @user2.user_name })
        expect(child.case_id_code).to eq('UN')
      end

      it 'should create a case id display if user location is missing' do
        child = Child.create!(data: { case_id: 'abc456', created_by: @user2.user_name })
        expect(child.case_id_display).to eq("UN-#{child.short_id}")
      end

      it 'should create a case id code if user agency is missing' do
        child = Child.create!(data: { case_id: 'zzz', created_by: @user3.user_name })
        expect(child.case_id_code).to eq('GUI-GUI123-UN')
      end

      it 'should create a case id display if user agency is missing' do
        child = Child.create!(data: { case_id: 'zzz', created_by: @user3.user_name })
        expect(child.case_id_display).to eq("GUI-GUI123-UN-#{child.short_id}")
      end

      it 'should create a case id display with custom date format' do
        ap1_custom_date_format = AutoPopulateInformation.new(
          field_key: 'case_id_code',
          format: %w[
            created_by_user.user_location.ancestor_by_type(country).location_code
            created_by_user.user_location.ancestor_by_type(region).location_code
            created_by_user.agency.agency_code
            created_at.strftime(%m/%y)
          ],
          separator: '-', auto_populated: true
        )
        SystemSettings.update(default_locale: 'en', auto_populate_list: [ap1_custom_date_format])
        SystemSettings.current(true)
        child = Child.create!(data: { case_id: 'zzz', created_by: @user3.user_name })
        # TODO: This test breaks in the evenings when running on a machine on a local time zone because
        #       created_at is instantiated with DateTime but deserialized from Postgres jsonb
        #       using Time defaulted to UTC. Not a problem in production where all timezones are aligned,
        #       but until we make some guarantees, I'm ok with the test breaking at night as a reminder.
        expect(child.case_id_display).to eq("GUI-GUI123-UN-#{child.created_at.strftime('%m/%y')}-#{child.short_id}")
      end

      it 'should create a case id display with default date format' do
        ap1_default_date_format = AutoPopulateInformation.new(
          field_key: 'case_id_code',
          format: %w[
            created_by_user.user_location.ancestor_by_type(country).location_code
            created_by_user.user_location.ancestor_by_type(region).location_code
            created_by_user.agency.agency_code
            created_at
          ],
          separator: '-', auto_populated: true
        )
        SystemSettings.update(default_locale: 'en', auto_populate_list: [ap1_default_date_format])
        SystemSettings.current(true)
        child = Child.create!(data: { case_id: 'zzz', created_by: @user3.user_name })
        expect(child.case_id_display).to eq("GUI-GUI123-UN-#{child.created_at.strftime('%Y%m%d')}-#{child.short_id}")
      end
    end

    after do
      clean_data(SearchableIdentifier, User, Location, Role, Agency, PrimeroModule, PrimeroProgram, UserGroup,
                 SystemSettings)
    end
  end

  describe 'syncing of protection concerns' do
    before do
      clean_data(SearchableIdentifier, Child)
      User.stub(:find_by_user_name).and_return(double(organization: double(unique_id: 'UNICEF')))
      @protection_concerns = %w[Separated Unaccompanied]
    end

    it 'should add protection concerns from subform to multiselect protection concerns field' do
      @child = Child.new(
        data: {
          'name' => 'Tom', 'created_by' => 'me', 'protection_concerns' => @protection_concerns,
          'protection_concern_detail_subform_section' => [
            { protection_concern_type: 'Child is neglected' },
            { protection_concern_type: 'Extreme levels of poverty' },
            { protection_concern_type: 'Unaccompanied' }
          ]
        }
      )
      @child.save!
      @child.protection_concerns.should == @protection_concerns + ['Child is neglected', 'Extreme levels of poverty']
    end

    it 'should remove nils from protection concerns multiselect' do
      @child = Child.new(
        data: {
          'name' => 'Tom', 'created_by' => 'me', 'protection_concerns' => @protection_concerns,
          'protection_concern_detail_subform_section' => [
            { protection_concern_type: 'Child is neglected' },
            { protection_concern_type: nil },
            { protection_concern_type: nil },
            { protection_concern_type: 'Unaccompanied' }
          ]
        }
      )
      @child.save!
      @child.protection_concerns.should_not include(nil)
    end

    after do
      clean_data(SearchableIdentifier, Child)
    end
  end

  describe '.match_criteria' do
    before do
      clean_data(SearchableIdentifier, Child)
    end

    let(:case1) do
      Child.create!(
        name: 'Usama Yazan Al-Rashid',
        name_nickname: 'Usman Beg',
        sex: 'male',
        age: 13,
        date_of_birth: Date.new(2006, 10, 19),
        nationality: ['syria'],
        location_current: 'ABC123',
        ethnicity: ['kurd'],
        language: ['arabic'],
        consent_for_tracing: true,
        family_details_section: [
          {
            relation_name: 'Yazan Al-Rashid',
            relation: 'father',
            relation_age: 51,
            relation_date_of_birth: Date.new(1969, 1, 1),
            relation_ethicity: ['arab'],
            relation_nationality: ['iraq']
          },
          {
            relation_name: 'Hadeel Al-Rashid',
            relation: 'mother',
            relation_age: 52,
            relation_date_of_birth: Date.new(1970, 1, 1),
            relation_ethicity: ['arab'],
            relation_nationality: ['iraq']
          }
        ]
      )
    end

    # after :each do
    #   clean_data(Child)
    # end

    let(:match_criteria) { case1.match_criteria }

    it 'fetches all matching criteria from the case' do
      case_match_criteria = %w[
        name name_nickname age date_of_birth sex ethnicity
      ]
      expect(match_criteria.keys).to include(*case_match_criteria)
    end

    it 'fetches all matching criteria from the family members' do
      expect(match_criteria.keys).to include('relation', 'relation_name', 'relation_nationality')
    end

    it 'joins family values into a single string' do
      expect(match_criteria['relation']).to eq('father mother')
    end

    after do
      clean_data(SearchableIdentifier, Child)
    end
  end

  context 'testing service_implemented field' do
    before do
      clean_data(SearchableIdentifier, Child)
    end

    it 'not_implemented in service_implemented field' do
      data = {
        data: { services_section: [{ service_type: 'Test type' }] }
      }
      child = Child.create(data)

      expect(child.data['services_section'][0]['service_implemented_day_time'].present?).to be_falsey
      expect(child.data['services_section'][0]['service_implemented']).to eq('not_implemented')
    end

    it 'implemented in service_implemented field' do
      primero_module = PrimeroModule.new(name: 'CP')
      primero_module.save(validate: false)
      data = {
        data: {
          module_id: primero_module.unique_id,
          services_section: [{ service_type: 'Test type', service_implemented_day_time: '2020-02-06 22:16:00 UTC' }]
        }
      }
      child = Child.create(data)

      expect(child.data['services_section'][0]['service_implemented_day_time'].present?).to be_truthy
      expect(child.data['services_section'][0]['service_implemented']).to eq('implemented')
    end

    after do
      clean_data(SearchableIdentifier, Child)
    end
  end

  describe 'current care arrangements' do
    before do
      clean_data(SearchableIdentifier, Child)
    end

    context 'when all care arrangements have a start date' do
      let(:case1) do
        Child.create!(
          name: 'Usama Yazan Al-Rashid',
          name_nickname: 'Usman Beg',
          sex: 'male',
          age: 13,
          date_of_birth: Date.new(2006, 10, 19),
          nationality: ['syria'],
          location_current: 'ABC123',
          ethnicity: ['kurd'],
          language: ['arabic'],
          consent_for_tracing: true,
          family_details_section: [
            {
              relation_name: 'Yazan Al-Rashid',
              relation: 'father',
              relation_age: 51,
              relation_date_of_birth: Date.new(1969, 1, 1),
              relation_ethicity: ['arab'],
              relation_nationality: ['iraq']
            },
            {
              relation_name: 'Hadeel Al-Rashid',
              relation: 'mother',
              relation_age: 52,
              relation_date_of_birth: Date.new(1970, 1, 1),
              relation_ethicity: ['arab'],
              relation_nationality: ['iraq']
            }
          ],
          care_arrangements_section: [
            {
              care_arrangements_type: 'parent_s',
              name_caregiver: 'Caregiver One',
              relationship_caregiver: 'mother',
              care_arrangement_started_date: Date.new(2020, 12, 1)
            },
            {
              care_arrangements_type: 'adult_sibling',
              name_caregiver: 'Caregiver Two',
              relationship_caregiver: 'sister',
              care_arrangement_started_date: Date.new(2021, 1, 1)
            },
            {
              care_arrangements_type: 'customary_caregiver_s',
              name_caregiver: 'Caregiver Three',
              relationship_caregiver: 'other_family',
              care_arrangement_started_date: Date.new(2019, 12, 1)
            }
          ]
        )
      end

      # after :each do
      #   clean_data(Child)
      # end

      let(:most_recent_care_arrangement) { case1.most_recent_care_arrangement }

      it 'returns most recent care arrangement' do
        expect(most_recent_care_arrangement['care_arrangements_type']).to eq('adult_sibling')
        expect(most_recent_care_arrangement['name_caregiver']).to eq('Caregiver Two')
        expect(most_recent_care_arrangement['relationship_caregiver']).to eq('sister')
        expect(most_recent_care_arrangement['care_arrangement_started_date']).to eq(Date.parse('2021-01-01'))
      end

      describe('.current_care_arrangements_type') do
        it 'returns current care arrangements type' do
          expect(case1.current_care_arrangements_type).to eq('adult_sibling')
        end
      end

      describe('.current_name_caregiver') do
        it 'returns current caregiver name' do
          expect(case1.current_name_caregiver).to eq('Caregiver Two')
        end
      end

      describe('.current_care_arrangement_started_date') do
        it 'returns current care arrangement started date' do
          expect(case1.current_care_arrangement_started_date).to eq(Date.parse('2021-01-01'))
        end
      end
    end

    context 'when one care arrangement does not have a start date' do
      let(:case1) do
        Child.create!(
          name: 'Usama Yazan Al-Rashid',
          name_nickname: 'Usman Beg',
          sex: 'male',
          age: 13,
          date_of_birth: Date.new(2006, 10, 19),
          nationality: ['syria'],
          location_current: 'ABC123',
          ethnicity: ['kurd'],
          language: ['arabic'],
          consent_for_tracing: true,
          family_details_section: [
            {
              relation_name: 'Yazan Al-Rashid',
              relation: 'father',
              relation_age: 51,
              relation_date_of_birth: Date.new(1969, 1, 1),
              relation_ethicity: ['arab'],
              relation_nationality: ['iraq']
            },
            {
              relation_name: 'Hadeel Al-Rashid',
              relation: 'mother',
              relation_age: 52,
              relation_date_of_birth: Date.new(1970, 1, 1),
              relation_ethicity: ['arab'],
              relation_nationality: ['iraq']
            }
          ],
          care_arrangements_section: [
            {
              care_arrangements_type: 'parent_s',
              name_caregiver: 'Caregiver One',
              relationship_caregiver: 'mother',
              care_arrangement_started_date: Date.new(2020, 12, 1)
            },
            {
              care_arrangements_type: 'adult_sibling',
              name_caregiver: 'Caregiver Two',
              relationship_caregiver: 'sister'
            },
            {
              care_arrangements_type: 'customary_caregiver_s',
              name_caregiver: 'Caregiver Three',
              relationship_caregiver: 'other_family',
              care_arrangement_started_date: Date.new(2019, 12, 1)
            }
          ]
        )
      end

      after :each do
        clean_data(SearchableIdentifier, Child)
      end

      let(:most_recent_care_arrangement) { case1.most_recent_care_arrangement }

      it 'returns most recent care arrangement' do
        expect(most_recent_care_arrangement['care_arrangements_type']).to eq('parent_s')
        expect(most_recent_care_arrangement['name_caregiver']).to eq('Caregiver One')
        expect(most_recent_care_arrangement['relationship_caregiver']).to eq('mother')
        expect(most_recent_care_arrangement['care_arrangement_started_date']).to eq(Date.parse('2020-12-01'))
      end

      describe('.current_care_arrangements_type') do
        it 'returns current care arrangements type' do
          expect(case1.current_care_arrangements_type).to eq('parent_s')
        end
      end

      describe('.current_name_caregiver') do
        it 'returns current caregiver name' do
          expect(case1.current_name_caregiver).to eq('Caregiver One')
        end
      end

      describe('.current_care_arrangement_started_date') do
        it 'returns current care arrangement started date' do
          expect(case1.current_care_arrangement_started_date).to eq(Date.parse('2020-12-01'))
        end
      end
    end

    context 'when there are no care arrangements' do
      let(:case1) do
        Child.create!(
          name: 'Usama Yazan Al-Rashid',
          name_nickname: 'Usman Beg',
          sex: 'male',
          age: 13,
          date_of_birth: Date.new(2006, 10, 19),
          nationality: ['syria'],
          location_current: 'ABC123',
          ethnicity: ['kurd'],
          language: ['arabic'],
          consent_for_tracing: true,
          family_details_section: [
            {
              relation_name: 'Yazan Al-Rashid',
              relation: 'father',
              relation_age: 51,
              relation_date_of_birth: Date.new(1969, 1, 1),
              relation_ethicity: ['arab'],
              relation_nationality: ['iraq']
            },
            {
              relation_name: 'Hadeel Al-Rashid',
              relation: 'mother',
              relation_age: 52,
              relation_date_of_birth: Date.new(1970, 1, 1),
              relation_ethicity: ['arab'],
              relation_nationality: ['iraq']
            }
          ]
        )
      end

      after :each do
        clean_data(SearchableIdentifier, Child)
      end

      let(:most_recent_care_arrangement) { case1.most_recent_care_arrangement }

      it 'returns most recent care arrangement' do
        expect(most_recent_care_arrangement).to be_nil
      end

      describe('.current_care_arrangements_type') do
        it 'returns current care arrangements type' do
          expect(case1.current_care_arrangements_type).to be_nil
        end
      end

      describe('.current_name_caregiver') do
        it 'returns current caregiver name' do
          expect(case1.current_name_caregiver).to be_nil
        end
      end

      describe('.current_care_arrangement_started_date') do
        it 'returns current care arrangement started date' do
          expect(case1.current_care_arrangement_started_date).to be_nil
        end
      end
    end
    after do
      clean_data(SearchableIdentifier, Child)
    end
  end

  describe 'urgent_protection_concern', search: true do
    it 'finds cases where the value is stored as string true' do
      child = Child.create!(data: { name: 'Lonnie', urgent_protection_concern: 'true' })
      search_result = PhoneticSearchService.search(
        Child,
        filters: [SearchFilters::BooleanValue.new(field_name: 'urgent_protection_concern', value: true)]
      ).records
      expect(search_result).to have(1).child
      expect(search_result.first.id).to eq(child.id)
    end

    it 'finds cases where the value is stored as string false' do
      child = Child.create!(data: { name: 'Lonnie', urgent_protection_concern: 'false' })
      search_result = PhoneticSearchService.search(
        Child,
        filters: [SearchFilters::BooleanValue.new(field_name: 'urgent_protection_concern', value: false)]
      ).records
      expect(search_result).to have(1).child
      expect(search_result.first.id).to eq(child.id)
    end

    context 'when fields store values string or boolean' do
      let!(:record1) { Child.create!(data: { name: 'Foo', urgent_protection_concern: 'true' }) }
      let!(:record2) { Child.create!(data: { name: 'Bar', urgent_protection_concern: true }) }
      let!(:record3) { Child.create!(data: { name: 'Random', age: 2 }) }

      it 'finds cases where the value is stored as string or boolean' do
        search_result = PhoneticSearchService.search(
          Child,
          filters: [SearchFilters::BooleanValue.new(field_name: 'urgent_protection_concern', value: true)]
        ).records

        expect(search_result).to have(2).child
        expect(search_result.map(&:id)).to match_array([record1.id, record2.id])
      end
    end
  end

  describe 'calculate_has_case_plan' do
    before do
      clean_data(SearchableIdentifier, Child)
    end

    let(:child1) do
      Child.create!(
        data: {
          name: 'Child 1',
          age: 4,
          cp_case_plan_subform_case_plan_interventions: [
            { intervention_service_to_be_provided: ['service1'] }
          ]
        }
      )
    end

    let(:child2) do
      Child.create!(
        data: {
          name: 'Child 2',
          age: 2,
          cp_case_plan_subform_case_plan_interventions: [
            { intervention_service_goal: 'some goal' }
          ]
        }
      )
    end

    let(:child3) do
      Child.create!(
        data: {
          name: 'Child 3',
          age: 5
        }
      )
    end

    it 'calculates the has_case_plan field' do
      expect(child1.has_case_plan).to eq(true)
      expect(child2.has_case_plan).to eq(true)
      expect(child3.has_case_plan).to eq(false)
    end

    after do
      clean_data(SearchableIdentifier, Child)
    end
  end

  describe 'family_members' do
    before do
      clean_data(SearchableIdentifier, Child)
    end

    let(:member_unique_id1) { SecureRandom.uuid }

    let(:member_unique_id2) { SecureRandom.uuid }

    let(:family1) do
      Family.create!(
        data: {
          family_number: '001',
          family_members: [
            { unique_id: member_unique_id1, relation_name: 'Member 1', relation_sex: 'male', relation_age: 5 },
            { unique_id: member_unique_id2, relation_name: 'Member 2', relation_sex: 'male', relation_age: 10 }
          ]
        }
      )
    end

    let(:child1) do
      Child.create!(family: family1, data: { name: 'Child 1', age: 4, family_member_id: member_unique_id1 })
    end

    it 'returns the family members of a child linked to a family not including itself' do
      expect(child1.family_members).to eq(
        [
          {
            'unique_id' => member_unique_id2,
            'relation_name' => 'Member 2',
            'relation_sex' => 'male',
            'relation_age' => 10
          }
        ]
      )
    end

    after do
      clean_data(SearchableIdentifier, Child)
    end
  end

  describe 'phonetic tokens' do
    before do
      clean_data(SearchableIdentifier, Child)
    end

    it 'generates the phonetic tokens' do
      child = Child.create!(data: { name: 'George', name_nickname: 'Wolf', name_other: 'Joe' })
      expect(child.tokens).to eq(%w[JRJ ALF J])
    end
  end

  describe 'reunification_dates' do
    before do
      clean_data(SearchableIdentifier, Child)
    end

    it 'stores the reunification_dates' do
      child = Child.create!(
        data: {
          age: 2, sex: 'male', name: 'Random Name', reunification_details_section: [
            { 'unique_id' => '4b7c1011-a63e-422c-b6fb-a64cdcc2d472', 'date_reunification' => '2021-12-08' },
            { 'unique_id' => 'f732a61c-cdae-435c-9c0c-55a893321fed', 'date_reunification' => '2022-02-12' }
          ]
        }
      )

      expect(child.reunification_dates).to eq([Date.new(2021, 12, 8), Date.new(2022, 2, 12)])
    end
  end

  describe 'tracing_dates' do
    before do
      clean_data(SearchableIdentifier, Child)
    end

    it 'stores the tracing_dates' do
      child = Child.create!(
        data: {
          age: 2, sex: 'male', name: 'Random Name', tracing_actions_section: [
            { 'unique_id' => '4b7c1011-a63e-422c-b6fb-a64cdcc2d472', 'date_tracing' => '2022-05-09' },
            { 'unique_id' => 'f732a61c-cdae-435c-9c0c-55a893321fed', 'date_tracing' => '2023-07-08' }
          ]
        }
      )

      expect(child.tracing_dates).to eq([Date.new(2022, 5, 9), Date.new(2023, 7, 8)])
    end
  end

  describe 'calculate_assessment_due_dates' do
    let(:primero_module_test) do
      primero_module_test = PrimeroModule.new(
        unique_id: 'test_module',
        name: 'Test Module',
        description: 'Test Module',
        associated_record_types: %w[case],
        module_options: {
          use_workflow_assessment: true
        }
      )
      primero_module_test.save(validate: false)
      primero_module_test
    end

    before do
      clean_data(PrimeroModule, Child)
    end

    it 'calculates the assessment_due_dates' do
      child = Child.create!(
        data: {
          assessment_due_date: '2021-10-18',
          module_id: primero_module_test.unique_id
        }
      )

      expect(child.assessment_due_dates).to match_array([Date.new(2021, 10, 18)])
    end
  end

  describe 'calculate_case_plan_due_dates' do
    before do
      clean_data(PrimeroModule, Child)
    end

    it 'calculates the case_plan_due_dates' do
      child = Child.create!(data: { case_plan_due_date: '2021-10-18' })

      expect(child.case_plan_due_dates).to match_array([Date.new(2021, 10, 18)])
    end
  end

  describe 'calculate_followup_due_dates' do
    before do
      clean_data(Child)
    end

    it 'calculates the followup_due_dates without duplicates' do
      child = Child.create!(
        data: {
          followup_subform_section: [
            { followup_needed_by_date: '2021-10-18' },
            { followup_needed_by_date: '2021-10-18' },
            { followup_needed_by_date: '2021-10-20' }
          ]
        }
      )

      expect(child.followup_due_dates.size).to eq(2)
      expect(child.followup_due_dates).to match_array([Date.new(2021, 10, 18), Date.new(2021, 10, 20)])
    end
  end

  after do
    clean_data(SearchableIdentifier, Incident, Child, Field, FormSection, PrimeroModule)
  end

  private

  def create_child(name, options = {})
    # TODO: - i18n
    options.merge!(
      'name' => name, 'last_known_location' => 'new york', 'created_by' => 'me', 'created_organization' => 'stc'
    )
    Child.create(data: options)
  end

  def child_with_created_by(created_by, options = {})
    agency = Agency.last
    user = User.new(user_name: created_by, agency_id: agency.id)
    Child.new_with_user user, options
  end
end
