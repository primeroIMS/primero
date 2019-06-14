require 'rails_helper'
describe ReportingLocation do
  before :all do
    Lookup.destroy_all
    lookup1 = create :lookup, :id => "lookup-location-type", :lookup_values => [
      {:id => "district", :display_text => "district"},
      {:id => "country", :display_text => "country"}
    ]
  end

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
          expect(@reporting_location.is_valid_admin_level?).to be_truthy
        end
      end

      context 'and an invalid admin_level' do
        before :each do
          @reporting_location.admin_level = 6
        end

        it 'is not valid' do
          expect(@reporting_location.is_valid_admin_level?).to be_falsey
        end
      end
    end
  end
end
