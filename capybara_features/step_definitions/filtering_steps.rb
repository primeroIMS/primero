When /^I filter by "(.+)"$/ do |filter_type|
  within(:css, ".filter_panel") do
    click_link(filter_type)
  end
end

Then(/^I should( not)? see a filter for "(.*?)"$/) do |negate, filter_label|
  if negate
    step %Q{I should not see "#{filter_label}" within "#index_filter_form"}
  else
    step %Q{I should see "#{filter_label}" within "#index_filter_form"}
  end
end