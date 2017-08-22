FactoryGirl.define do
  factory :report, :traits => [ :model ] do
    transient do
      filename "test_report.csv"
      content_type "text/csv"
      data "test report"
    end

    report_type { "weekly_report" }
    as_of_date { Date.today }

    after_build do |report, builder|
      report.create_attachment :name => builder.filename, :file => StringIO.new(builder.data), :content_type => builder.content_type if builder.data
    end
  end

  factory :reporting_location, :traits => [ :model ] do
    field_key "owned_by_location"
    label_key "district"
    admin_level 2
  end
end