When /^I log in as user "([^\"]*)" using password "([^\"]*)"$/ do |username, password|
  login_page.login_as(username, password)
end

Then /^I am redirected to the dashboard$/ do
  expect(page).to have_content('Dashboard')
end

Then /^there is a visual cue in the header showing me "([^\"]*)"$/ do |message|
  expect(page).to have_content(message)
end

When /^I access (.*)$/ do |page_name|
  visit path_to(page_name)
end

Given /^I am logged in as an admin with username "([^\"]*)" and password "([^\"]*)"$/ do |username, password|
  #data_populator.create_admin(username, password, nil)
  login_page.login_as(username, password)
end

Given /^I am logged in as a social worker with username "([^\"]*)" and password "([^\"]*)"$/ do |username, password|
  #data_populator.create_registration_worker(username, password, nil)
  login_page.login_as(username, password)
end

Given /^I am logged in as a manager with username "([^\"]*)" and password "([^\"]*)"$/ do |username, password|
  #data_populator.create_manager(username, password, nil)
  login_page.login_as(username, password)
end

#////////////////////////////////////////////////////////////////
#//  Pre-Existing Steps
#////////////////////////////////////////////////////////////////

Given /^I am logged in$/ do
  ensure_a_user_exists
  login_page.login_as(User.first.user_name, '123')
end

Given /^I am logged in as an admin$/ do
  data_populator.create_admin('admin', '123', 'Admin')
  login_page.login_as('admin', '123')
end

Given /^I am logged in as "(.+)"/ do |user_name|
  login_page.login_as(user_name, '123')
end

Given /there is a User/ do
  ensure_a_user_exists
end

Given /^"([^\"]*)" logs in with "([^\"]*)" permissions?$/ do |username, permissions|
  data_populator.create_user(username, '123', permissions)
  login_page.login_as(username, '123')
end

Given /^I am logged in as a user with "(.+)" permissions?$/ do |permissions|
  username = 'mary'
  password = '123'
  data_populator.create_user(username, password, permissions)
  login_page.login_as(username, password)
end

Given /^there is a admin$/ do
  data_populator.create_admin('admin', '123', 'Admin')
end

Then /^I am logged in as user (.+) with password as (.+)/ do|user_name,password|
  login_page.login_as(user_name, password)
end

Given /^I logout as "([^"]*)"$/ do |arg|
  click_link(I18n.t("header.logout"))
end

When /^I logout$/ do
  click_link(I18n.t("header.logout"))
end

private

def data_populator
  DataPopulator.new
end

def login_page
  LoginPage.new(Capybara.current_session)
end

def ensure_a_user_exists
  unless @user
    data_populator.create_user('mary', '123', 'View And Search Cases')
  end
end
