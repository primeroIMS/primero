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

    #TODO - verify with Pavel
    #This method was removed from record_actions
    describe '#filter_permitted_export_properties' do
      xit 'outputs the intersection of all allowed properties for the models' do
        subject.should_receive(:current_user)
        subject.should_receive(:permitted_property_keys).and_return(['name', 'age'], ['name', 'survivor_code'])
        params = ActionController::Parameters.new({})
        subject.should_receive(:params).and_return(params, params)
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

      xit "for CSV and read only users call permitted_property_keys" do
        mock_user = double();
        mock_record = double()
        subject.should_receive(:current_user).and_return(mock_user);
        params = ActionController::Parameters.new({:action => "index", :format => "csv"})
        subject.should_receive(:params).and_return(params, params)
        subject.should_receive(:permitted_property_keys).with(mock_record, mock_user, true).twice.and_return(['name'])
        mock_user.should_receive(:readonly?).and_return(true)
        props = [
          mock_prop('name'),
          mock_prop('age'),
          mock_prop('survivor_code'),
          mock_prop('other_field'),
        ]
        allowed = subject.filter_permitted_export_properties([mock_record, mock_record], props)
        allowed.map {|p| p.name }.sort.should == ['name']
      end

      xit "for CSV and update able users call permitted_property_keys" do
        mock_user = double();
        mock_record = double()
        subject.should_receive(:current_user).and_return(mock_user);
        params = ActionController::Parameters.new({:action => "index", :format => "csv"})
        subject.should_receive(:params).and_return(params, params)
        subject.should_receive(:permitted_property_keys).with(mock_record, mock_user, false).twice.and_return(['name'])
        mock_user.should_receive(:readonly?).and_return(false)
        props = [
          mock_prop('name'),
          mock_prop('age'),
          mock_prop('survivor_code'),
          mock_prop('other_field'),
        ]
        allowed = subject.filter_permitted_export_properties([mock_record, mock_record], props)
        allowed.map {|p| p.name }.sort.should == ['name']
      end

      xit "for CSV and create able users call permitted_property_keys" do
        mock_user = double();
        mock_record = double()
        subject.should_receive(:current_user).and_return(mock_user);
        params = ActionController::Parameters.new({:action => "index", :format => "csv"})
        subject.should_receive(:params).and_return(params, params)
        subject.should_receive(:permitted_property_keys).with(mock_record, mock_user, false).twice.and_return(['name'])
        mock_user.should_receive(:readonly?).and_return(false)
        props = [
          mock_prop('name'),
          mock_prop('age'),
          mock_prop('survivor_code'),
          mock_prop('other_field'),
        ]
        allowed = subject.filter_permitted_export_properties([mock_record, mock_record], props)
        allowed.map {|p| p.name }.sort.should == ['name']
      end

      xit "for JSON and call permitted_property_keys" do
        mock_user = double();
        mock_record = double()
        subject.should_receive(:current_user).and_return(mock_user);
        params = ActionController::Parameters.new({:action => "index", :format => "json"})
        subject.should_receive(:params).and_return(params, params)
        subject.should_receive(:permitted_property_keys).with(mock_record, mock_user, false).twice.and_return(['name'])
        subject.should_not_receive(:can?)
        subject.should_not_receive(:can?)
        props = [
          mock_prop('name'),
          mock_prop('age'),
          mock_prop('survivor_code'),
          mock_prop('other_field'),
        ]
        allowed = subject.filter_permitted_export_properties([mock_record, mock_record], props)
        allowed.map {|p| p.name }.sort.should == ['name']
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
