require 'rails_helper'

describe Record do

  shared_examples_for "Record id's" do |model_class, record_id_name|
    it "should generate unique_identifier, short_id and #{record_id_name}" do
      record = model_class.new

      #New instances has no id's
      record.unique_identifier.should eq(nil)
      record.short_id.should eq(nil)
      record.send(record_id_name).should eq(nil)

      record.save

      #if everything goes well, id's should be there
      db_record = model_class.find(record.id)
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

      db_record = model_class.find(record.id)
      db_record.unique_identifier.should eq(unique_identifier)
      db_record.short_id.should eq(short_id)
      db_record.send(record_id_name).should eq(record_id)
    end

    it "should not change unique_identifier, short_id and #{record_id_name} on saving operations" do
      date_value = Date.new(1990, 7, 21)
      unique_identifier = "123456789"
      short_id = "1234567",
      record_id = "987654321"
      record = model_class.new(:unique_identifier => unique_identifier, :short_id => short_id, "#{record_id_name}" => record_id)
      record.save

      db_record = model_class.find(record.id)
      db_record.data['a_date_field'] = date_value
      db_record.save

      db_record = model_class.find(record.id)
      db_record.unique_identifier.should eq(unique_identifier)
      db_record.short_id.should eq(short_id)
      db_record.send(record_id_name).should eq(record_id)
      db_record.data['a_date_field'].should eq(date_value)
    end
  end

  describe "Child" do
    it_behaves_like "Record id's", Child, "case_id"
  end

  # xdescribe "Incident" do
  #   it_behaves_like "Record id's", Incident, "incident_id"
  # end
  #
  # xdescribe "TracingRequest" do
  #   it_behaves_like "Record id's", TracingRequest, "tracing_request_id"
  # end
end
