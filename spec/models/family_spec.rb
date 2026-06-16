# frozen_string_literal: true

require 'rails_helper'

describe Family do
  before do
    clean_data(Child, Family)
  end

  describe 'parent_form' do
    it 'returns family' do
      expect(Family.parent_form).to eq('family')
    end
  end

  describe 'quicksearch', search: true do
    it 'can find a Family by Family Number' do
      Family.create!(data: { family_name: 'Family One', family_number: 'ABC123XYZ' })
      search_result = PhoneticSearchService.search(Family, query: 'ABC123XYZ').records
      expect(search_result).to have(1).family
      expect(search_result.first.family_number).to eq('ABC123XYZ')
    end
  end

  describe 'phonetic tokens' do
    before do
      clean_data(Family)
    end

    it 'generates the phonetic tokens' do
      family = Family.create!(data: { family_name: 'Miller' })
      expect(family.tokens).to eq(%w[MLR])
    end
  end

  describe 'recalculate_assigned_user_names' do
    before do
      clean_data(User, Child, Family)
    end

    it 'recalculates the assigned user names' do
      family = Family.create!(
        data: { family_name: 'Miller' },
        cases: [
          Child.new(data: { owned_by: 'user1' }),
          Child.new(data: { owned_by: 'user2' })
        ]
      )
      expect(family.assigned_user_names).to eq(%w[user1 user2])
    end

    it 'does not duplicate the assigned user names' do
      family = Family.create!(
        data: { family_name: 'Miller' },
        cases: [
          Child.new(data: { owned_by: 'user1' }),
          Child.new(data: { owned_by: 'user1' })
        ]
      )
      expect(family.assigned_user_names).to eq(%w[user1])
    end

    it 'recalculates the assigned user names after a case is unlinked' do
      user = User.new(user_name: 'user1')
      user.save(validate: false)

      child1 = Child.new_with_user(user)
      child2 = Child.new_with_user(user)
      family = Family.create!(data: { family_name: 'Miller' }, cases: [child1, child2])

      child1.family = nil
      child1.save!

      family.reload
      expect(family.assigned_user_names).to eq(%w[user1])
    end
  end

  after do
    clean_data(Child, Family)
  end
end
