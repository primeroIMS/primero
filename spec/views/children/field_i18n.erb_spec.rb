require 'rails_helper'

describe 'children/' do
  before :all do
    @old_backend = I18n.backend
    I18n.backend = I18nBackendCouch.new
  end

  after :all do
    I18n.backend = @old_backend
  end

  before :each do
    I18n.backend.class.should == I18nBackendCouch
    @child = Child.new("_id" => "id12345", "name" => "First Last", "new field" => "")
    assigns[:child] = @child
  end

  shared_examples "label translation" do
    it "should use the display_name and not the translation" do
      translated_name = "XYZ"
      I18n.backend.store_translations("en", @field.name => translated_name)
      render :partial => "form_section/#{@field.type}", :object => @field, :locals => {:formObject => @child}
      rendered.should be_include(@field.display_name)
      rendered.should_not be_include(translated_name)
    end
  end

  FIELDS = [
    Field.new(:name => 'new_field', :display_name => 'This is a New Field', :type => 'numeric_field'),
    Field.new(:name => 'new_field', :display_name => 'This is a New Field', :type => 'text_field'),
    Field.new(:name => 'new_field', :display_name => 'This is a New Field', :type => 'textarea'),

    # Audio upload and photo upload boxes are using Static labels instead of field.display_name
    # Field.new(:name => 'new_field', :display_name => 'This is a New Field', :type => 'audio_upload_box'),
    # Field.new(:name => 'new_field', :display_name => 'This is a New Field', :type => 'photo_upload_box'),

    Field.new(:name => 'new_field', :display_name => 'This is a New Field', :type => 'date_field'),
    Field.new(:name => 'new_field', :display_name => 'This is a New Field', :type => 'radio_button', :option_strings => []),
    Field.new(:name => 'new_field', :display_name => 'This is a New Field', :type => 'select_box', :option_strings => [])
  ]

  FIELDS.each do |field|
    describe field.type do
      before :each do
        @field = field
        @field.should_receive(:form).and_return(FormSection.new("name" => "form_section"))
      end

      it_should_behave_like "label translation"
    end
  end

end
