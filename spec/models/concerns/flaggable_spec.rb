# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

require 'rails_helper'

describe Flaggable do
  before do
    clean_data(Flag, Child)
  end

  context 'when is a new record' do
    it 'marks the record as flagged' do
      child = Child.new
      child.add_flag!('Flag Message', Date.today, 'testuser')

      expect(child.flagged).to eq(true)
    end
  end

  context 'when is an existing record' do
    it 'marks the record as flagged' do
      child = Child.create!
      child.add_flag!('Flag Message', Date.today, 'testuser')

      expect(child.flagged).to eq(true)
    end
  end
end
