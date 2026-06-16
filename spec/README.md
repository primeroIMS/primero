# Testing

We use rspec for testing. Rspec test are located in the /spec directory.

* [Rspec](https://relishapp.com/rspec)

## Commands
* `rspec spec` - Run entire suite (models, integration, controller, views, etc).
* `rspec spec/models` - Run model suite.
* `rspec spec/controllers` - Run controller suite.
* `rspec spec/PATH/TO/SPEC/FILE` - Run specific spec file. (ex. /spec/models/child_spec.rb)
* `rspec spec/PATH/TO/SPEC/FILE:LINE_NUMBER` - Run specific spec file at a line number. (ex. /spec/models/child_spec.rb:40)


#### Things to Test/Tips

* Developers should refrain from testing every element on a page. For example, A test will fill out a form, post the data to the server, then expect certain text on the page. Primero forms may contains alot of different fields, so only test that 2 or 3 fields display on the results page. Also test that a success message displayed on the page. Testing every field will kill performance.

* On large pages, scope your assertions to refrain from running into issues with duplicate content

* You are able to evaluate js on a page. Example: `page.evaluate_script("$('a.btn-signup').text();")`

#### Example Spec

Building form sections is done using factory bot. Notice below you can create a form section 
with the `form_section` factory. Add the fields you want to the fields property (array). 
You can also build a subform wit the `subform_field` factory and pass in your desired fields
in the fields property (array).

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
```

#### Use of SOLR
You will need to call `Sunspot.commit` to index records. Also make sure your test is
tagged with `search: true`

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
