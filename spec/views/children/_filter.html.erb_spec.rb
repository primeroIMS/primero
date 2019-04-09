require 'rails_helper'
require 'index_helper'

include IndexHelper

describe "children/_filter.html.erb" do
  before :each do
    @age_ranges = []
    @inactive_range = "01-Sep-2016.20-Oct-2016"
    @agency_offices = []

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
      :form_section_ids => [@form_cp.unique_id]
    )
    @primero_module_cp.save!
    @current_modules = [@primero_module_cp]

    fields = [
      Field.new({"name" => "gbv_displacement_status",
                 "type" => "select_box",
                 "display_name_all" => "Displacement Status at time of report",
                 "option_strings_source" => "lookup lookup-displacement-status"
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
      :form_section_ids => [@form_gbv.unique_id]
    )
    @primero_module_gbv.save!

    @filters = {}

    @fields_filter = ["gbv_displacement_status", "protection_status", "urgent_protection_concern", "protection_concerns", "type_of_risk"]
  end

  it "should not display filter 'Protection Status' for nonexistent field protection_status" do
    @current_user = User.new
    @current_user.should_receive(:modules).and_return([@primero_module_cp])
    FormSection.should_receive(:get_allowed_form_ids).with(@primero_module_cp, @current_user).and_call_original
    @current_user.should_receive(:permitted_form_ids).and_return([@form_cp.unique_id])
    controller.stub(:current_user).and_return(@current_user)
    render :partial => "children/filter", :locals => {:filters_to_show => index_filters_to_show("case")}
    rendered.should_not match(/<div class="filter"><h3>Protection Status:<\/h3>/)
  end

  it "should display filter 'Protection Status' for existent field protection_status" do
    fields = [
      Field.new({"name" => "protection_status",
                 "type" => "select_box",
                 "option_strings_source" => "lookup lookup-protection-status",
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

    @primero_module_cp.form_section_ids << other_form_cp.unique_id
    @primero_module_cp.save!

    @current_user = User.new
    @current_user.should_receive(:modules).and_return([@primero_module_cp])
    FormSection.should_receive(:get_allowed_form_ids).with(@primero_module_cp, @current_user).and_call_original
    @current_user.should_receive(:permitted_form_ids).and_return([@form_cp.unique_id, other_form_cp.unique_id])
    controller.stub(:current_user).and_return(@current_user)
    render :partial => "children/filter", :locals => {:filters_to_show => index_filters_to_show("case")}
    rendered.should match(/<div class="filter"><h3>Protection Status:<\/h3>/)
  end

  it "should display filter 'Displacement Status' for visible field gbv_displacement_status" do
    @is_gbv = true
    @current_user = User.new
    @current_user.should_receive(:modules).and_return([@primero_module_gbv], [@primero_module_gbv])
    FormSection.should_receive(:get_allowed_form_ids).with(@primero_module_gbv, @current_user).and_call_original
    @current_user.should_receive(:permitted_form_ids).and_return([@form_gbv.unique_id])
    controller.stub(:current_user).and_return(@current_user)

    #We need this one because there is other call.
    should_receive(:visible_filter_field?).with("gbv_displacement_status").and_call_original

    #We need this one because this it is called no matter what and conflict with the one we want test
    should_receive(:visible_filter_field?).with("protection_status").and_return(false)

    render :partial => "children/filter", :locals => {:filters_to_show => index_filters_to_show("case")}
    rendered.should match(/<div class="filter"><h3>Displacement Status:<\/h3>/)
  end

  it "should not display filter 'Displacement Status' for hidden field gbv_displacement_status" do
    @form_gbv.fields.first.visible = false
    @form_gbv.save!
    @is_gbv = true
    @current_user = User.new
    @current_user.should_receive(:modules).and_return([@primero_module_gbv], [@primero_module_gbv])
    FormSection.should_receive(:get_allowed_form_ids).with(@primero_module_gbv, @current_user).and_call_original
    @current_user.should_receive(:permitted_form_ids).and_return([@form_gbv.unique_id])
    controller.stub(:current_user).and_return(@current_user)

    #We need this one because there is other call.
    should_receive(:visible_filter_field?).with("gbv_displacement_status").and_call_original

    #We need this one because this it is called no matter what and conflict with the one we want test
    should_receive(:visible_filter_field?).with("protection_status").and_return(false)

    render :partial => "children/filter", :locals => {:filters_to_show => index_filters_to_show("case")}
    rendered.should_not match(/<div class="filter"><h3>Displacement Status:<\/h3>/)
  end

  it "should display filter 'Urgent Protection Concern' for visible field urgent_protection_concern" do
    @is_cp = true
    @current_user = User.new
    @current_user.should_receive(:modules).and_return([@primero_module_cp])
    FormSection.should_receive(:get_allowed_form_ids).with(@primero_module_cp, @current_user).and_call_original
    @current_user.should_receive(:permitted_form_ids).and_return([@form_cp.unique_id])
    controller.stub(:current_user).and_return(@current_user)

    #We need this one because there is other call.
    should_receive(:visible_filter_field?).with("urgent_protection_concern").and_call_original

    #We need this one because this it is called no matter what and conflict with the one we want test
    should_receive(:visible_filter_field?).with("protection_status").and_return(false)
    should_receive(:visible_filter_field?).with("type_of_risk").and_return(false)

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
    controller.stub(:current_user).and_return(@current_user)

    #We need this one because there is other call.
    should_receive(:visible_filter_field?).with("urgent_protection_concern").and_call_original

    #We need this one because this it is called no matter what and conflict with the one we want test
    should_receive(:visible_filter_field?).with("protection_status").and_return(false)
    should_receive(:visible_filter_field?).with("type_of_risk").and_return(false)

    render :partial => "children/filter", :locals => {:filters_to_show => index_filters_to_show("case")}
    rendered.should_not match(/<div class="filter"><h3>Urgent Protection Concern:<\/h3>/)
  end

  it "should display filter 'Type of Risk' for visible field type_of_risk" do
    @is_cp = true
    @current_user = User.new
    @current_user.should_receive(:modules).and_return([@primero_module_cp])
    FormSection.should_receive(:get_allowed_form_ids).with(@primero_module_cp, @current_user).and_call_original
    @current_user.should_receive(:permitted_form_ids).and_return([@form_cp.unique_id])
    controller.stub(:current_user).and_return(@current_user)

    #We need this one because there is other call.
    should_receive(:visible_filter_field?).with("type_of_risk").and_return(true)

    #We need this one because this it is called no matter what and conflict with the one we want test
    should_receive(:visible_filter_field?).with("protection_status").and_return(false)
    should_receive(:visible_filter_field?).with("urgent_protection_concern").and_return(false)

    render :partial => "children/filter", :locals => {:filters_to_show => index_filters_to_show("case")}
    rendered.should match(/<div class="filter"><h3>Type of Risk:<\/h3>/)
  end

  it "should not display filter 'Type of Risk' for hidden field urgent_protection_concern" do
    @form_cp.fields.first.visible = false
    @form_cp.save!
    @is_cp = true
    @current_user = User.new
    @current_user.should_receive(:modules).and_return([@primero_module_cp])
    FormSection.should_receive(:get_allowed_form_ids).with(@primero_module_cp, @current_user).and_call_original
    @current_user.should_receive(:permitted_form_ids).and_return([@form_cp.unique_id])
    controller.stub(:current_user).and_return(@current_user)


    should_receive(:visible_filter_field?).with("urgent_protection_concern").and_return(false)
    should_receive(:visible_filter_field?).with("protection_status").and_return(false)
    should_receive(:visible_filter_field?).with("type_of_risk").and_return(false)

    render :partial => "children/filter", :locals => {:filters_to_show => index_filters_to_show("case")}
    rendered.should_not match(/<div class="filter"><h3>Urgent Protection Concern:<\/h3>/)
  end

  it "should display filter 'Protection Concerns' for existent field protection_concerns" do
    fields = [
      Field.new({"name" => "protection_concerns",
                 "type" => "select_box",
                 "multi_select" => true,
                 "option_strings_source" => "lookup ProtectionConcernsSierraLeone",
                 "display_name_all" => "Protection Concerns"
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
    @can_view_protection_concerns_filter = true
    @primero_module_cp.form_section_ids << other_form_cp.unique_id
    @primero_module_cp.save!
    @current_user = User.new
    @current_user.should_receive(:modules).and_return([@primero_module_cp])
    FormSection.should_receive(:get_allowed_form_ids).with(@primero_module_cp, @current_user).and_call_original
    @current_user.should_receive(:permitted_form_ids).and_return([@form_cp.unique_id, other_form_cp.unique_id])
    controller.stub(:current_user).and_return(@current_user)
    render :partial => "children/filter", :locals => {:filters_to_show => index_filters_to_show("case")}
    rendered.should match(/<div class="filter"><h3>Protection Concerns:<\/h3>/)
  end

  it "should not display filters if has no access to forms" do
    @is_cp = true
    @is_gbv = true
    @current_user = User.new
    @current_user.should_receive(:modules).and_return([], [])
    FormSection.should_not_receive(:get_allowed_form_ids)
    @current_user.should_not_receive(:permitted_form_ids)
    controller.stub(:current_user).and_return(@current_user)
    should_receive(:visible_filter_field?).with("gbv_displacement_status").and_call_original
    should_receive(:visible_filter_field?).with("protection_status").and_call_original
    should_receive(:visible_filter_field?).with("urgent_protection_concern").and_call_original
    should_receive(:visible_filter_field?).with("type_of_risk").and_call_original
    render :partial => "children/filter", :locals => {:filters_to_show => index_filters_to_show("case")}
    rendered.should_not match(/<div class="filter"><h3>Protection Status:<\/h3>/)
    rendered.should_not match(/<div class="filter"><h3>Displacement Status:<\/h3>/)
    rendered.should_not match(/<div class="filter"><h3>Urgent Protection Concern:<\/h3>/)
    rendered.should_not match(/<div class="filter"><h3>Protection Concerns:<\/h3>/)
  end

  describe "Agency filter" do
    before do
      @current_user = User.new
      @current_user.should_receive(:modules).and_return([@primero_module_cp])
      FormSection.should_receive(:get_allowed_form_ids).with(@primero_module_cp, @current_user).and_call_original
      @current_user.should_receive(:permitted_form_ids).and_return([@form_cp.unique_id])
      controller.stub(:current_user).and_return(@current_user)
      @associated_users = ["test_user_1", "test_user_2", "test_user_3"]
      @options_reporting_locations = ["Country1::Region1::District 1", "Country1::Region1::District 2", "Country2::Region2::District 3"]
    end

    context 'when user is not a manager or an admin' do
      it 'should not display the Agency filter' do
        @is_manager = false
        @is_admin = false
        render :partial => "children/filter", :locals => {:filters_to_show => index_filters_to_show("case")}
        rendered.should_not match(/<div class="filter"><h3>Agency:<\/h3>/)
      end
    end

    context 'when user is a manager' do
      before :each do
        @is_manager = true
        @is_admin = false
      end
      context 'when user has no associated Agencies' do
        it 'should not display the Agency filter' do
          @associated_agencies = []
          render :partial => "children/filter", :locals => {:filters_to_show => index_filters_to_show("case")}
          rendered.should_not match(/<div class="filter"><h3>Agency:<\/h3>/)
        end
      end

      context 'when user has only 1 associated Agency' do
        it 'should not display the Agency filter' do
          @associated_agencies = [{"agency-unicef"=>"UNICEF"}]
          render :partial => "children/filter", :locals => {:filters_to_show => index_filters_to_show("case")}
          rendered.should_not match(/<div class="filter"><h3>Agency:<\/h3>/)
        end

      end

      context 'when user has more than 1 associated Agency' do
        it 'should display the Agency filter' do
          @associated_agencies = [{"agency-unicef"=>"UNICEF"}, {"agency-greenlife-west-africa"=>"GreenLife West Africa"}]
          render :partial => "children/filter", :locals => {:filters_to_show => index_filters_to_show("case")}
          rendered.should match(/<div class="filter"><h3>Agency:<\/h3>/)
        end
      end
    end

    context 'when user is an admin' do
      before :each do
        @is_manager = false
        @is_admin = true
      end
      context 'when user has no associated Agencies' do
        it 'should not display the Agency filter' do
          @associated_agencies = []
          render :partial => "children/filter", :locals => {:filters_to_show => index_filters_to_show("case")}
          rendered.should_not match(/<div class="filter"><h3>Agency:<\/h3>/)
        end
      end

      context 'when user has only 1 associated Agency' do
        it 'should not display the Agency filter' do
          @associated_agencies = [{"agency-unicef"=>"UNICEF"}]
          render :partial => "children/filter", :locals => {:filters_to_show => index_filters_to_show("case")}
          rendered.should_not match(/<div class="filter"><h3>Agency:<\/h3>/)
        end

      end

      context 'when user has more than 1 associated Agency' do
        it 'should display the Agency filter' do
          @associated_agencies = [{"agency-unicef"=>"UNICEF"}, {"agency-greenlife-west-africa"=>"GreenLife West Africa"}]
          render :partial => "children/filter", :locals => {:filters_to_show => index_filters_to_show("case")}
          rendered.should match(/<div class="filter"><h3>Agency:<\/h3>/)
        end
      end
    end
  end

  describe 'Approvals filters' do
    before :each do
      @current_user = User.new
      @current_user.should_receive(:modules).and_return([@primero_module_cp])
      controller.stub(:current_user).and_return(@current_user)
      @can_approval_bia = true
      @can_approvals = true
    end

    context 'when case plan, closure, or bia forms are not present' do
      before :each do
        FormSection.should_receive(:get_allowed_form_ids).and_return(['cp_test_form'])
      end
      it 'does not display the Pending Approvals filter' do
        render :partial => "children/filter", :locals => {:filters_to_show => index_filters_to_show("case")}
        expect(rendered).not_to match(/<div class="filter"><h3>Pending Approvals<\/h3>/)
      end

      it 'does not display the Approved filter' do
        render :partial => "children/filter", :locals => {:filters_to_show => index_filters_to_show("case")}
        expect(rendered).not_to match(/<div class="filter"><h3>Approved<\/h3>/)
      end

      it 'does not display the Rejected filter' do
        render :partial => "children/filter", :locals => {:filters_to_show => index_filters_to_show("case")}
        expect(rendered).not_to match(/<div class="filter"><h3>Rejected<\/h3>/)
      end
    end

    context 'when case plan form is present' do
      before :each do
        FormSection.should_receive(:get_allowed_form_ids).and_return(['cp_case_plan'])
      end

      it 'displays the Pending Approvals filter' do
        render :partial => "children/filter", :locals => {:filters_to_show => index_filters_to_show("case")}
        expect(rendered).to match(/<div class="filter"><h3>Pending Approvals<\/h3>/)
      end

      it 'displays the Approved filter' do
        render :partial => "children/filter", :locals => {:filters_to_show => index_filters_to_show("case")}
        expect(rendered).to match(/<div class="filter"><h3>Approved<\/h3>/)
      end

      it 'displays the Rejected filter' do
        render :partial => "children/filter", :locals => {:filters_to_show => index_filters_to_show("case")}
        expect(rendered).to match(/<div class="filter"><h3>Rejected<\/h3>/)
      end

      context 'but user does not have approval access' do
        before :each do
          @can_approval_bia = false
          @can_approval_case_plan = false
          @can_approval_closure = false
          @can_approvals = false
        end

        it 'does not display the Pending Approvals filter' do
          render :partial => "children/filter", :locals => {:filters_to_show => index_filters_to_show("case")}
          expect(rendered).not_to match(/<div class="filter"><h3>Pending Approvals<\/h3>/)
        end

        it 'does not display the Approved filter' do
          render :partial => "children/filter", :locals => {:filters_to_show => index_filters_to_show("case")}
          expect(rendered).not_to match(/<div class="filter"><h3>Approved<\/h3>/)
        end

        it 'does not display the Rejected filter' do
          render :partial => "children/filter", :locals => {:filters_to_show => index_filters_to_show("case")}
          expect(rendered).not_to match(/<div class="filter"><h3>Rejected<\/h3>/)
        end
      end
    end

    context 'when closure form is present' do
      before :each do
        FormSection.should_receive(:get_allowed_form_ids).and_return(['closure_form'])
      end

      it 'displays the Pending Approvals filter' do
        render :partial => "children/filter", :locals => {:filters_to_show => index_filters_to_show("case")}
        expect(rendered).to match(/<div class="filter"><h3>Pending Approvals<\/h3>/)
      end

      it 'displays the Approved filter' do
        render :partial => "children/filter", :locals => {:filters_to_show => index_filters_to_show("case")}
        expect(rendered).to match(/<div class="filter"><h3>Approved<\/h3>/)
      end

      it 'displays the Rejected filter' do
        render :partial => "children/filter", :locals => {:filters_to_show => index_filters_to_show("case")}
        expect(rendered).to match(/<div class="filter"><h3>Rejected<\/h3>/)
      end

      context 'but user does not have approval access' do
        before :each do
          @can_approval_bia = false
          @can_approval_case_plan = false
          @can_approval_closure = false
          @can_approvals = false
        end

        it 'does not display the Pending Approvals filter' do
          render :partial => "children/filter", :locals => {:filters_to_show => index_filters_to_show("case")}
          expect(rendered).not_to match(/<div class="filter"><h3>Pending Approvals<\/h3>/)
        end

        it 'does not display the Approved filter' do
          render :partial => "children/filter", :locals => {:filters_to_show => index_filters_to_show("case")}
          expect(rendered).not_to match(/<div class="filter"><h3>Approved<\/h3>/)
        end

        it 'does not display the Rejected filter' do
          render :partial => "children/filter", :locals => {:filters_to_show => index_filters_to_show("case")}
          expect(rendered).not_to match(/<div class="filter"><h3>Rejected<\/h3>/)
        end
      end
    end

    context 'when bia form is present' do
      before :each do
        FormSection.should_receive(:get_allowed_form_ids).and_return(['cp_bia_form'])
      end

      it 'displays the Pending Approvals filter' do
        render :partial => "children/filter", :locals => {:filters_to_show => index_filters_to_show("case")}
        expect(rendered).to match(/<div class="filter"><h3>Pending Approvals<\/h3>/)
      end

      it 'displays the Approved filter' do
        render :partial => "children/filter", :locals => {:filters_to_show => index_filters_to_show("case")}
        expect(rendered).to match(/<div class="filter"><h3>Approved<\/h3>/)
      end

      it 'displays the Rejected filter' do
        render :partial => "children/filter", :locals => {:filters_to_show => index_filters_to_show("case")}
        expect(rendered).to match(/<div class="filter"><h3>Rejected<\/h3>/)
      end

      context 'but user does not have approval access' do
        before :each do
          @can_approval_bia = false
          @can_approval_case_plan = false
          @can_approval_closure = false
          @can_approvals = false
        end

        it 'does not display the Pending Approvals filter' do
          render :partial => "children/filter", :locals => {:filters_to_show => index_filters_to_show("case")}
          expect(rendered).not_to match(/<div class="filter"><h3>Pending Approvals<\/h3>/)
        end

        it 'does not display the Approved filter' do
          render :partial => "children/filter", :locals => {:filters_to_show => index_filters_to_show("case")}
          expect(rendered).not_to match(/<div class="filter"><h3>Approved<\/h3>/)
        end

        it 'does not display the Rejected filter' do
          render :partial => "children/filter", :locals => {:filters_to_show => index_filters_to_show("case")}
          expect(rendered).not_to match(/<div class="filter"><h3>Rejected<\/h3>/)
        end
      end
    end

    context 'when case plan, closure, and bia forms are present' do
      before :each do
        FormSection.should_receive(:get_allowed_form_ids).and_return(['cp_case_plan', 'closure_form', 'cp_bia_form'])
      end

      it 'displays the Pending Approvals filter' do
        render :partial => "children/filter", :locals => {:filters_to_show => index_filters_to_show("case")}
        expect(rendered).to match(/<div class="filter"><h3>Pending Approvals<\/h3>/)
      end

      it 'displays the Approved filter' do
        render :partial => "children/filter", :locals => {:filters_to_show => index_filters_to_show("case")}
        expect(rendered).to match(/<div class="filter"><h3>Approved<\/h3>/)
      end

      it 'displays the Rejected filter' do
        render :partial => "children/filter", :locals => {:filters_to_show => index_filters_to_show("case")}
        expect(rendered).to match(/<div class="filter"><h3>Rejected<\/h3>/)
      end

      context 'but user does not have approval access' do
        before :each do
          @can_approval_bia = false
          @can_approval_case_plan = false
          @can_approval_closure = false
          @can_approvals = false
        end

        it 'does not display the Pending Approvals filter' do
          render :partial => "children/filter", :locals => {:filters_to_show => index_filters_to_show("case")}
          expect(rendered).not_to match(/<div class="filter"><h3>Pending Approvals<\/h3>/)
        end

        it 'does not display the Approved filter' do
          render :partial => "children/filter", :locals => {:filters_to_show => index_filters_to_show("case")}
          expect(rendered).not_to match(/<div class="filter"><h3>Approved<\/h3>/)
        end

        it 'does not display the Rejected filter' do
          render :partial => "children/filter", :locals => {:filters_to_show => index_filters_to_show("case")}
          expect(rendered).not_to match(/<div class="filter"><h3>Rejected<\/h3>/)
        end
      end
    end
  end

end
