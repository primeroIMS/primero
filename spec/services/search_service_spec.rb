# frozen_string_literal: true

require 'rails_helper'

describe SearchService, search: true do
  describe 'Filter search' do
    before :example do
      @correct_match = Child.create!(data: { name: 'Correct Match1', sex: 'female' })
      @incorrect_match = Child.create!(data: { name: 'Incorrect Match', sex: 'male' })
      Sunspot.commit
    end

    it 'searches with filters' do
      filter = SearchFilters::Value.new(field_name: 'sex', value: 'female')
      search = SearchService.search(Child, filters: [filter])

      expect(search.total).to eq(1)
      expect(search.results.first.name).to eq(@correct_match.name)
    end

    it 'searches with filters not value' do
      filter = SearchFilters::NotValue.new(field_name: 'sex', values: 'male')
      search = SearchService.search(Child, filters: [filter])

      expect(search.total).to eq(1)
      expect(search.results.first.name).to eq(@correct_match.name)
    end
  end

  describe 'Filter search locations' do
    before :example do
      clean_data(Location, FormSection, Field)

      create(:form_section, unique_id: 'form_section_1', fields: [
               create(:field, name: 'location_current', type: Field::SELECT_BOX, option_strings_source: 'Location')
             ])

      @country = create(
        :location, placename_all: 'MyCountry', type: 'country', location_code: 'MC01'
      )
      @province1 = create(
        :location, hierarchy_path: "#{@country.location_code}.PR01", type: 'state', location_code: 'PR01'
      )
      @province2 = create(
        :location, hierarchy_path: "#{@country.location_code}.PR02", type: 'province', location_code: 'PR02'
      )
      @town1 = create(
        :location, hierarchy_path: "#{@country.location_code}.#{@province1.location_code}.TW01",
                   type: 'city', location_code: 'TW01'
      )
      @town2 = create(
        :location, hierarchy_path: "#{@country.location_code}.#{@province1.location_code}.TW02",
                   type: 'city', disabled: false, location_code: 'TW02'
      )
      @town3 = create(
        :location, hierarchy_path: "#{@country.location_code}.#{@province2.location_code}.TW03",
                   type: 'city', disabled: false, location_code: 'TW03'
      )

      @child_location1 = Child.create!(data: { location_current: 'MC01' })
      @child_location2 = Child.create!(data: { location_current: 'TW01' })
      @child_location3 = Child.create!(data: { location_current: 'TW02' })
      @child_location4 = Child.create!(data: { location_current: 'PR02' })
      @child_location5 = Child.create!(data: { location_current: 'TW03' })

      Sunspot.commit
    end

    it 'searches with location filters' do
      filter = SearchFilters::ValueList.new(field_name: 'location_current', values: %w[PR01 TW03])
      search = SearchService.search(Child, filters: [filter])

      expect(search.total).to eq(3)
      expect(search.results).to contain_exactly(@child_location2, @child_location3, @child_location5)
    end
  end

  describe 'Text search' do
    before :example do
      @correct_match = Child.create!(data: { name: 'Augustina Link', sex: 'female' })
      @incorrect_match = Child.create!(data: { name: 'Ahmad MacPherson', sex: 'male' })
      Sunspot.commit
    end

    it 'searches with plain text' do
      search = SearchService.search(Child, query: 'Augustina')

      expect(search.total).to eq(1)
      expect(search.results.first.name).to eq(@correct_match.name)
    end
  end

  describe 'Sorting search' do
    before :example do
      @child1 = Child.create!(data: { name: 'Augustina Link', sex: 'female' })
      @child2 = Child.create!(data: { name: 'Augustina MacPherson', sex: 'male' })
      @child3 = Child.create!(data: { name: 'Augustina Applebee', sex: 'male' })

      Sunspot.commit
    end

    it 'sorts sortable fields' do
      search = SearchService.search(Child, query: 'Augustina', sort: { name: :asc })
      expect(search.results.map(&:name)).to eq([@child3, @child1, @child2].map(&:name))
    end

    it 'sorts fields' do
      search = SearchService.search(Child, query: 'Augustina', sort: { sex: :desc })
      expect(search.results.map(&:sex)).to eq([@child2, @child3, @child1].map(&:sex))
    end
  end

  describe 'Authorization' do
    before :example do
      @user_group = UserGroup.new(id: 1, unique_id: 'user_group_1')
      @user_group_b = UserGroup.new(id: 2, unique_id: 'user_group_2')
      @agency = Agency.new(id: 1, unique_id: 'agency_1', agency_code: 'agency_1')
      @agency.save(validate: false)
      @user = User.new(user_name: 'test1', agency: @agency, user_groups: [@user_group])
      @user.save(validate: false)
      @user2 = User.new(user_name: 'test2', user_groups: [@user_group_b])
      @user2.save(validate: false)
      @user3 = User.new(user_name: 'test3', agency: @agency, user_groups: [@user_group_b])
      @user3.save(validate: false)

      @case1 = Child.create!(data: { name: 'Case1', owned_by: @user.user_name })
      @case2 = Child.create!(data: { name: 'Case2', owned_by: @user2.user_name })
      @case3 = Child.create!(data: {
                               name: 'Case3', owned_by: @user2.user_name, assigned_user_names: [@user3.user_name]
                             })
      Sunspot.commit
    end

    it 'limits access for currently associated users if user scope is provided' do
      search = SearchService.search(Child, query_scope: { user: { 'user' => @user.user_name } })

      expect(search.total).to eq(1)
      expect(search.results.first.name).to eq(@case1.name)
    end

    it 'limits access by user group if group scope is provided' do
      search = SearchService.search(
        Child,
        query_scope: { user: { Permission::GROUP => [@user_group.unique_id, @user_group_b.unique_id] } }
      )

      expect(search.total).to eq(3)
      expect(search.results.map(&:name)).to include(@case2.name, @case3.name)
    end

    it 'limits access by agency if agency scope is provided' do
      search = SearchService.search(Child, query_scope: { user: { Permission::AGENCY => @agency.unique_id } })
      expect(search.total).to eq(2)
      expect(search.results.map(&:name)).to include(@case1.name, @case3.name)
    end

    it "doesn't limit access if no user scope is provided" do
      search = SearchService.search(Child)

      expect(search.total).to eq(3)
      expect(search.results.map(&:name)).to include(@case1.name, @case2.name, @case3.name)
    end
  end

  describe 'Module scope' do
    before :each do
      @case1 = Child.create!(data: { name: 'Case1', module_id: 'primeromodule-cp' })
      @case2 = Child.create!(data: { name: 'Case2', module_id: 'primeromodule-gbv' })
      Sunspot.commit
    end

    it 'limits search results by module' do
      search = SearchService.search(Child, query_scope: { module: ['primeromodule-cp'] })
      expect(search.total).to eq(1)
      expect(search.results[0].name).to eq(@case1.name)
    end
  end

  after :example do
    clean_data(Agency, UserGroup, User, Child)
  end
end
