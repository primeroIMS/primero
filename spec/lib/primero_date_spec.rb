require 'spec_helper'
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

  it "should parse valid date/time formats" do
    incident = Incident.new
    date = Time.strptime "2014-September-05 13:15", "%Y-%b-%d %H:%M"
    values = ["05-Sep-2014 13:15", "05-September-2014 13:15", "5-Sep-2014 13:15", "5-September-2014 13:15",
      "05-Sep-14 13:15", "05-September-14 13:15", "5-Sep-14 13:15", "05-September-14 13:15",
      "05-09-2014 13:15", "05-9-2014 13:15", "5-09-2014 13:15", "5-9-2014 13:15",
      "05-09-14 13:15", "05-9-14 13:15", "5-09-14 13:15", "5-9-14 13:15",
      "05/Sep/2014 13:15", "05/September/2014 13:15", "5/Sep/2014 13:15", "5/September/2014 13:15",
      "05/Sep/14 13:15", "05/September/14 13:15", "5/Sep/14 13:15", "05/September/14 13:15",
      "05/09/2014 13:15", "05/9/2014 13:15", "5/09/2014 13:15", "5/9/2014 13:15",
      "05/09/14 13:15", "05/9/14 13:15", "5/09/14 13:15", "5/9/14 13:15"]

    values.each do |value|
      PrimeroDate.parse_with_format(value).should eq(date)
      PrimeroDate.parse_with_format(value.gsub('-', ' - ')).should eq(date)
      PrimeroDate.parse_with_format(value.gsub('/', ' / ')).should eq(date)
      incident.incident_date_test = value
      incident.incident_date_test.should eq(date)
      incident.valid?.should eq(true)
    end
  end

  it "should parse valid date formats in french" do
    incident = Incident.new
    date = Date.strptime "2014-July-05", "%Y-%b-%d"
    I18n.config.locale = :fr
    values = ["05-juil-2014", "05-juillet-2014", "5-juil-2014", "5-juillet-2014",
      "05-Juil-14", "05-juillet-14", "5-juil-14", "05-Juillet-14",
      "05-07-2014", "05-7-2014", "5-07-2014", "5-7-2014",
      "05-07-14", "05-7-14", "5-07-14", "5-7-14",
      "05/juil/2014", "05/juillet/2014", "5/juil/2014", "5/Juillet/2014",
      "05/Juil/14", "05/juillet/14", "5/juil/14", "05/juillet/14",
      "05/07/2014", "05/7/2014", "5/07/2014", "5/7/2014",
      "05/07/14", "05/7/14", "5/07/14", "5/7/14"]
    values.each do |value|
      PrimeroDate.parse_with_format(value).should eq(date)
      PrimeroDate.parse_with_format(value.gsub('-', ' - ')).should eq(date)
      PrimeroDate.parse_with_format(value.gsub('/', ' / ')).should eq(date)
      incident.incident_date_test = value
      incident.incident_date_test.should eq(date)
      incident.valid?.should eq(true)
    end
  end

  it "should parse valid date formats in arabic" do
    incident = Incident.new
    date = Date.strptime "2014-July-05", "%Y-%b-%d"
    I18n.config.locale = :ar
    values = ["05-يول-2014", "05-يوليو-2014", "5-يول-2014", "5-يوليو-2014",
      "05-يول-14", "05-يوليو-14", "5-يول-14", "05-يوليو-14",
      "05-07-2014", "05-7-2014", "5-07-2014", "5-7-2014",
      "05-07-14", "05-7-14", "5-07-14", "5-7-14",
      "05/يول/2014", "05/يوليو/2014", "5/يول/2014", "5/يوليو/2014",
      "05/يول/14", "05/يوليو/14", "5/يول/14", "05/يوليو/14",
      "05/07/2014", "05/7/2014", "5/07/2014", "5/7/2014",
      "05/07/14", "05/7/14", "5/07/14", "5/7/14"]
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
    I18n.config.locale = :en
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

  # TODO: Find better way to test.
  it "should return date/time with correct timezone" do
    database_formated_date = "2017/05/27 18:05:00 -0400"
    i18n_atlantic_date_time = "27-May-2017 19:05"
    i18n_istanbul_date_time = "28-May-2017 01:05"
    a_date = PrimeroDate.couchrest_typecast(nil, nil, database_formated_date)
    Time.zone = 'Atlantic Time (Canada)'
    expect(a_date.in_time_zone(Time.zone.name).strftime('%d-%b-%Y %H:%M')).to eql(i18n_atlantic_date_time)

    Time.zone = 'Istanbul'
    expect(a_date.in_time_zone(Time.zone.name).strftime('%d-%b-%Y %H:%M')).to eql(i18n_istanbul_date_time)
  end
end
