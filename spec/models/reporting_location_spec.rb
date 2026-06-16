# frozen_string_literal: true

require 'rails_helper'
describe ReportingLocation do
  describe 'Validation' do
    context 'with a valid label_key' do
      before :each do
        @reporting_location = ReportingLocation.new(field_key: 'test', admin_level: 2,
                                                    admin_level_map: { 1 => ['province'], 2 => ['district'] })
      end
      context 'and a valid admin_level' do
        before :each do
          @reporting_location.admin_level = 2
        end

        it 'is valid' do
          expect(@reporting_location.valid_admin_level?).to be_truthy
        end
      end

      context 'and an invalid admin_level' do
        before :each do
          @reporting_location.admin_level = 6
        end

        it 'is not valid' do
          expect(@reporting_location.valid_admin_level?).to be_falsey
        end
      end
    end
  end

  describe '.reporting_location_levels' do
    # TODO
  end
end
