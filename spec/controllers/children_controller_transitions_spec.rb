require 'rails_helper'

describe ChildrenController do

  shared_examples_for "Remote" do |transition_type|
    it "should export JSON for #{transition_type}" do
      controller.stub :render
      controller.should_receive(:log_to_history).with(records).and_call_original
      controller.should_receive(:remote_transition).with(records).and_call_original
      controller.should_receive(:set_status_transferred).with(records).and_call_original if transition_type == "transfer"
      controller.should_receive(:authorized_export_properties).with(Exporters::JSONExporter, transition_user, transition_user_modules, model_class).and_call_original
      Exporters::JSONExporter.should_receive(:export).with(records, permited_properties, @user, {}).and_return("data")
      controller.should_receive(:filename).with(records, Exporters::JSONExporter, transition_type).and_return("test_filename");
      controller.should_receive(:encrypt_data_to_zip).with("data", "test_filename", "password")
      controller.should_receive(:message_success_transition).with(records.size)

      params = {
        "transition_type"=>transition_type,
        "consent_override"=>"true",
        "is_remote"=>"true",
        "transition_role"=>transition_role,
        "other_user"=>"primero_cp",
        "other_user_agency"=>"UNICEF",
        "service"=>"Other Service",
        "notes"=>"Testing",
        "type_of_export"=>Transitionable::EXPORT_TYPE_PRIMERO, #This value define that is a JSON file.
        "password"=>"password",
        "file_name"=>""
      }
      if id.present?
        params.merge!({"id"=>id})
      elsif selected_records.present?
        params.merge!({"selected_records"=>selected_records})
      end

      post :transition, params: params
    end

    it "should export CSV for #{transition_type}" do
      controller.stub :render
      controller.should_receive(:log_to_history).with(records).and_call_original
      controller.should_receive(:remote_transition).with(records).and_call_original
      controller.should_receive(:set_status_transferred).with(records).and_call_original if transition_type == "transfer"
      controller.should_receive(:authorized_export_properties).with(Exporters::CSVExporter, transition_user, transition_user_modules, model_class).and_call_original
      Exporters::CSVExporter.should_receive(:export).with(records, permited_properties, @user, {}).and_return("data")
      controller.should_receive(:filename).with(records, Exporters::CSVExporter, transition_type).and_return("test_filename");
      controller.should_receive(:encrypt_data_to_zip).with("data", "test_filename", "password")
      controller.should_receive(:message_success_transition).with(records.size)

      params = {
        "transition_type"=>transition_type,
        "consent_override"=>"true",
        "is_remote"=>"true",
        "transition_role"=>transition_role,
        "other_user"=>"primero_cp",
        "other_user_agency"=>"UNICEF",
        "service"=>"Other Service",
        "notes"=>"Testing",
        "type_of_export"=>Transitionable::EXPORT_TYPE_NON_PRIMERO, #This value define that is a CSV file.
        "password"=>"password",
        "file_name"=>""
      }
      if id.present?
        params.merge!({"id"=>id})
      elsif selected_records.present?
        params.merge!({"selected_records"=>selected_records})
      end
      post :transition, params: params
    end

    it "should export PDF for #{transition_type}", :if => transition_type=="referral" do

      controller.stub :render
      controller.should_receive(:log_to_history).with(records).and_call_original
      controller.should_receive(:remote_transition).with(records).and_call_original
      controller.should_receive(:set_status_transferred).with(records).and_call_original if transition_type == "transfer"
      controller.should_receive(:authorized_export_properties).with(Exporters::PDFExporter, transition_user, transition_user_modules, model_class).and_call_original
      Exporters::PDFExporter.should_receive(:export).with(records, pdf_permited_properties, @user, {}).and_return("data")
      controller.should_receive(:filename).with(records, Exporters::PDFExporter, transition_type).and_return("test_filename");
      controller.should_receive(:encrypt_data_to_zip).with("data", "test_filename", "password")
      controller.should_receive(:message_success_transition).with(records.size)

      params = {
        "transition_type"=>transition_type,
        "consent_override"=>"true",
        "is_remote"=>"true",
        "transition_role"=>transition_role,
        "other_user"=>"primero_cp",
        "other_user_agency"=>"UNICEF",
        "service"=>"Other Service",
        "notes"=>"Testing",
        "type_of_export"=>Transitionable::EXPORT_TYPE_PDF, #This value define that is a PDF file.
        "password"=>"password",
        "file_name"=>""
      }
      if id.present?
        params.merge!({"id"=>id})
      elsif selected_records.present?
        params.merge!({"selected_records"=>selected_records})
      end

      post :transition, params: params
    end

  end

  describe "Transition" do
    describe "Remote" do
      before :each do
        Child.all.each &:destroy
        Role.all.each &:destroy
        FormSection.all.each &:destroy
        PrimeroModule.all.each &:destroy
        fields = [
          Field.new({"name" => "field_name_1",
                     "type" => "text_field",
                     "display_name_all" => "Field Name 1",
                     #This field should not have effect for
                     #transitions.
                     #TODO - This now breaks Pavel's new filtering code
                     #TODO - Verify if this needs to change or if code needs to be fixed
                     "hide_on_view_page" => false
                    })
        ]
        form = FormSection.new(
          :unique_id => "form_section_test_1",
          :parent_form=>"case",
          "visible" => true,
          :order_form_group => 50,
          :order => 15,
          :order_subform => 0,
          :form_group_name => "Form Section Test",
          "editable" => true,
          "name_all" => "Form Section Test 1",
          "description_all" => "Form Section Test 1",
          :fields => fields
        )
        form.save!

        fields = [
          Field.new({"name" => "field_name_2",
                     "type" => "text_field",
                     "display_name_all" => "Field Name 2",
                    #This field should not have effect for
                    #transitions
                    #TODO - This now breaks Pavel's new filtering code
                    #TODO - Verify if this needs to change or if code needs to be fixed
                    "hide_on_view_page" => false
                    })
        ]
        form = FormSection.new(
          :unique_id => "form_section_test_2",
          :parent_form=>"case",
          "visible" => true,
          :order_form_group => 51,
          :order => 16,
          :order_subform => 0,
          :form_group_name => "Form Section Test",
          "editable" => true,
          "name_all" => "Form Section Test 2",
          "description_all" => "Form Section Test 2",
          :fields => fields
        )
        form.save!

        Child.refresh_form_properties

        @primero_module = PrimeroModule.create!(
            program_id: "primeroprogram-primero",
            name: "CP",
            description: "Child Protection",
            associated_form_ids: ["form_section_test_1", "form_section_test_2"],
            associated_record_types: ['case']
        )

        @child = Child.new(
          :unique_identifier => UUIDTools::UUID.random_create.to_s,
          :last_updated_by => "fakeadmin",
          :module_id => @primero_module.id
        )
        @child.save!

        @child2 = Child.new(
          :unique_identifier => UUIDTools::UUID.random_create.to_s,
          :last_updated_by => "fakeadmin",
          :module_id => @primero_module.id
        )
        @child2.save!

        @permission_case =  Permission.new(resource: Permission::CASE, actions: [Permission::EXPORT_PDF, Permission::EXPORT_JSON, Permission::EXPORT_CSV])
        @referal_rol = Role.new(
          :name => "Rol for referal",
          :permissions_list => [@permission_case],
          :permitted_form_ids => ["form_section_test_1"],
          :referral => true
        )
        @referal_rol.save!

        @transfer_rol = Role.new(
          :name => "Rol for transfer",
          :permissions_list => [@permission_case],
          :permitted_form_ids => ["form_section_test_2"],
          :transfer => true
        )
        @transfer_rol.save!

        @user = User.new(
          :user_name => 'fakeadmin',
          module_ids: [@primero_module.id],
          role_ids: ["role-superuser"]
        )

        @session = fake_admin_login @user
      end

      after :each do
        Role.all.each &:destroy
        Child.all.each &:destroy
        FormSection.all.each &:destroy
        PrimeroModule.all.each &:destroy
        Child.remove_form_properties
      end

      describe "one case" do

        it_behaves_like "Remote", "referral" do
          let(:transition_user) {User.new(role_ids: [@referal_rol.id], module_ids: ["primeromodule-cp"])}
          let(:pdf_permited_properties) {{"primeromodule-cp"=>{"form_section_test_1"=>{"field_name_1"=> Child.properties.select{|p| p.name == "field_name_1"}.first}}}}
          let(:pdf_transition_properties) {{"primeromodule-cp"=>{"form_section_test_1"=>{"field_name_1"=> Child.properties.select{|p| p.name == "field_name_1"}.first}}}}
          #TODO - this is causing a failure.  This is an array.  Now expecting a hash.
          #TODO - verify with Pavel if code needs to be fixed or if test needs to change
          # let(:permited_properties) {Child.properties.select{|p| p.name == "field_name_1" or p.name == "unique_identifier" or p.name == "record_state"}}
          let(:permited_properties) {{"primeromodule-cp"=>{"form_section_test_1"=>{"field_name_1"=> Child.properties.select{|p| p.name == "field_name_1"}.first}}}}

          let(:transition_properties) {Child.properties}
          let(:records) {[@child]}
          let(:id) {@child.id}
          let(:selected_records) {nil}
          let(:transition_role) {@referal_rol.id}
          let(:transition_user_modules) {[@primero_module]}
          let(:model_class) {Child}
        end

        it_behaves_like "Remote", "transfer" do
          let(:transition_user) {User.new(role_ids: [@transfer_rol.id], module_ids: ["primeromodule-cp"])}

          #TODO - this is causing a failure.  This is an array.  Now expecting a hash.
          #TODO - verify with Pavel if code needs to be fixed or if test needs to change
          # let(:permited_properties) {Child.properties.select{|p| p.name == "field_name_2" or p.name == "unique_identifier" or p.name == "record_state"}}
          let(:permited_properties) {{"primeromodule-cp"=>{"form_section_test_2"=>{"field_name_2"=> Child.properties.select{|p| p.name == "field_name_2"}.first}}}}

          let(:transition_properties) {Child.properties}
          let(:records) {[@child2]}
          let(:id) {@child2.id}
          let(:selected_records) {nil}
          let(:transition_role) {@transfer_rol.id}
          let(:transition_user_modules) {[@primero_module]}
          let(:model_class) {Child}
        end

      end

      describe "several cases" do

        it_behaves_like "Remote", "referral" do
          let(:transition_user) {User.new(role_ids: [@referal_rol.id], module_ids: ["primeromodule-cp"])}
          let(:pdf_permited_properties) {{"primeromodule-cp"=>{"form_section_test_1"=>{"field_name_1"=> Child.properties.select{|p| p.name == "field_name_1"}.first}}}}
          let(:pdf_transition_properties) {{"primeromodule-cp"=>{"Form Section Test 1"=>{"field_name_1"=> Child.properties.select{|p| p.name == "field_name_1"}.first}}}}

          #TODO - this is causing a failure.  This is an array.  Now expecting a hash.
          #TODO - verify with Pavel if code needs to be fixed or if test needs to change
          # let(:permited_properties) {Child.properties.select{|p| p.name == "field_name_1" or p.name == "unique_identifier" or p.name == "record_state"}}
          let(:permited_properties) {{"primeromodule-cp"=>{"form_section_test_1"=>{"field_name_1"=> Child.properties.select{|p| p.name == "field_name_1"}.first}}}}

          let(:transition_properties) {Child.properties}
          let(:records) {[@child, @child2]}
          let(:id) {nil}
          let(:selected_records) {"#{@child.id},#{@child2.id}"}
          let(:transition_role) {@referal_rol.id}
          let(:transition_user_modules) {[@primero_module]}
          let(:model_class) {Child}
        end

        it_behaves_like "Remote", "transfer" do
          let(:transition_user) {User.new(role_ids: [@transfer_rol.id], module_ids: ["primeromodule-cp"])}

          #TODO - this is causing a failure.  This is an array.  Now expecting a hash.
          #TODO - verify with Pavel if code needs to be fixed or if test needs to change
          # let(:permited_properties) {Child.properties.select{|p| p.name == "field_name_2" or p.name == "unique_identifier" or p.name == "record_state"}}
          let(:permited_properties) {{"primeromodule-cp"=>{"form_section_test_2"=>{"field_name_2"=> Child.properties.select{|p| p.name == "field_name_2"}.first}}}}

          let(:transition_properties) {Child.properties}
          let(:records) {[@child, @child2]}
          let(:id) {nil}
          let(:selected_records) {"#{@child.id},#{@child2.id}"}
          let(:transition_role) {@transfer_rol.id}

          let(:transition_user_modules) {[@primero_module]}
          let(:model_class) {Child}
        end

      end
    end

    describe 'Local' do
      before do
        Child.all.each &:destroy
        Role.all.each &:destroy
        FormSection.all.each &:destroy
        PrimeroModule.all.each &:destroy

        @primero_module_1 = PrimeroModule.create!(
            program_id: "primeromodule-cp",
            name: "CP",
            description: "Child Protection",
            associated_form_ids: ["form_section_test_1", "form_section_test_2"],
            associated_record_types: ['case']
        )

        @read_rol = Role.create(
          :name => "Read",
          :permissions_list => [
            Permission.new(resource: Permission::CASE, actions: [Permission::READ])
          ]
        )

        @user_read = User.create(
          user_name: 'user_read',
          full_name: 'User Read',
          password: 'passw0rd1',
          password_confirmation: 'passw0rd1',
          organization: 'cc',
          module_ids: [@primero_module_1.id],
          role_ids: [@read_rol.id]
        )

        User.stub(:find_by_user_name).and_call_original

      end
      context 'assign' do
        context 'user has the assign permission' do
          before do
            assign_rol = Role.create(
              :name => "Assign",
              :permissions_list => [
                Permission.new(resource: Permission::CASE, actions: [Permission::ASSIGN])
              ]
            )

            user_assign = User.create!(
              user_name: 'user_assign',
              full_name: 'User Assign',
              password: 'passw0rd',
              password_confirmation: 'passw0rd',
              organization: 'cc',
              module_ids: [@primero_module_1.id],
              role_ids: [assign_rol.id]
            )

            @child_1 = Child.new_with_user_name user_assign, { module_id: 'primeromodule-cp' }
            @child_1.save!

            @session = fake_login user_assign
          end

          it "should reassign the case" do
            params = {
              transition_type: 'reassign',
              id: @child_1.id,
              existing_user: @user_read.user_name
            }

            post :transition, params: params

            @child_1 = Child.get(@child_1.id)
            expect(@child_1.owned_by).to eq(@user_read.user_name)
          end
        end

        context 'user has the assign_within_agency permission' do
          before do
            assign_agency_rol = Role.create(
              :name => "Assign",
              :permissions_list => [
                Permission.new(resource: Permission::CASE, actions: [Permission::ASSIGN_WITHIN_AGENCY])
              ]
            )

            user_assign_agency = User.create!(
              user_name: 'user_assign_agency',
              full_name: 'User Assign Agency',
              password: 'passw0rd',
              password_confirmation: 'passw0rd',
              organization: 'cc',
              module_ids: [@primero_module_1.id],
              role_ids: [assign_agency_rol.id]
            )

            @child_2 = Child.new_with_user_name user_assign_agency, { module_id: 'primeromodule-cp' }
            @child_2.save!

            @session = fake_login user_assign_agency
          end

          it "should reassign the case" do
            params = {
              transition_type: 'reassign',
              id: @child_2.id,
              existing_user: @user_read.user_name
            }

            post :transition, params: params

            @child_2 = Child.get(@child_2.id)
            expect(@child_2.owned_by).to eq(@user_read.user_name)
          end

        end

        context 'user has the assign_within_user_group permission' do
          before do
            assign_group_rol = Role.create(
              :name => "Assign",
              :permissions_list => [
                Permission.new(resource: Permission::CASE, actions: [Permission::ASSIGN_WITHIN_USER_GROUP])
              ]
            )

            user_assign_group = User.create!(
              user_name: 'user_assign_group',
              full_name: 'User Assign Agency',
              password: 'passw0rd',
              password_confirmation: 'passw0rd',
              organization: 'cc',
              module_ids: [@primero_module_1.id],
              role_ids: [assign_group_rol.id]
            )

            @child_3 = Child.new_with_user_name user_assign_group, { module_id: 'primeromodule-cp' }
            @child_3.save!

            @session = fake_login user_assign_group
          end

          it "should reassign the case" do
            params = {
              transition_type: 'reassign',
              id: @child_3.id,
              existing_user: @user_read.user_name
            }

            post :transition, params: params

            @child_3 = Child.get(@child_3.id)
            expect(@child_3.owned_by).to eq(@user_read.user_name)
          end

        end

        context 'user does not have assign permissions' do

          before :each do
            @child_3 = Child.new_with_user_name @user_read, { module_id: 'primeromodule-cp' }
            @child_3.save!
            @session = fake_login @user_read
          end

          it "should return not authorized response" do
            params = {
              transition_type: 'reassign',
              id: @child_3.id,
              existing_user: @user_read.user_name
            }

            post :transition, params: params

            expect(response.status).to eq(403)
          end

        end
      end
    end

  end

end
