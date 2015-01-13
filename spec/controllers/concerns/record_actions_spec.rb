require 'spec_helper'

class RecordController < ActionController::Base
  include RecordActions
  def model_class
    Child
  end
end

describe RecordActions do
  context 'permission-based filtering' do
    subject { RecordController.new }
    def mock_prop(name)
      double(:name => name)
    end

    describe '#filter_params' do
      it 'filters params that are not in the form sections for this model' do
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

    describe '#filter_permitted_export_properties' do
      it 'outputs the intersection of all allowed properties for the models' do
        subject.should_receive(:current_user)
        subject.should_receive(:permitted_property_keys).and_return(['name', 'age'], ['name', 'survivor_code'])
        mock_record = double()
        props = [
          mock_prop('name'),
          mock_prop('age'),
          mock_prop('survivor_code'),
          mock_prop('other_field'),
        ]

        allowed = subject.filter_permitted_export_properties([mock_record, mock_record], props)
        allowed.map {|p| p.name }.sort.should == ['age', 'name', 'survivor_code']
      end
    end
  end
end
