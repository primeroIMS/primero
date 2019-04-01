#TODO: All tests in this file have been disabled. Keeping them around for reference only.
#      When advanced search is fully re-implemnted, everything here should be rewritten.

require 'rails_helper'
require 'nokogiri'

describe "advanced_search/index.html.erb" do

  # PRIMERO-72
  # Stubbed out Advanced Search functionality as part of demo cleanup
  # TODO add test back when functionality is added back
  # it "should not show hidden fields" do
    # fields = [Field.new(:name => 'my_field', :display_name => 'My Field', :visible => true, :type => Field::TEXT_FIELD),
              # Field.new(:name => 'my_hidden_field', :display_name => 'My Hidden Field', :visible=> false, :type => Field::TEXT_FIELD)]
    # form_sections = [FormSection.new("name" => "Basic Details", "enabled"=> "true", "description"=>"Blah blah", "order"=>"10", "unique_id"=> "basic_details", :editable => "false", :fields => fields)]
    # assign(:forms, form_sections)
    # assign(:criteria_list, [])
    # render
    # document = Nokogiri::HTML(rendered)
    # document.css(".field").count.should == 1
  # end

  xit "show navigation links for logged in user" do
    user = stub_model(User, :user_name => "bob", :has_permission? => true)
    form_sections = [FormSection.new("name" => "Basic Details", "enabled"=> "true", "description"=>"Blah blah", "order"=>"10", "unique_id"=> "basic_details", :editable => "false", :fields => [])]
    assign(:forms, form_sections)
    assign(:criteria_list, [])

    view.stub(:current_user).and_return(user)
    controller.stub(:current_user).and_return(user)
    view.stub(:current_user_name).and_return(user.user_name)

    controller.stub(:user_signed_in?).and_return(true)
    view.stub(:user_signed_in?).and_return(true)

    render :template => "advanced_search/index", :layout => "layouts/application"

    rendered.should have_tag("nav")

    # PRIMERO-72
    # Removed CHILDREN link as part of demo cleanup
    # TODO add test back when functionality is added back
    #rendered.should have_link "CHILDREN", :href => children_path
  end

  xit "show not navigation links when no user logged in" do
    form_sections = [FormSection.new("name" => "Basic Details", "enabled"=> "true", "description"=>"Blah blah", "order"=>"10", "unique_id"=> "basic_details", :editable => "false", :fields => [])]
    view.stub(:current_user).and_return(nil)
    view.stub(:user_signed_in?).and_return(false)
    assign(:forms, form_sections)
    assign(:criteria_list, [])
    render :template => "advanced_search/index", :layout => "layouts/application"

    rendered.should_not have_tag("nav")
    rendered.should_not have_link "CHILDREN", :href => children_path
  end
end
