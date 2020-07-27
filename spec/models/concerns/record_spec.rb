# frozen_string_literal: true

require 'rails_helper'

describe Record do
  describe 'update_properties' do
    it 'updates last_updated_by with the given user even if provided in the attributes' do
      c = Child.create!(name: 'Bob')
      c.update_properties({ last_updated_by: 'test', name: 'Rob' }, 'primero')
      expect(c.last_updated_by).to eq('primero')
    end
  end
end
