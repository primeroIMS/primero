require 'rails_helper'

describe Record do

  def create_form_section_date_field(parent_form)
    form = FormSection.new(:name => "#{parent_form}_test_form", :parent_form => parent_form, "visible" => true,
                           :order_form_group => 0, :order => 0, :order_subform => 0, :form_group_name => "#{parent_form}_test_form")
    form.fields << Field.new(:name => "a_date_field", :type => Field::DATE_FIELD, :display_name => "a_date_field")
    form.save!
  end

  before :each do
    Child.any_instance.stub(:field_definitions).and_return([Field.new(:name => "a_date_field", :type => Field::DATE_FIELD, :display_name => "a_date_field")])
    Incident.any_instance.stub(:field_definitions).and_return([Field.new(:name => "a_date_field", :type => Field::DATE_FIELD, :display_name => "a_date_field")])
    TracingRequest.any_instance.stub(:field_definitions).and_return([Field.new(:name => "a_date_field", :type => Field::DATE_FIELD, :display_name => "a_date_field")])
  end

  before :all do
    FormSection.all.each {|form| form.destroy}
    create_form_section_date_field("case")
    create_form_section_date_field("tracing_request")
    create_form_section_date_field("incident")
  end

  shared_examples_for "Record id's" do |model_class, record_id_name|
    it "should generate unique_identifier, short_id and #{record_id_name}" do
      record = model_class.new

      #New instances has no id's
      record.unique_identifier.should eq(nil)
      record.short_id.should eq(nil)
      record.send(record_id_name).should eq(nil)

      record.save

      #if everything goes well, id's should be there
      db_record = model_class.get(record.id)
      db_record.unique_identifier.should_not eq(nil)
      db_record.short_id.should eq(db_record.unique_identifier.last(7))
      db_record.send(record_id_name).should eq(db_record.unique_identifier)
    end

    it "should keep unique_identifier, short_id and #{record_id_name} if they are provided" do
      unique_identifier = "123456789"
      short_id = "1234567",
      record_id = "987654321"

      record = model_class.new(:unique_identifier => unique_identifier, :short_id => short_id, "#{record_id_name}" => record_id)

      #New instance receive the id's
      record.unique_identifier.should eq(unique_identifier)
      record.short_id.should eq(short_id)
      record.send(record_id_name).should eq(record_id)

      record.save

      db_record = model_class.get(record.id)
      db_record.unique_identifier.should eq(unique_identifier)
      db_record.short_id.should eq(short_id)
      db_record.send(record_id_name).should eq(record_id)
    end

    it "should keep unique_identifier, short_id and #{record_id_name} nil if some error" do
      record = model_class.new

      #make this field invalid to rise an error validation and so the id's will not be generated.
      record['a_date_field'] = "21-21-1990"
      record.save

      record.unique_identifier.should eq(nil)
      record.short_id.should eq(nil)
      record.send(record_id_name).should eq(nil)
    end

    it "should not change unique_identifier, short_id and #{record_id_name} on saving operations" do
      date_value = "21-Jul-1990"
      unique_identifier = "123456789"
      short_id = "1234567",
      record_id = "987654321"
      record = model_class.new(:unique_identifier => unique_identifier, :short_id => short_id, "#{record_id_name}" => record_id)
      record.save

      db_record = model_class.get(record.id)
      db_record['a_date_field'] = date_value
      db_record.couchrest_attribute_will_change!('a_date_field')
      db_record.save

      db_record = model_class.get(record.id)
      db_record.unique_identifier.should eq(unique_identifier)
      db_record.short_id.should eq(short_id)
      db_record.send(record_id_name).should eq(record_id)
      db_record['a_date_field'].should eq(date_value)
    end
  end

  describe "Child" do
    it_behaves_like "Record id's", Child, "case_id"
  end

  describe "Incident" do
    it_behaves_like "Record id's", Incident, "incident_id"
  end

  describe "TracingRequest" do
    it_behaves_like "Record id's", TracingRequest, "tracing_request_id"
  end
end
