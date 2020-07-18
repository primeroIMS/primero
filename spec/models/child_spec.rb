# frozen_string_literal: true

require 'rails_helper'
require 'sunspot'

describe Child do
  describe 'quicksearch', search: true do
    it 'has a searchable case id, survivor number' do
      expect(Child.quicksearch_fields).to include('case_id_display', 'survivor_code_no')
    end

    it 'can find a child by survivor code' do
      child = Child.create!(data: { name: 'Lonnie', survivor_code_no: 'ABC123XYZ' })
      child.index!
      search_result = SearchService.search(Child, [], {}, 'ABC123XYZ').results
      expect(search_result).to have(1).child
      expect(search_result.first.survivor_code_no).to eq('ABC123XYZ')
    end
  end

  describe 'update_properties' do
    it 'should replace old properties with updated ones' do
      child = Child.new(data: { 'name' => 'Dave', 'age' => 28, 'last_known_location' => 'London' })
      new_properties = { 'name' => 'Dave', 'age' => 35 }
      child.update_properties(new_properties, 'some_user')
      expect(child.age).to eq(35)
      expect(child.name).to eq('Dave')
      expect(child.data['last_known_location']).to eq('London')
    end

    it 'should not replace old properties when when missing from update' do
      child = Child.new(data: { 'origin' => 'Croydon', 'last_known_location' => 'London' })
      new_properties = { 'last_known_location' => 'Manchester' }
      child.update_properties(new_properties, 'some_user')
      expect(child.data['last_known_location']).to eq('Manchester')
      expect(child.data['origin']).to eq('Croydon')
    end

    it 'should populate last_updated_by field with the user_name who is updating' do
      child = Child.new
      child.update_properties({}, 'jdoe')
      expect(child.last_updated_by).to eq('jdoe')
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
      Agency.destroy_all
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
      Agency.destroy_all
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
      child = Child.new_with_user(
        double('user', user_name: 'user', organization: 'org', full_name: 'UserN'),
        'some_field' => 'some_value'
      )
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
      User.stub(:find_by_user_name).with('mj').and_return(double(organization: 'UNICEF'))
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
      FormSection.create_or_update_form_section(
        :unique_id => 'form_section_with_dates_fields',
        'visible' => true,
        :order => 1,
        'editable' => true,
        :fields => fields,
        :parent_form => 'case',
        'name_all' => 'Form Section With Dates Fields',
        'description_all' => 'Form Section With Dates Fields',
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
    before :all do
      clean_data(Agency, User, Child, PrimeroProgram, UserGroup, PrimeroModule, FormSection)

      @owner = create :user
      @previous_owner = create :user
      @referral = create :user

      @case = build :child, owned_by: @owner.user_name, previously_owned_by: @previous_owner.user_name,
                            assigned_user_names: [@referral.user_name]
    end

    it 'can fetch the record owner' do
      expect(@case.owner).to eq(@owner)
    end
  end

  describe 'case id code' do
    before :each do
      clean_data(User, Location, Role, Agency, PrimeroModule, PrimeroProgram, UserGroup, SystemSettings)

      @permission_case ||= Permission.new(
        resource: Permission::CASE,
        actions: [Permission::READ, Permission::WRITE, Permission::CREATE]
      )
      @location_country = Location.create!(placename: 'Guinea', type: 'country', location_code: 'GUI', admin_level: 0)
      @location_region = Location.create!(
        placename: 'Kindia', type: 'region',
        location_code: 'GUI123', hierarchy: ['GUI'],
        admin_level: 1
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
  end

  describe 'syncing of protection concerns' do
    before do
      Child.destroy_all
      User.stub(:find_by_user_name).and_return(double(organization: 'UNICEF'))
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
  end

  describe 'calculate age', search: true do
    before do
      clean_data(Child)
      @case1 = Child.create(data: { name: 'case1', date_of_birth: Date.new(2010, 10, 11) })
      @case2 = Child.create(data: { name: 'case2', date_of_birth: Date.new(2008, 10, 11) })
      @case3 = Child.create(data: { name: 'case3', date_of_birth: Date.new(2008, 3, 13) })
      @case4 = Child.create(data: { name: 'case4', date_of_birth: Date.new(1998, 11, 11) })
      @case5 = Child.create(data: { name: 'case5', date_of_birth: Date.new(2014, 10, 12) })
      @case6 = Child.create(data: { name: 'case6', date_of_birth: Date.new(2012, 2, 29) }) # leap year
      @case7 = Child.create(data: { name: 'case7', date_of_birth: Date.new(2012, 2, 14) }) # leap year
      @case8 = Child.create(data: { name: 'case8', date_of_birth: Date.new(2012, 10, 11) }) # leap year
      @case9 = Child.create(data: { name: 'case9', date_of_birth: Date.new(2015, 3, 1) })
      @case10 = Child.create(data: { name: 'case10', date_of_birth: Date.new(2014, 10, 10) })
      @case11 = Child.create(data: { name: 'case11', date_of_birth: Date.new(2010, 2, 28) }) # leap year
      Sunspot.commit
    end

    context 'when current date is non-leap year 2015' do
      before :each do
        Date.stub(:current).and_return(Date.new(2015, 10, 11))
        Date.stub(:yesterday).and_return(Date.new(2015, 10, 10))
      end

      it 'should find cases with birthdays today' do
        expect(Child.by_date_of_birth_range(Date.current, Date.current)).to include(@case1, @case2, @case8)
      end

      it 'should not find cases with birthdays not today' do
        expect(Child.by_date_of_birth_range(Date.current, Date.current)).not_to include(
          @case3, @case4, @case5, @case6, @case7
        )
      end

      it 'should find cases within a date range' do
        expect(Child.by_date_of_birth_range(Date.yesterday, Date.current)).to include(@case1, @case2, @case8, @case10)
      end

      it 'should not find cases that fall outside the given date range' do
        expect(Child.by_date_of_birth_range(Date.yesterday, Date.current)).not_to include(
          @case3, @case4, @case5, @case6, @case7
        )
      end

      it 'should calculate age with birthday tomorrow' do
        expect(@case5.calculated_age).to eq(0)
      end

      it 'should calculate age with birthday on leap day' do
        expect(@case6.calculated_age).to eq(3)
      end

      it 'should calculate age with birthday not on leap day' do
        expect(@case1.calculated_age).to eq(5)
      end
    end

    context 'when current date is March 1 on non-leap year' do
      before :each do
        Date.stub(:current).and_return(Date.new(2015, 3, 1))
        Date.stub(:yesterday).and_return(Date.new(2015, 2, 28))
      end

      it 'should find cases with birthdays today' do
        expect(Child.by_date_of_birth_range(Date.current, Date.current)).to include(@case9)
      end

      it 'should not find cases with birthdays not today' do
        expect(Child.by_date_of_birth_range(Date.current, Date.current)).not_to include(
          @case1, @case2, @case3, @case4, @case5, @case7, @case8, @case10, @case11
        )
      end

      it 'should find cases within a date range, including leap day' do
        expect(Child.by_date_of_birth_range(Date.yesterday, Date.current)).to include(@case6, @case9, @case11)
      end

      it 'should not find cases that fall outside the given date range' do
        expect(Child.by_date_of_birth_range(Date.yesterday, Date.current)).not_to include(
          @case1, @case2, @case3, @case4, @case5, @case7, @case8, @case10
        )
      end

      it 'should calculate age with birthday today' do
        expect(@case9.calculated_age).to eq(0)
      end

      it 'should calculate age with birthday on leap day' do
        expect(@case6.calculated_age).to eq(3)
      end

      it 'should calculate age with birthday not on leap day' do
        expect(@case1.calculated_age).to eq(4)
      end
    end

    context 'when current date is leap year 2016' do
      before :each do
        Date.stub(:current).and_return(Date.new(2016, 2, 29))
        Date.stub(:yesterday).and_return(Date.new(2016, 2, 28))
      end

      it 'should find cases with birthdays today' do
        expect(Child.by_date_of_birth_range(Date.current, Date.current)).to include(@case6)
      end

      it 'should not find cases with birthdays not today' do
        expect(Child.by_date_of_birth_range(Date.current, Date.current)).not_to include(
          @case1, @case2, @case3, @case4, @case5, @case7, @case8, @case9
        )
      end

      it 'should find cases within a date range' do
        expect(Child.by_date_of_birth_range(Date.yesterday, Date.current)).to include(@case6, @case11)
      end

      it 'should not find cases that fall outside the given date range' do
        expect(Child.by_date_of_birth_range(Date.yesterday, Date.current)).not_to include(
          @case1, @case2, @case3, @case4, @case5, @case7, @case8, @case9, @case10
        )
      end

      it 'should calculate age with birthday tomorrow' do
        expect(@case9.calculated_age).to eq(0)
      end

      it 'should calculate age with birthday on leap day' do
        expect(@case6.calculated_age).to eq(4)
      end

      it 'should calculate age with birthday not on leap day' do
        expect(@case1.calculated_age).to eq(5)
      end
    end
  end

  describe '.match_criteria' do
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
      clean_data(Child)
    end

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
  end

  xdescribe 'incident from case' do
    it 'should copy field values from case to incident even with value of false' do
      child = _Child.new(
        'name' => 'existing name',
        'incident_details' => [{ 'unique_id' => 'incident_123', 'cp_incident_previous_incidents' => 'false' }]
      )
      incident = Incident.new.tap do |inc|
        inc.copy_case_information(
          child,
          [
            {
              'source' => %w[incident_details cp_incident_previous_incidents],
              'target' => 'cp_incident_previous_incidents'
            }
          ],
          'incident_123'
        )
      end
      incident['cp_incident_previous_incidents'].should == 'false'
    end

    it 'should create incident from case even with no case to incident mapping' do
      child = _Child.new('name' => 'existing name', 'incident_details' => [{ 'unique_id' => 'incident_123', 'cp_incident_previous_incidents' => 'false' }])
      incident = Incident.new.tap do |inc|
        inc.copy_case_information(child, nil, 'incident_123')
      end
      incident['age'].should == nil
    end
  end

  context 'testing service_implemented field' do
    it 'not_implemented in service_implemented field' do
      data = {
        data: { services_section: [{ service_type: 'Test type' }] }
      }
      child = Child.create(data)

      expect(child.data['services_section'][0]['service_implemented_day_time'].present?).to be_falsey
      expect(child.data['services_section'][0]['service_implemented']).to eq('not_implemented')
    end

    it 'implemented in service_implemented field' do
      data = {
        data: {
          services_section: [{ service_type: 'Test type', service_implemented_day_time: '2020-02-06 22:16:00 UTC' }]
        }
      }
      child = Child.create(data)

      expect(child.data['services_section'][0]['service_implemented_day_time'].present?).to be_truthy
      expect(child.data['services_section'][0]['service_implemented']).to eq('implemented')
    end
  end

  after :all do
    Child.destroy_all
    Field.destroy_all
    FormSection.destroy_all
  end

  private

  def create_child(name, options = {})
    # TODO: - i18n
    options.merge!(
      'name' => name, 'last_known_location' => 'new york', 'created_by' => 'me', 'created_organization' => 'stc'
    )
    Child.create(data: options)
  end

  def create_duplicate(parent)
    duplicate = Child.create(name: 'dupe')
    duplicate.mark_as_duplicate(parent['short_id'])
    duplicate.save!
    duplicate
  end

  def child_with_created_by(created_by, options = {})
    agency = Agency.last
    user = User.new(user_name: created_by, agency_id: agency.id)
    Child.new_with_user user, options
  end
end
