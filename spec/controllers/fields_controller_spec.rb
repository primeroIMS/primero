# -*- coding: utf-8 -*-
require 'rails_helper'

describe FieldsController do
  before :each do
    user = User.new(:user_name => 'manager_of_forms')
    @permission_metadata = Permission.new(resource: Permission::METADATA, actions: [Permission::MANAGE])
    user.stub(:roles).and_return([Role.new(permissions_list: [@permission_metadata])])
    fake_login user
  end

  describe "post create" do
    before :each do
      @field = Field.new :name => "my_new_field", :type=>"TEXT", :display_name => "My New Field"
      @form_section = FormSection.new :name => "Form section 1", :unique_id=>'form_section_1'
      FormSection.stub(:find_by).with({unique_id: @form_section.unique_id}).and_return(@form_section)
    end

    it "should add the new field to the formsection" do
      FormSection.stub(:add_field_to_formsection)
      post :create, params: {:form_section_id => @form_section.unique_id, :module_id => 'test_module', :field => JSON.parse(@field.to_json)}
    end

    it "should redirect back to the fields page" do
      FormSection.stub(:add_field_to_formsection)
      post :create, params: {:form_section_id => @form_section.unique_id, :module_id => "test_module", :field => JSON.parse(@field.to_json)}
      expect(response).to redirect_to(edit_form_section_path(@form_section.unique_id, :module_id => "test_module", :parent_form => 'case'))
    end

    it "should render edit form section page if field has errors" do
      FormSection.stub(:add_field_to_formsection)
      expect(Field).to receive(:new).and_return(@field)
      @field.stub(:errors){["errors"]}
      post :create, params: {:form_section_id => @form_section.unique_id, :field => JSON.parse(@field.to_json), :module_id => "test_module"}
      expect(assigns[:show_add_field]).to eq({:show_add_field => true})
      expect(response).to be_success
      expect(response).to render_template("form_section/edit")
    end

    it "should show a flash message" do
      FormSection.stub(:add_field_to_formsection)
      post :create, params: {:form_section_id => @form_section.unique_id, :field => JSON.parse(@field.to_json), :module_id => "test_module"}
      expect(request.flash[:notice]).to eq("Field successfully added")
    end

    it "should not mark suggested field as used if there is not one supplied" do
      FormSection.stub(:add_field_to_formsection)
      post :create, params: {:form_section_id => @form_section.unique_id, :field => JSON.parse(@field.to_json), :module_id => "test_module"}
    end

    it "should use the display name to form the field name if no field name is supplied" do
      expect(FormSection).to receive(:add_field_to_formsection).with(anything(), instance_of(Field))
      post :create, params: {:form_section_id => @form_section.unique_id, :field => {:display_name => "My brilliant new field"}, :module_id => "test_module"}
    end

  end

  describe "edit" do
    it "should render form_section/edit template" do
      @form_section = FormSection.new
      field = double('field', :name => 'field1')
      @form_section.stub(:fields).and_return([field])
      FormSection.stub(:find_by).with({unique_id: 'unique_id'}).and_return(@form_section)
      get :edit, params: {:form_section_id => "unique_id", :id => 'field1', :module_id => "test_module"}
      expect(assigns[:body_class]).to eq("forms-page")
      expect(assigns[:field]).to eq(field)
      expect(assigns[:show_add_field]).to eq({:show_add_field => true, :edit_field_mode => true})
      expect(response).to render_template('form_section/edit')
    end
  end

  describe "post move_up and move_down" do
    before :each do
      @form_section_id = "fred"
      @field_name = "barney"
      @form_section = FormSection.new
      FormSection.stub(:find_by).with({unique_id: @form_section_id}).and_return(@form_section)
    end

    it "should save the given field in the same order as given" do
      expect(@form_section).to receive(:order_fields).with(["field_one", "field_two"])
      post :save_order, params: {:form_section_id => @form_section_id, :ids => ["field_one", "field_two"]}
      expect(response).to redirect_to(edit_form_section_path(@form_section_id))
    end

  end

  describe "post toggle_fields" do

    before :each do
      Field.all.each(&:destroy)
      FormSection.all.each(&:destroy)
      @field = Field.create(:name => "country_of_origin",
                            :display_name => "Origin Country",
                            :visible => true,
                            :help_text => "old help text")
      @form = FormSection.create!(:name => "Some Form", :unique_id => "some_form", :fields => [@field])
    end

    it "should toggle the given field" do
      expect(Field.last.visible).to eq(true)
      expect(@form.valid?).to eq(true)

      post :toggle_fields, params: {:form_section_id => @form, :id => 'country_of_origin'}
      expect(Field.last.visible).to eq(false)
      expect(response.body).to eq("OK")
    end

  end

  describe "post update" do
    before :all do
      Field.all.each(&:destroy)
      FormSection.all.each(&:destroy)
    end

    it "should update all attributes on field at once and render edit form sections page" do
      field_to_change = Field.new(:name => "country_of_origin",
                                  :display_name => "Origin Country",
                                  :visible => true,
                                  :help_text => "old help text")

      some_form = FormSection.create!(:name => "Some Form",
                                      :unique_id => "some_form",
                                      :fields => [field_to_change])

      put :update, params: {
                             :id => "country_of_origin",
                             :form_section_id => some_form.unique_id,
                             :module_id => "test_module",
                             :field => {
                               :display_name_en => "What Country Are You From",
                               :visible => false,
                               :help_text_en => "new help text"
                             }
                           }
      updated_field = FormSection.find(some_form.id).fields.first
      expect(updated_field.display_name).to eq("What Country Are You From")
      expect(updated_field.visible).to be_falsey
      expect(updated_field.help_text).to eq("new help text")
      expect(response).to redirect_to(edit_form_section_path(some_form.unique_id, :module_id => "test_module", :parent_form => 'case'))
    end

    it "should display errors if field could not be saved" do
      field_with_error =  Field.new(:name => "age",
                                    :display_name => "Age",
                                    :visible => true,
                                    :help_text => "help text")
      some_form = FormSection.create!(:name => "Some Form 2",
                                      :unique_id => "some_form_2",
                                      :fields => [field_with_error])
      put :update, params: {
                     :id => "age",
                     :form_section_id => "some_form_2",
                     :module_id => "primeromodule-cp",
                     :field => {
                       :display_name => nil,
                       :visible => 'false',
                       :help_text => "new help text"
                     }
                   }

      expect(assigns[:show_add_field]).to eq({:show_add_field => true})
      expect(response).to render_template("form_section/edit")
    end

    xit "should move the field to the given form_section" do
      mothers_name_field = Field.new(:name => "mothers_name", :visible => true, :display_name => "Mother's Name")
      another_field = Field.new(:name => "childs_name", :visible => true, :display_name => "Child's Name")
      family_details_form = FormSection.create!(:name => "Family Details", :unique_id => "family_details", :fields => [mothers_name_field])
      mother_details_form = FormSection.create!(:name => "Mother Details", :unique_id => "mother_details", :fields => [another_field])

      put :change_form, params: {:id => mothers_name_field.name, :form_section_id => family_details_form.unique_id, :destination_form_id => mother_details_form.unique_id}

      expect(FormSection.get(family_details_form.id).fields.find {|field| field.name == "mothers_name"}).to be_nil
      updated_field = FormSection.get(mother_details_form.id).fields.find {|field| field.name == "mothers_name"}
      expect(request.flash[:notice]).to eq("Mother's Name moved from Family Details to Mother Details")
      expect(response).to redirect_to(edit_form_section_path(family_details_form.unique_id))
    end

  end
end
