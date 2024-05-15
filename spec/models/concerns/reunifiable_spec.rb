# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

require 'rails_helper'

describe Reunifiable do
  before :each do
    clean_data(Child)
  end

  describe 'reunification_dates' do
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
end
