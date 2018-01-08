require 'rails_helper'

describe "form_section/_audio_upload_box.html.erb" do

  it "should show help text when exists" do
    @child = Child.new("_id" => "id12345", "name" => "First Last")
    audio_field = Field.new :name => "new field",
    :display_name => "field name",
    :type => 'audio_upload_box',
    :help_text => "This is my help text"

    render :partial => 'form_section/audio_upload_box', :locals => { :audio_upload_box => audio_field, :formObject => @child }, :formats => [:html], :handlers => [:erb]

    rendered.should have_tag(".help-text-container")
    rendered.should have_tag(".help-text")
  end

  it "should not show help text when not exists" do
    audio_field = Field.new :name => "new field",
    :display_name => "field name",
    :type => 'audio_upload_box'

    render :partial => 'form_section/audio_upload_box', :locals => { :audio_upload_box => audio_field, :formObject => @child }, :formats => [:html], :handlers => [:erb]

    rendered.should_not have_tag(".help-text-container")
    rendered.should_not have_tag(".help-text")
  end

  it "should show the delete audio checkbox" do
    audio_field = Field.new :name => "new field",
                            :display_name => "field name",
                            :type => 'audio_upload_box'

    @child = Child.new
    @child.stub(:new_record?).and_return(false)
    @child.stub(:new?).and_return(false)
    @child.stub(:id).and_return("id")
    @child.stub(:audio).and_return(uploadable_audio_mp3)
    @child.stub(:has_valid_audio?).and_return(true)

    render :partial => 'form_section/audio_upload_box', :locals => { :audio_upload_box => audio_field, :formObject => @child }, :formats => [:html], :handlers => [:erb]
    rendered.should have_tag(".profile-section-label")
    rendered.should have_tag("a#audio_link")
    rendered.should have_tag("div.delete_check_box")
    rendered.should have_tag("div.delete_check_box label[text()='Delete audio?']")
    rendered.should have_tag("div.delete_check_box input#delete_child_audio")
  end

end
