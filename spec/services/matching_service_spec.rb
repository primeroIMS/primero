# frozen_string_literal: true

require 'rails_helper'

describe MatchingService, search: true do
  before(:each) { clean_data(Child) }

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
      consent_for_tracing: false,
      family_details_section: [
        {
          relation_name: 'Yazan Al-Rashid',
          relation: 'father',
          relation_age: 51,
          relation_date_of_birth: Date.new(1969, 1, 1),
          relation_ethicity: ['arab'],
          relation_nationality: ['iraq']
        }
      ]
    )
  end

  describe '.find_match_records' do
    before(:each) { case1 && Sunspot.commit }

    it 'runs a Solr query based on given criteria' do
      result = MatchingService.new.find_match_records({ name: 'Usama', age: 13 }, Child, false)
      expect(result.size).to eq(1)
      expect(result[case1.id]).to be
    end

    it 'will not find results for case that have not provided consent' do
      result = MatchingService.new.find_match_records({ name: 'Usama', age: 13 }, Child)
      expect(result.size).to eq(0)
    end
  end

  after(:each) { clean_data(Child) }
end
