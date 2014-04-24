Then /^I should see an id "([^\"]*)" link on the page$/ do |id|
  expect(page).to have_selector(:link_or_button, id)
end