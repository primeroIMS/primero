require 'rails_helper'

describe "form_section/_field_display_audio.html.erb" do

  it "should show the delete audio checkbox" do
    child = Child.new
    child.stub(:new_record?).and_return(false)
    child.stub(:new?).and_return(false)
    child.stub(:id).and_return("id")
    child.stub(:audio).and_return(uploadable_audio_mp3)
    child.stub(:has_valid_audio?).and_return(true)

    render :partial => 'form_section/field_display_audio', :locals => { :field => nil, :formObject => child, :display_audio_delete_checkbox => true}, :formats => [:html], :handlers => [:erb]
    rendered.should have_tag(".profile-section-label")
    rendered.should have_tag("a#audio_link")
    rendered.should have_tag("div.delete_check_box")
    rendered.should have_tag("div.delete_check_box label[text()='Delete audio?']")
    rendered.should have_tag("div.delete_check_box input#delete_child_audio")
  end

  it "should not show the delete audio checkbox" do
    child = Child.new
    child.stub(:new_record?).and_return(false)
    child.stub(:new?).and_return(false)
    child.stub(:id).and_return("id")
    child.stub(:audio).and_return(uploadable_audio_mp3)
    child.stub(:has_valid_audio?).and_return(true)

    render :partial => 'form_section/field_display_audio', :locals => { :field => nil, :formObject => child, :display_audio_delete_checkbox => false}, :formats => [:html], :handlers => [:erb]
    rendered.should have_tag(".profile-section-label")
    rendered.should have_tag("a#audio_link")
    rendered.should_not have_tag("div.delete_check_box")
  end

end