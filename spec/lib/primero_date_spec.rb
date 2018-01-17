require 'rails_helper'
describe PrimeroDate do
  before :each do
    fields = [
      Field.new({"name" => "incident_date_test",
                 "type" => "date_field",
                 "display_name_all" => "Date of Incident"
                })
    ]
    Incident.any_instance.stub(:field_definitions).and_return(fields)
    Incident.all.all.each { |incident| incident.destroy }
    FormSection.all.all.each { |form| form.destroy }
    form = FormSection.new(
      :unique_id => "gbv_derived_fields",
      :parent_form=>"incident",
      "visible" => true,
      :order_form_group => 50,
      :order => 15,
      :order_subform => 0,
      :form_group_name => "GBV Derived Fields",
      "editable" => true,
      "name_all" => "GBV Derived Fields",
      "description_all" => "GBV Derived Fields",
      #### gbv_incident_form form section.
      :fields => fields
      )
    form.save!
    Incident.refresh_form_properties
  end
  it "should parse valid date formats" do
    incident = Incident.new
    date = Date.strptime "2014-September-05", "%Y-%b-%d"
    values = ["05-Sep-2014", "05-September-2014", "5-Sep-2014", "5-September-2014",
      "05-Sep-14", "05-September-14", "5-Sep-14", "05-September-14",
      "05-09-2014", "05-9-2014", "5-09-2014", "5-9-2014",
      "05-09-14", "05-9-14", "5-09-14", "5-9-14",
      "05/Sep/2014", "05/September/2014", "5/Sep/2014", "5/September/2014",
      "05/Sep/14", "05/September/14", "5/Sep/14", "05/September/14",
      "05/09/2014", "05/9/2014", "5/09/2014", "5/9/2014",
      "05/09/14", "05/9/14", "5/09/14", "5/9/14"]
    values.each do |value|
      PrimeroDate.parse_with_format(value).should eq(date)
      PrimeroDate.parse_with_format(value.gsub('-', ' - ')).should eq(date)
      PrimeroDate.parse_with_format(value.gsub('/', ' / ')).should eq(date)
      incident.incident_date_test = value
      incident.incident_date_test.should eq(date)
      incident.valid?.should eq(true)
    end
  end

  it "should not parse invalid date formats" do
    incident = Incident.new
    values = ["05-jly-2014", "September-05-2014", "5-Sip-2014", "5-Sept-2014",
      "09-15-2014", "09-15-14", "10 -jly-2014", "05/jly/2014", "September/05/2014",
      "5/Sip/2014", "5/Sept/2014", "09/15/2014", "09/15/14", "10 /jly/2014",
      "2014-Sep-05", "2014-September-05"]
    values.each do |value|
      expect{PrimeroDate.parse_with_format(value)}.to raise_error(ArgumentError, 'invalid date')
      incident.incident_date_test = value
      incident.incident_date_test.should eq(value)
      incident.valid?.should eq(false)
    end
  end
end
