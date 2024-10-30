# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

require 'rails_helper'

describe PhoneticSearchService, search: true do
  describe 'Filter search' do
    describe 'search with text filters' do
      let(:record1) { Child.create!(data: { name: 'Record 1', sex: 'female' }) }
      let(:record2) { Child.create!(data: { name: 'Record 2', sex: 'male' }) }
      let(:record3) { Child.create!(data: { name: 'Record 3' }) }
      let(:record4) { Child.create!(data: { name: 'Record 3', sex: nil }) }

      before do
        clean_data(SearchableIdentifier, Child)
        record1
        record2
        record3
        record4
      end

      it 'matches the filter' do
        filter = SearchFilters::TextValue.new(field_name: 'sex', value: 'female')
        search = PhoneticSearchService.search(Child, filters: [filter])

        expect(search.total).to eq(1)
        expect(search.records.first.name).to eq(record1.name)
      end

      it 'matches the list filter' do
        filter = SearchFilters::TextList.new(field_name: 'sex', values: %w[male])
        search = PhoneticSearchService.search(Child, filters: [filter])

        expect(search.total).to eq(1)
        expect(search.records.first.name).to eq(record2.name)
      end

      it 'matches the not filter' do
        filter = SearchFilters::TextValue.new(field_name: 'sex', value: 'male', not_filter: true)
        search = PhoneticSearchService.search(Child, filters: [filter])

        expect(search.total).to eq(3)
        expect(search.records.map(&:name)).to match_array([record1.name, record3.name, record4.name])
      end

      it 'matches the not filter for a list' do
        filter = SearchFilters::TextList.new(field_name: 'sex', values: %w[male], not_filter: true)
        search = PhoneticSearchService.search(Child, filters: [filter])

        expect(search.total).to eq(3)
        expect(search.records.map(&:name)).to match_array([record1.name, record3.name, record4.name])
      end
    end

    describe 'searches with boolean filters' do
      let(:record1) { Child.create!(data: { name: 'Record 1', urgent_protection_concern: true }) }
      let(:record2) { Child.create!(data: { name: 'Record 2', urgent_protection_concern: false }) }
      let(:record3) { Child.create!(data: { name: 'Record 3' }) }
      let(:record4) { Child.create!(data: { name: 'Record 4', urgent_protection_concern: nil }) }

      before do
        clean_data(SearchableIdentifier, Child)
        record1
        record2
        record3
        record4
      end

      it 'matches the filter' do
        filter = SearchFilters::BooleanValue.new(field_name: 'urgent_protection_concern', value: true)
        search = PhoneticSearchService.search(Child, filters: [filter])

        expect(search.total).to eq(1)
        expect(search.records.first.name).to eq(record1.name)
      end

      it 'matches the list filter' do
        filter = SearchFilters::BooleanList.new(field_name: 'urgent_protection_concern', values: [false])
        search = PhoneticSearchService.search(Child, filters: [filter])

        expect(search.total).to eq(3)
        expect(search.records.map(&:name)).to match_array([record2.name, record3.name, record4.name])
      end

      it 'matches the not filter for a list of values' do
        filter = SearchFilters::BooleanList.new(
          field_name: 'urgent_protection_concern', values: [true], not_filter: true
        )
        search = PhoneticSearchService.search(Child, filters: [filter])

        expect(search.total).to eq(3)
        expect(search.records.map(&:name)).to match_array([record2.name, record3.name, record4.name])
      end

      it 'matches the not filter for false value' do
        filter = SearchFilters::BooleanValue.new(
          field_name: 'urgent_protection_concern', value: false, not_filter: true
        )
        search = PhoneticSearchService.search(Child, filters: [filter])

        expect(search.total).to eq(1)
        expect(search.records.first.name).to eq(record1.name)
      end

      it 'matches the not filter for true value' do
        filter = SearchFilters::BooleanValue.new(
          field_name: 'urgent_protection_concern', value: true, not_filter: true
        )
        search = PhoneticSearchService.search(Child, filters: [filter])

        expect(search.total).to eq(3)
        expect(search.records.map(&:name)).to match_array([record2.name, record3.name, record4.name])
      end
    end

    describe 'searches with integer filters' do
      let(:record1) { Child.create!(data: { name: 'Record 1', age: 5 }) }
      let(:record2) { Child.create!(data: { name: 'Record 2', age: 2 }) }
      let(:record3) { Child.create!(data: { name: 'Record 3' }) }
      let(:record4) { Child.create!(data: { name: 'Record 4', age: nil }) }

      before do
        clean_data(SearchableIdentifier, Child)
        record1
        record2
        record3
        record4
      end

      it 'matches the filter' do
        filter = SearchFilters::Value.new(field_name: 'age', value: 5)
        search = PhoneticSearchService.search(Child, filters: [filter])

        expect(search.total).to eq(1)
        expect(search.records.first.name).to eq(record1.name)
      end

      it 'matches the list filter' do
        filter = SearchFilters::ValueList.new(field_name: 'age', values: [5, 2])
        search = PhoneticSearchService.search(Child, filters: [filter])

        expect(search.total).to eq(2)
        expect(search.records.map(&:name)).to match_array([record1.name, record2.name])
      end

      it 'matches the numeric range filter' do
        filter = SearchFilters::NumericRange.new(field_name: 'age', from: 0, to: 2)
        search = PhoneticSearchService.search(Child, filters: [filter])

        expect(search.total).to eq(1)
        expect(search.records.first.name).to eq(record2.name)
      end

      it 'matches the numeric range list' do
        filter = SearchFilters::RangeList.new(
          field_name: 'age', values: [{ 'from' => 0, 'to' => 2 }], range_type: SearchFilters::NumericRange
        )
        search = PhoneticSearchService.search(Child, filters: [filter])

        expect(search.total).to eq(1)
        expect(search.records.first.name).to eq(record2.name)
      end

      it 'matches the not filter' do
        filter = SearchFilters::Value.new(field_name: 'age', value: 2, not_filter: true)
        search = PhoneticSearchService.search(Child, filters: [filter])

        expect(search.total).to eq(3)
        expect(search.records.map(&:name)).to match_array([record1.name, record3.name, record4.name])
      end

      it 'matches the not filter for a list' do
        filter = SearchFilters::ValueList.new(field_name: 'age', values: [2], not_filter: true)
        search = PhoneticSearchService.search(Child, filters: [filter])

        expect(search.total).to eq(3)
        expect(search.records.map(&:name)).to match_array([record1.name, record3.name, record4.name])
      end

      it 'matches the not filter for a numeric range' do
        filter = SearchFilters::NumericRange.new(field_name: 'age', from: 0, to: 2, not_filter: true)
        search = PhoneticSearchService.search(Child, filters: [filter])

        expect(search.total).to eq(3)
        expect(search.records.map(&:name)).to match_array([record1.name, record3.name, record4.name])
      end
    end

    describe 'searches with date filters' do
      let(:record1) { Child.create!(data: { name: 'Record 1', date_of_birth: '2020-08-09' }) }
      let(:record2) { Child.create!(data: { name: 'Record 2', date_of_birth: '2022-04-25' }) }
      let(:record3) { Child.create!(data: { name: 'Record 3' }) }
      let(:record4) { Child.create!(data: { name: 'Record 4', date_of_birth: nil }) }

      before do
        clean_data(SearchableIdentifier, Child)
        record1
        record2
        record3
        record4
      end

      it 'matches the filter' do
        filter = SearchFilters::DateValue.new(field_name: 'date_of_birth', value: Date.new(2022, 4, 25))
        search = PhoneticSearchService.search(Child, filters: [filter])

        expect(search.total).to eq(1)
        expect(search.records.first.name).to eq(record2.name)
      end

      it 'matches the date range filter' do
        filter = SearchFilters::DateRange.new(
          field_name: 'date_of_birth', from: Date.new(2020, 8, 1), to: Date.new(2022, 4, 30)
        )
        search = PhoneticSearchService.search(Child, filters: [filter])

        expect(search.total).to eq(2)
        expect(search.records.map(&:name)).to match_array([record1.name, record2.name])
      end

      it 'matches the date range list' do
        filter = SearchFilters::RangeList.new(
          field_name: 'date_of_birth', values: [{ 'from' => Date.new(2020, 8, 1), 'to' => Date.new(2022, 4, 30) }],
          range_type: SearchFilters::DateRange
        )
        search = PhoneticSearchService.search(Child, filters: [filter])

        expect(search.total).to eq(2)
        expect(search.records.map(&:name)).to match_array([record1.name, record2.name])
      end

      it 'matches the filter' do
        filter = SearchFilters::DateValue.new(field_name: 'date_of_birth', value: Date.new(2022, 4, 25))
        search = PhoneticSearchService.search(Child, filters: [filter])

        expect(search.total).to eq(1)
        expect(search.records.first.name).to eq(record2.name)
      end
    end

    describe 'searches with id fields' do
      let(:record1) { Child.create!(data: { name: 'Record 1', sex: 'female' }) }
      let(:record2) { Child.create!(data: { name: 'Record 2', sex: 'male' }) }

      before do
        clean_data(SearchableIdentifier, Child)
        record1
        record2
      end

      it 'searches with id filters' do
        filter = SearchFilters::TextValue.new(field_name: 'case_id', value: record1.case_id)
        search = PhoneticSearchService.search(Child, filters: [filter])

        expect(search.total).to eq(1)
        expect(search.records).to contain_exactly(record1)
      end

      it 'searches a list of id filters' do
        filter = SearchFilters::TextList.new(field_name: 'case_id', values: [record1.case_id, record2.case_id])
        search = PhoneticSearchService.search(Child, filters: [filter])

        expect(search.total).to eq(2)
        expect(search.records).to contain_exactly(record1, record2)
      end
    end
  end

  describe 'Text search' do
    let(:record1) do
      Child.create!(
        id: '2f10eef2-4ad0-11ef-9559-18c04db5c362',
        data: {
          name: 'Augustina Link',
          sex: 'female',
          unique_identifier: '074b2516-4acd-11ef-858e-18c04db5c362',
          national_id_no: 'ER/054/8/56/test-1',
          case_id: '043854d4-4acd-11ef-a0cb-18c04db5c362',
          short_id: '548561'
        }
      )
    end
    let(:record2) do
      Child.create!(
        id: '39531c32-4ad0-11ef-b0ed-18c04db5c362',
        data: {
          name: 'Ahmad MacPherson',
          sex: 'male',
          unique_identifier: '08149eaa-4acd-11ef-b594-18c04db5c362',
          national_id_no: 'ER/054/8/56/test-2',
          case_id: '08db9eec-4acd-11ef-91f0-18c04db5c362',
          short_id: '548562'
        }
      )
    end
    let(:record3) do
      Child.create!(
        id: '4974e866-4ad0-11ef-918a-18c04db5c362',
        data: {
          name: 'Numeric 0001',
          sex: 'male',
          unique_identifier: '67529840-4acd-11ef-9384-18c04db5c362',
          case_id: '67ea4c58-4acd-11ef-a3ee-18c04db5c362',
          short_id: '0001'
        }
      )
    end
    let(:record4) do
      Child.create!(
        id: '4eed3c6c-4ad0-11ef-92b0-18c04db5c362',
        data: {
          name: 'Numeric 1234',
          sex: 'male',
          unique_identifier: '9c33e154-4acd-11ef-997f-18c04db5c362',
          case_id: '9cd59602-4acd-11ef-821c-18c04db5c362',
          short_id: '1234'
        }
      )
    end
    let(:record5) do
      Child.create!(
        id: '5516770c-4ad0-11ef-8c9b-18c04db5c362',
        data: {
          name: 'Numeric 01',
          sex: 'male',
          unique_identifier: 'b5c4b9b8-4acd-11ef-8037-18c04db5c362',
          case_id: 'b6561c14-4acd-11ef-b83f-18c04db5c362',
          short_id: '01'
        }
      )
    end

    before do
      clean_data(SearchableIdentifier, Child)
      record1
      record2
      record3
      record4
      record5
    end

    it 'searches with plain text when is a phonetic query' do
      search = PhoneticSearchService.search(Child, query: 'Augustina', phonetic: 'true')

      expect(search.total).to eq(1)
      expect(search.records.first.name).to eq(record1.name)
    end

    it 'finds the exact identifier with mixed characters' do
      search = PhoneticSearchService.search(Child, query: 'ER/054/8/56/test-1')

      expect(search.total).to eq(1)
      expect(search.records.first.name).to eq(record1.name)
    end

    it 'finds a numeric short_id=0001' do
      search = PhoneticSearchService.search(Child, query: '0001')

      expect(search.total).to eq(1)
      expect(search.records.first.short_id).to eq('0001')
      expect(search.records.first.name).to eq(record3.name)
    end

    it 'finds a numeric short_id=01' do
      search = PhoneticSearchService.search(Child, query: '01')

      expect(search.total).to eq(2)
      expect(search.records.first.short_id).to eq('01')
      expect(search.records.first.name).to eq(record5.name)
    end

    it 'finds a numeric short_id using a few zeros in the query' do
      search = PhoneticSearchService.search(Child, query: '00')

      expect(search.total).to eq(1)
      expect(search.records.first.short_id).to eq('0001')
      expect(search.records.first.name).to eq(record3.name)
    end

    it 'finds a numeric short_id with different numbers' do
      search = PhoneticSearchService.search(Child, query: '1234')

      expect(search.total).to eq(1)
      expect(search.records.first.short_id).to eq('1234')
      expect(search.records.first.name).to eq(record4.name)
    end

    it 'finds a numeric short_id with leading/trailing whitespaces' do
      search = PhoneticSearchService.search(Child, query: '   1234   ')

      expect(search.total).to eq(1)
      expect(search.records.first.short_id).to eq('1234')
      expect(search.records.first.name).to eq(record4.name)
    end
  end

  describe 'Sorting search' do
    let(:record1) { Child.create!(data: { name: 'Augustina Link', national_id_no: '001', sex: 'female' }) }
    let(:record2) { Child.create!(data: { name: 'Augustina MacPherson', national_id_no: '011', sex: 'male' }) }
    let(:record3) { Child.create!(data: { name: 'Augustina Applebee', national_id_no: '100', sex: 'male' }) }

    before do
      clean_data(SearchableIdentifier, Child)
      record1
      record2
      record3
    end

    it 'sorts a phonetic search by similarity' do
      search = PhoneticSearchService.search(Child, query: 'Augustina Link', phonetic: 'true')
      expect(search.records.map(&:name)).to eq([record1, record3, record2].map(&:name))
    end
  end

  describe 'Authorization' do
    let(:user_group1) { UserGroup.new(id: 1, unique_id: 'user_group_1') }
    let(:user_group2) { UserGroup.new(id: 2, unique_id: 'user_group_2') }
    let(:agency) do
      agency = Agency.new(id: 1, unique_id: 'agency_1', agency_code: 'agency_1')
      agency.save(validate: false)
      agency
    end
    let(:user1) do
      user1 = User.new(user_name: 'test1', agency:, user_groups: [user_group1])
      user1.save(validate: false)
      user1
    end
    let(:user2) do
      user2 = User.new(user_name: 'test2', user_groups: [user_group2])
      user2.save(validate: false)
      user2
    end
    let(:user3) do
      user3 = User.new(user_name: 'test3', agency:, user_groups: [user_group2])
      user3.save(validate: false)
      user3
    end
    let(:record1) { Child.create!(data: { name: 'Record 1', owned_by: user1.user_name }) }
    let(:record2) { Child.create!(data: { name: 'Record 2', owned_by: user2.user_name }) }
    let(:record3) do
      Child.create!(data: { name: 'Case3', owned_by: user2.user_name, assigned_user_names: [user3.user_name] })
    end

    before do
      clean_data(User, UserGroup, Agency, SearchableIdentifier, Child)
      user1
      user2
      user3
      record1
      record2
      record3
    end

    it 'limits access for currently associated users if user scope is provided' do
      search = PhoneticSearchService.search(Child, scope: { user: { 'user' => user1.user_name } })

      expect(search.total).to eq(1)
      expect(search.records.first.name).to eq(record1.name)
    end

    it 'limits access by user group if group scope is provided' do
      search = PhoneticSearchService.search(
        Child, scope: { user: { 'group' => [user_group1.unique_id, user_group2.unique_id] } }
      )

      expect(search.total).to eq(3)
      expect(search.records.map(&:name)).to include(record2.name, record3.name)
    end

    it 'limits access by agency if agency scope is provided' do
      search = PhoneticSearchService.search(Child, scope: { user: { 'agency' => agency.unique_id } })
      expect(search.total).to eq(2)
      expect(search.records.map(&:name)).to include(record1.name, record3.name)
    end

    it "doesn't limit access if no user scope is provided" do
      search = PhoneticSearchService.search(Child)

      expect(search.total).to eq(3)
      expect(search.records.map(&:name)).to include(record1.name, record2.name, record3.name)
    end
  end

  describe 'Filter search locations' do
    let(:record1) { Child.create!(data: { name: 'Record 1', location_current: 'MC01' }) }
    let(:record2) { Child.create!(data: { name: 'Record 2', location_current: 'TW01' }) }
    let(:record3) { Child.create!(data: { name: 'Record 3', location_current: 'TW02' }) }
    let(:record4) { Child.create!(data: { name: 'Record 4', location_current: 'PR02' }) }
    let(:record5) { Child.create!(data: { name: 'Record 5', location_current: 'TW03' }) }
    let(:record6) { Child.create!(data: { name: 'Record 6', location_current: '1234' }) }
    let(:country) { create(:location, placename_all: 'MyCountry', type: 'country', location_code: 'MC01') }
    let(:province1) do
      create(:location, hierarchy_path: "#{country.location_code}.PR01", type: 'state', location_code: 'PR01')
    end
    let(:province2) do
      create(:location, hierarchy_path: "#{country.location_code}.PR02", type: 'province', location_code: 'PR02')
    end
    let(:town1) do
      create(
        :location,
        hierarchy_path: "#{country.location_code}.#{province1.location_code}.TW01",
        type: 'city',
        location_code: 'TW01'
      )
    end
    let(:town2) do
      create(
        :location,
        hierarchy_path: "#{country.location_code}.#{province1.location_code}.TW02",
        type: 'city',
        disabled: false,
        location_code: 'TW02'
      )
    end
    let(:town3) do
      create(
        :location,
        hierarchy_path: "#{country.location_code}.#{province2.location_code}.TW03",
        type: 'city',
        disabled: false,
        location_code: 'TW03'
      )
    end
    let(:town4) do
      create(
        :location,
        hierarchy_path: "#{country.location_code}.#{province2.location_code}.1234",
        type: 'city',
        disabled: false,
        location_code: '1234'
      )
    end

    before do
      clean_data(Location, FormSection, Field, User, UserGroup, Agency, SearchableIdentifier, Child)

      create(
        :form_section,
        unique_id: 'form_section_1',
        fields: [
          create(:field, name: 'location_current', type: Field::SELECT_BOX, option_strings_source: 'Location')
        ]
      )
      country
      province1
      province2
      town1
      town2
      town3
      town4
      record1
      record2
      record3
      record4
      record5
      record6
    end

    it 'searches with location filter' do
      filter = SearchFilters::LocationValue.new(field_name: 'loc:location_current', value: 'PR02')
      search = PhoneticSearchService.search(Child, filters: [filter])

      expect(search.total).to eq(3)
      expect(search.records).to contain_exactly(record4, record5, record6)
    end

    it 'searches with location list filters' do
      filter = SearchFilters::LocationList.new(field_name: 'loc:location_current', values: %w[PR01 TW03])
      search = PhoneticSearchService.search(Child, filters: [filter])

      expect(search.total).to eq(3)
      expect(search.records).to contain_exactly(record2, record3, record5)
    end
  end

  describe 'Module scope' do
    let(:record1) { Child.create!(data: { name: 'Record 1', module_id: 'primeromodule-cp' }) }
    let(:record2) { Child.create!(data: { name: 'Record 2', module_id: 'primeromodule-gbv' }) }

    before do
      clean_data(User, UserGroup, Agency, SearchableIdentifier, Child)
      record1
      record2
    end

    it 'limits search results by module' do
      search = PhoneticSearchService.search(Child, scope: { module: ['primeromodule-cp'] })
      expect(search.total).to eq(1)
      expect(search.records.first.name).to eq(record1.name)
    end
  end

  describe 'Filter search' do
    let(:record1) { Child.create!(data: { name: 'Record 1', oscar_number: 'RXJA12819JIKA2893' }) }
    let(:record2) { Child.create!(data: { name: 'Record 2', oscar_number: 'RT128N1281O084' }) }

    before do
      clean_data(User, UserGroup, Agency, Child)
      record1
      record2
    end

    it 'searches with filters' do
      search = PhoneticSearchService.search(Child, query: 'RXJA12819JIKA2893')

      expect(search.total).to eq(1)
      expect(search.records.first.name).to eq(record1.name)
    end
  end

  describe 'Violation Search' do
    let(:record1) do
      Incident.create!(
        data: {
          violation_category: %w[killing attack_on_hospitals],
          created_at: 1.months.ago,
          incident_id: '04274225-8c68-4ce1-b10b-be18b9f88531'
        }
      )
    end
    let(:record2) do
      Incident.create!(
        data: {
          violation_category: %w[maiming],
          created_at: 1.months.ago,
          incident_id: '9448d2fa-5d81-4c0b-9522-bb2617adaa52'
        }
      )
    end
    let(:record3) do
      Incident.create!(
        data: {
          violation_category: %w[recruitment],
          created_at: DateTime.current,
          incident_id: '7d93d75e-588b-449f-b94e-a28d301c6594'
        }
      )
    end
    before do
      clean_data(SearchableIdentifier, Incident)
      record1
      record2
      record3
    end

    it 'search with filters' do
      filter = SearchFilters::TextList.new(field_name: 'violation_category', values: %w[killing maiming])
      search = PhoneticSearchService.search(Incident, filters: [filter], sort: { 'created_at' => 'desc' })

      expect(search.total).to eq(2)
      expect(search.records.map(&:incident_id)).to match_array(
        [record1.incident_id, record2.incident_id]
      )
    end
  end
end
