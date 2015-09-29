require 'spec_helper'
require 'index_helper'

include IndexHelper

describe "children/_filter.html.erb" do
  before :each do
    FormSection.all.each &:destroy
    PrimeroModule.all.each &:destroy

    fields = [
      Field.new({"name" => "urgent_protection_concern",
                 "type" => "radio_button",
                 "display_name_all" => "Urgent Protection Concern?",
                 "option_strings_text_all" => "Yes\nNo"
                })
    ]
    @form_cp = FormSection.new(
      :unique_id => "form_section_test_cp",
      :parent_form=>"case",
      "visible" => true,
      :order_form_group => 1,
      :order => 1,
      :order_subform => 0,
      :form_group_name => "Form Section Test CP",
      "editable" => true,
      "name_all" => "Form Section Test CP",
      "description_all" => "Form Section Test CP",
      :fields => fields
    )
    @form_cp.save!

    @primero_module_cp = PrimeroModule.new(
      :program_id => "primeroprogram-primero",
      :id => "primeromodule-cp",
      :name => "CP",
      :description => "Child Protection",
      :associated_record_types => ["case"],
      :associated_form_ids => [@form_cp.unique_id]
    )
    @primero_module_cp.save!

    fields = [
      Field.new({"name" => "gbv_displacement_status",
                 "type" => "select_box",
                 "display_name_all" => "Displacement Status at time of report",
                 "option_strings_source" => "lookup DisplacementStatus"
                }),
    ]
    @form_gbv = FormSection.new(
      :unique_id => "form_section_test_gbv",
      :parent_form=>"case",
      "visible" => true,
      :order_form_group => 1,
      :order => 1,
      :order_subform => 0,
      :form_group_name => "Form Section Test GBV",
      "editable" => true,
      "name_all" => "Form Section Test GBV",
      "description_all" => "Form Section Test GBV",
      :fields => fields
    )
    @form_gbv.save!

    @primero_module_gbv = PrimeroModule.new(
      :program_id => "primeroprogram-primero",
      :id => "primeromodule-gbv",
      :name => "GBV",
      :description => "Gender Based Violence",
      :associated_record_types => ["case"],
      :associated_form_ids => [@form_gbv.unique_id]
    )
    @primero_module_gbv.save!

    @filters = {}
  end

  it "should not display filter 'Protection Status' for nonexistent field protection_status" do
    @current_user = User.new
    @current_user.should_receive(:modules).and_return([@primero_module_cp])
    FormSection.should_receive(:get_allowed_form_ids).with(@primero_module_cp, @current_user).and_call_original
    @current_user.should_receive(:permitted_form_ids).and_return([@form_cp.unique_id])
    FormSection.should_receive(:fields).with(:key => "protection_status").and_call_original
    render :partial => "children/filter", :locals => {:filters_to_show => index_filters_to_show("case")}
    rendered.should_not match(/<div class="filter"><h3>Protection Status:<\/h3>/)
  end

  it "should display filter 'Protection Status' for existent field protection_status" do
    fields = [
      Field.new({"name" => "protection_status",
                 "type" => "select_box",
                 "option_strings_source" => "lookup ProtectionStatus",
                 "display_name_all" => "Protection Status"
                })
    ]
    other_form_cp = FormSection.new(
      :unique_id => "other_form_section_test_cp",
      :parent_form=>"case",
      "visible" => true,
      :order_form_group => 1,
      :order => 1,
      :order_subform => 0,
      :form_group_name => "Form Section Test CP",
      "editable" => true,
      "name_all" => "Other Form Section Test CP",
      "description_all" => "Other Form Section Test CP",
      :fields => fields
    )
    other_form_cp.save!

    @primero_module_cp.associated_form_ids << other_form_cp.unique_id
    @primero_module_cp.save!

    @current_user = User.new
    @current_user.should_receive(:modules).and_return([@primero_module_cp])
    FormSection.should_receive(:get_allowed_form_ids).with(@primero_module_cp, @current_user).and_call_original
    @current_user.should_receive(:permitted_form_ids).and_return([@form_cp.unique_id, other_form_cp.unique_id])
    FormSection.should_receive(:fields).with(:key => "protection_status").and_call_original
    render :partial => "children/filter", :locals => {:filters_to_show => index_filters_to_show("case")}
    rendered.should match(/<div class="filter"><h3>Protection Status:<\/h3>/)
  end

  it "should display filter 'Displacement Status' for visible field gbv_displacement_status" do
    @is_gbv = true
    @current_user = User.new
    @current_user.should_receive(:modules).and_return([@primero_module_gbv])
    FormSection.should_receive(:get_allowed_form_ids).with(@primero_module_gbv, @current_user).and_call_original
    @current_user.should_receive(:permitted_form_ids).and_return([@form_gbv.unique_id])
    FormSection.should_receive(:fields).with(:key => "gbv_displacement_status").and_call_original

    #We need this one because there is other call.
    should_receive(:visible_filter_field?).with("gbv_displacement_status", "case").and_call_original

    #We need this one because this it is called no matter what and conflict with the one we want test
    should_receive(:visible_filter_field?).with("protection_status", "case").and_return(false)

    render :partial => "children/filter", :locals => {:filters_to_show => index_filters_to_show("case")}
    rendered.should match(/<div class="filter"><h3>Displacement Status:<\/h3>/)
  end

  it "should not display filter 'Displacement Status' for hidden field gbv_displacement_status" do
    @form_gbv.fields.first.visible = false
    @form_gbv.save!
    @is_gbv = true
    @current_user = User.new
    @current_user.should_receive(:modules).and_return([@primero_module_gbv])
    FormSection.should_receive(:get_allowed_form_ids).with(@primero_module_gbv, @current_user).and_call_original
    @current_user.should_receive(:permitted_form_ids).and_return([@form_gbv.unique_id])
    FormSection.should_receive(:fields).with(:key => "gbv_displacement_status").and_call_original

    #We need this one because there is other call.
    should_receive(:visible_filter_field?).with("gbv_displacement_status", "case").and_call_original

    #We need this one because this it is called no matter what and conflict with the one we want test
    should_receive(:visible_filter_field?).with("protection_status", "case").and_return(false)

    render :partial => "children/filter", :locals => {:filters_to_show => index_filters_to_show("case")}
    rendered.should_not match(/<div class="filter"><h3>Displacement Status:<\/h3>/)
  end

  it "should display filter 'Urgent Protection Concern' for visible field urgent_protection_concern" do
    @is_cp = true
    @current_user = User.new
    @current_user.should_receive(:modules).and_return([@primero_module_cp])
    FormSection.should_receive(:get_allowed_form_ids).with(@primero_module_cp, @current_user).and_call_original
    @current_user.should_receive(:permitted_form_ids).and_return([@form_cp.unique_id])
    FormSection.should_receive(:fields).with(:key => "urgent_protection_concern").and_call_original

    #We need this one because there is other call.
    should_receive(:visible_filter_field?).with("urgent_protection_concern", "case").and_call_original

    #We need this one because this it is called no matter what and conflict with the one we want test
    should_receive(:visible_filter_field?).with("protection_status", "case").and_return(false)

    render :partial => "children/filter", :locals => {:filters_to_show => index_filters_to_show("case")}
    rendered.should match(/<div class="filter"><h3>Urgent Protection Concern:<\/h3>/)
  end

  it "should not display filter 'Urgent Protection Concern' for hidden field urgent_protection_concern" do
    @form_cp.fields.first.visible = false
    @form_cp.save!
    @is_cp = true
    @current_user = User.new
    @current_user.should_receive(:modules).and_return([@primero_module_cp])
    FormSection.should_receive(:get_allowed_form_ids).with(@primero_module_cp, @current_user).and_call_original
    @current_user.should_receive(:permitted_form_ids).and_return([@form_cp.unique_id])
    FormSection.should_receive(:fields).with(:key => "urgent_protection_concern").and_call_original

    #We need this one because there is other call.
    should_receive(:visible_filter_field?).with("urgent_protection_concern", "case").and_call_original

    #We need this one because this it is called no matter what and conflict with the one we want test
    should_receive(:visible_filter_field?).with("protection_status", "case").and_return(false)

    render :partial => "children/filter", :locals => {:filters_to_show => index_filters_to_show("case")}
    rendered.should_not match(/<div class="filter"><h3>Urgent Protection Concern:<\/h3>/)
  end

end
