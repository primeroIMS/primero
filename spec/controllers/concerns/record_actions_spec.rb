require 'spec_helper'

class RecordController < ActionController::Base
  include RecordActions
  def model_class
    Child
  end
end

describe RecordActions do
  describe '#filter_params' do
    subject { RecordController.new }

    it 'filters params that are not in the form sections for this model' do
      fss = {
        "Basic Identity" => [FormSection.new(name: 'Basic Identity')]
      }
      subject.should_receive(:current_user)
      mock_record = double(:permitted_property_names => ['name', 'age'])
      subject.should_receive(:record_params).and_return(ActionController::Parameters.new({
        :age => 5,
        :name => 'Johnny',
        :other_field => 'bad data',
      }))

      subject.filter_params(mock_record).keys.sort.should == ["age", "name"]
    end
  end
end
