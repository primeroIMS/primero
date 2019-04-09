require 'rails_helper'

describe ExportActions, type: :controller do

  controller(ApplicationController) do
    include ExportActions

    def model_class
      Child
    end
  end

  describe 'filter_fields_read_only_users' do

    before :each do
      FormSection.all.each &:destroy
      PrimeroModule.all.each &:destroy
      fields = [
        Field.new({"name" => "child_status",
                   "type" => "text_field",
                   "display_name_all" => "Child Status"
                  }),
        Field.new({"name" => "birth_date",
                   "type" => "text_field",
                   "display_name_all" => "Birth Date"
                  }),
        ## Shared field ##
        Field.new({"name" => "shared_field",
                   "type" => "text_field",
                   "display_name_all" => "Shared Field"
                  }),
        ## Will hide for readonly users.
        Field.new({"name" => "age",
                   "type" => "text_field",
                   "display_name_all" => "age",
                   "hide_on_view_page" => true
                  })
      ]
      form = FormSection.new(
        :unique_id => "form_section_test_1",
        :parent_form=>"case",
        "visible" => true,
        :order_form_group => 50,
        :order => 15,
        :order_subform => 0,
        "editable" => true,
        "name_all" => "Form Section Test 1",
        "description_all" => "Form Section Test 1",
        :fields => fields
      )
      form.save!

      @primero_module = PrimeroModule.create!(
        program_id: "primeroprogram-primero",
        name: "CP",
        description: "Child Protection",
        form_section_ids: ["form_section_test_1"],
        associated_record_types: ['case']
      )

      Child.refresh_form_properties

      @role = Role.new(
        :id=> "role-test", :name => "Test Role", :description => "Test Role",
        :group_permission => [],
        :form_sections => ["form_section_test_1", "form_section_test_4"]
      )

      @user = User.new(:user_name => 'fakeadmin', module_ids: [@primero_module.unique_id])

    end

    after :each do
      Child.remove_form_properties
    end

    it "discards fields that are hidden on view page for read only users" do
      case_permission = Permission.new(resource: Permission::CASE, actions: [Permission::READ])
      @role.permissions_list = [case_permission]
      @user.stub(:roles).and_return([@role])

      # since User is readonly, properties are now automatically filtered on that
      properties = Child.get_properties_by_module(@user, [@primero_module])
      filtered_properties = properties['primeromodule-cp']['form_section_test_1'].values.map(&:name)

      expect(filtered_properties.include?('age')).to be_falsey
    end

    it "keeps fields that are hidden on view page for users with edit permissions" do
      case_permission = Permission.new(resource: Permission::CASE, actions: [Permission::READ, Permission::WRITE, Permission::CREATE])
      @role.permissions_list = [case_permission]
      @user.stub(:roles).and_return([@role])

      # since User is readonly, properties are now automatically filtered on that
      properties = Child.get_properties_by_module(@user, [@primero_module])
      filtered_properties = properties['primeromodule-cp']['form_section_test_1'].values.map(&:name)

      expect(filtered_properties.include?('child_status')).to be_truthy
      expect(filtered_properties.include?('birth_date')).to be_truthy
      expect(filtered_properties.include?('shared_field')).to be_truthy
      expect(filtered_properties.include?('age')).to be_truthy
    end
  end
end
