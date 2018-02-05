require 'rails_helper'
describe ReportingLocation do

  describe 'Validation' do
    context 'with a valid label_key' do
      before :each do
        @reporting_location = ReportingLocation.new(field_key: 'test', label_key: 'district')
      end
      context 'and a valid admin_level' do
        before :each do
          @reporting_location.admin_level = 2
        end

        it 'is valid' do
          expect(@reporting_location).to be_valid
        end
      end

      context 'and an invalid admin_level' do
        before :each do
          @reporting_location.admin_level = 6
        end

        it 'is not valid' do
          expect(@reporting_location).not_to be_valid
        end

        it 'returns an error message' do
          @reporting_location.valid?
          expect(@reporting_location.errors.messages[:admin_level]).to eq(['Admin Level must be one of Location Admin Level values'])
        end
      end
    end

    context 'with an invalid label_key' do
      before :each do
        @reporting_location = ReportingLocation.new(field_key: 'test', label_key: 'test_bad_key')
      end
      context 'and a valid admin_level' do
        before :each do
          @reporting_location.admin_level = 2
        end

        it 'is not valid' do
          expect(@reporting_location).not_to be_valid
        end

        it 'returns an error message' do
          @reporting_location.valid?
          expect(@reporting_location.errors.messages[:label_key]).to eq(['Label Key must be one of Location Base Type values'])
        end
      end

      context 'and an invalid admin_level' do
        before :each do
          @reporting_location.admin_level = 6
        end

        it 'is not valid' do
          expect(@reporting_location).not_to be_valid
        end

        it 'returns an error message' do
          @reporting_location.valid?
          expect(@reporting_location.errors.messages[:label_key]).to eq(['Label Key must be one of Location Base Type values'])
          expect(@reporting_location.errors.messages[:admin_level]).to eq(['Admin Level must be one of Location Admin Level values'])
        end
      end
    end
  end


end