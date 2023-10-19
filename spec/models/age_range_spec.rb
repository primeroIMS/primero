# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.
# frozen_string_literal: true

require 'rails_helper'

describe AgeRange do
  it 'should create a valid range from string' do
    range = AgeRange.new(0, 5)
    AgeRange.from_string('0 - 5').should
    AgeRange.from_string('0..5').should == range
  end

  it 'should create a valid range from string for MAX value' do
    range = AgeRange.new(5, AgeRange::MAX)
    AgeRange.from_string('5+').should == range
  end
end
