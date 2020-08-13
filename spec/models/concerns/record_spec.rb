# frozen_string_literal: true

require 'rails_helper'

describe Record do
  describe 'update_properties' do
    it 'updates last_updated_by with the given user even if provided in the attributes' do
      c = Child.create!(name: 'Bob')
      c.update_properties(fake_user, last_updated_by: 'test', name: 'Rob' )
      expect(c.last_updated_by).to eq(fake_user_name)
    end
  end
end
