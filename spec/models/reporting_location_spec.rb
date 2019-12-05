require 'rails_helper'
describe ReportingLocation do
  before :all do
    lookup1 = create :lookup, :id => "lookup-location-type", :lookup_values => [
      {:id => "district", :display_text => "district"}, 
      {:id => "country", :display_text => "country"}
    ]
  end

  before do
    @reporting_location = ReportingLocation.new(field_key: 'test', label_key: 'district')
  end

  describe 'Validation' do
    context 'with a valid admin_level' do
      before :each do
        @reporting_location.admin_level = 2
      end

      it 'is valid' do
        expect(@reporting_location).to be_valid
      end
    end

    context 'with an invalid admin_level' do
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

  describe '#is_primary?' do
    context 'when type is not set' do
      it 'defaults to true' do
        expect(@reporting_location.is_primary?).to be_truthy
      end
    end

    context 'when type is PRIMARY' do
      before do
        @reporting_location.type = ReportingLocation::PRIMARY_REPORTING_LOCATION
      end

      it 'returns true' do
        expect(@reporting_location.is_primary?).to be_truthy
      end
    end

    context 'when type is SECONDARY' do
      before do
        @reporting_location.type = ReportingLocation::SECONDARY_REPORTING_LOCATION
      end

      it 'returns false' do
        expect(@reporting_location.is_primary?).to be_falsey
      end
    end
  end
end