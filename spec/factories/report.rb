FactoryGirl.define do
  factory :report, :traits => [ :model ] do
    name_en "test"
    record_type "case"
    aggregate_by ["location_current1"]
    disaggregate_by ["age"]
    group_dates_by "date"
    group_ages true
    is_graph false
    module_ids ["primeromodule-cp"]
    filters [
      {
        "attribute" => "child_status",
        "value" => ["open"]
      },
      {
        "attribute" => "record_state",
        "value" => ["true"]
      }
    ]

    # ignore do
    #   filename "test_report.csv"
    #   content_type "text/csv"
    #   data "test report"
    # end

    # report_type { "weekly_report" }
    # as_of_date { Date.today }

    # after_build do |report, builder|
    #   report.create_attachment :name => builder.filename, :file => StringIO.new(builder.data), :content_type => builder.content_type if builder.data
    # end
  end

  # factory :reporting_location, :traits => [ :model ] do
  #   field_key "owned_by_location"
  #   label_key "district"
  #   admin_level 2
  # end
end