require 'spec_helper'

class RecordController < ActionController::Base
  include RecordActions
end

describe RecordActions do
  describe '#filter_params' do
    subject { RecordController.new }

    it 'filters params that are not in the form sections for this model' do
      fss = {
        "Basic Identity" => [FormSection.new(name: 'Basic Identity')]
      }
      subject.should_receive(:get_form_sections).and_return(fss)
      subject.should_receive(:get_record).and_return(double())
      subject.should_receive(:model_class).and_return(double(:properties_by_form => {
        "Basic Identity" => {
          "age" => nil,
          "name" => nil,
        }
      }))
      params = ActionController::Parameters.new({
        :age => 5,
        :name => 'Johnny',
        :other_field => 'bad data',
      })

      subject.filter_params(params).keys.sort.should == ["age", "name"]
    end
  end
end
