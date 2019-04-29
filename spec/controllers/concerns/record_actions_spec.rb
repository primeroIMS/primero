require 'rails_helper'

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
        mock_record = double(:module => 'test_module')
        mock_record.class.should_receive(:permitted_property_names).and_return(['name', 'age'])
        subject.should_receive(:record_params).and_return(ActionController::Parameters.new({
          :age => 5,
          :name => 'Johnny',
          :other_field => 'bad data',
        }))

        subject.filter_params(mock_record).keys.sort.should == ["age", "name"]
      end
    end

    # shared_examples_for "#filter_permitted_export_properties other format" do |format|
    #   it "should not call permitted_property_keys for format #{format}" do
    #     mock_user = double();
    #     mock_record = double()
    #     subject.should_receive(:current_user).and_return(mock_user);
    #     params = ActionController::Parameters.new({:action => "index", :format => format})
    #     subject.should_receive(:params).and_return(params)
    #     subject.should_not_receive(:permitted_property_keys)
    #     subject.should_not_receive(:can?)
    #     subject.should_not_receive(:can?)
    #     props = [
    #       mock_prop('name'),
    #       mock_prop('age'),
    #       mock_prop('survivor_code'),
    #       mock_prop('other_field'),
    #     ]
    #     allowed = subject.filter_permitted_export_properties([mock_record, mock_record], props)
    #     allowed.should == props
    #   end
    # end
    #
    # it_behaves_like "#filter_permitted_export_properties other format", "xls"
    # it_behaves_like "#filter_permitted_export_properties other format", "selected_xls"
    # it_behaves_like "#filter_permitted_export_properties other format", "case_pdf"

  end

end
