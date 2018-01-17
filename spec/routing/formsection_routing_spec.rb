require 'rails_helper'

describe 'Form Section routing' do

  it 'routes /forms/foo/fields correctly' do
    {:get => '/forms/foo/fields'}.should route_to(
      :controller => 'fields', :action => 'index', :form_section_id => 'foo' )
  end

  it 'has route to post a new field' do
    {:post => '/forms/foo/fields' }.should route_to(:controller => 'fields', :action => 'create', :form_section_id => 'foo' )
    form_section_fields_path('some_formsection').should == '/forms/some_formsection/fields'
  end

  it 'has route to save order of fields' do
    {:post => '/forms/foo/fields/save_order'}.should route_to(:controller => 'fields', :action=>'save_order', :form_section_id=>'foo')
    save_order_form_section_fields_path('some_formsection').should == '/forms/some_formsection/fields/save_order'
  end

  it 'has route for form sections index page' do
    {:get => '/forms'}.should route_to(:controller => 'form_section', :action=>'index')
    form_sections_path.should == '/forms'
  end

  it 'has route for form sections new page' do
    {:get => '/forms/new'}.should route_to(:controller => 'form_section', :action=>'new')
    new_form_section_path.should == '/forms/new'
  end

  it "has route for update field page" do
    {:put => '/forms/form_section_unique_id/fields/field_id'}.should route_to(:controller => 'fields', :action => "update", "form_section_id"=>"form_section_unique_id", "id"=>"field_id")
  end

  it "routes the forms API call to JSON withe /api/forms alias" do
    {get: 'api/forms'}.should route_to(:controller => 'form_section', :action => 'index', :format => :json)
  end

  it "routes the forms API call to JSON" do
    {get: 'api/form_sections'}.should route_to(:controller => 'form_section', :action => 'index', :format => :json)
  end
end
