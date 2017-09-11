# Testing

We use rspec for testing. Rspec test are located in the /spec directory. There shouldn't be any additional dependency installations to run the test.

* [Rspec](https://relishapp.com/rspec)
* [Capybara](http://www.rubydoc.info/github/teamcapybara/capybara/master)

## Prep
You will need to install the latest version of chrome to your vagrant box.

`sudo apt-get install chromium-browser libgconf-2-4`

## Commands
* `rspec spec` - Run entire suite (models, integration, controller, views, etc).
* `rspec spec/integration` - Run integration suite.
* `rspec spec/models` - Run model suite.
* `rspec spec/controllers` - Run controller suite.
* `rspec spec/PATH/TO/SPEC/FILE` - Run specific spec file. (ex. /spec/models/child_spec.rb)
* `rspec spec/PATH/TO/SPEC/FILE:LINE_NUMBER` - Run specific spec file at a line number. (ex. /spec/models/child_spec.rb:40)

## Integration Testing

Cucumber test in primero have been deprecated in favor of using rspec/capybara/selenium. Test are located in `/spec/integration`. Current we use the chrome headless driver. The drivers are embedded in the chromedriver-helper gem. Configuration for capybara/driver is located in spec_helper.rb. You may use Factory Girl to setup factories in test.

```
require 'capybara/rails'
require 'selenium/webdriver'

Capybara.register_driver :chrome do |app|
  Capybara::Selenium::Driver.new(app, browser: :chrome)
end

Capybara.register_driver :headless_chrome do |app|
  capabilities = Selenium::WebDriver::Remote::Capabilities.chrome(
    chromeOptions: { args: %w(headless disable-gpu) }
  )

  Capybara::Selenium::Driver.new app,
    browser: :chrome,
    desired_capabilities: capabilities
end

Capybara.default_max_wait_time = 6
Capybara.javascript_driver = :headless_chrome
```

#### Things to Test/Tips

* Developers shour refrain from testing every element on a page. For example, A test will fill out a form, post the data to the server, then expect certain text on the page. Primero forms may contains alot of different fields, so only test that 2 or 3 fields display on the results page. Also test that a success message displayed on the page. Testing every field will kill performance.

* On large pages, scope your assertions to refrain from running into issues with duplicate content

* You are able to evaluate js on a page. Example: `page.evaluate_script("$('a.btn-signup').text();")`

#### Example Spec

** Note: `feature` is aliased to `describe, type: feature do end;` and `scenario` is aliased to `it do end;`

```
require 'spec_helper'

feature "signin process" do
  before do
    @user = create(:user, password: 'password123', password_confirmation: 'password123')
  end

  scenario "invalid signin" do
    visit '/'
    within(".login_page form") do
      fill_in 'User Name', with: 'heyguy'
      fill_in 'Password', with: 'password123'
    end
    click_button 'Log in'
    expect(page).to have_content 'Invalid credentials. Please try again!'
  end

  scenario "valid signin" do
    visit '/'
    within(".login_page form") do
      fill_in 'User Name', with: @user.user_name
      fill_in 'Password', with: 'password123'
    end
    click_button 'Log in'
    expect(page).to have_content "Logged in as: #{@user.user_name}"
  end
end
```

Building form sections is done throught factory girl. Notice below you can create a form section with the `form_section` factory. Add the fields you want to the fields property (array). You can also build a subform wit the `subform_field` factory and pass in your desired fields in the fields property (array).

```
@form_section = create(:form_section,
  is_first_tab: true,
  fields: [
    # Example field outside of subform
    build(:field, required: false)
    # Example subform
    build(:subform_field, fields: [
      # Example subform fields
      build(:field, required: true),
      build(:field)
    ])
  ]
)

#### Create a user session for spec

To create a user session use `create_session(user, password)` before visiting a page.

```
  scenario "create user session (Example)" do
    create_session(@user, 'password123')
    visit '/'
    expect(page).to have_content "Logged in as: #{@user.user_name}"
  end
```

#### Use of SOLR
You will need to call `Sunspot.commit` to index records. Also make sure your test is tagged with `search: true`

```
  feature "test features, search: true do
  before do
    @case = create(:child)
    @case2 = create(:child, name: 'Josh')
    Sunspot.commit
  end

  ...

  end
```

#### Pausing
You are able to pause a test by inserting pause into a test. Useful if testing outside of vagrant

```
  scenario "testing" do
    pause
    expect(page).to have_content("Hello World)
  end
```