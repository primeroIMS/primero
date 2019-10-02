require 'rails_helper'

describe SavedSearch do
  describe "saved searches" do
    before :each do
      [SavedSearch, Field, FormSection, Role, Agency, User, PrimeroModule, PrimeroProgram].each(&:destroy_all)

      @program = PrimeroProgram.create!(
        unique_id: "primeroprogram-primero",
        name: "Primero",
        description: "Default Primero Program"
      )

      @cp = PrimeroModule.create!(
        unique_id: 'primeromodule-cp',
        name: "CP",
        description: "Child Protection",
        associated_record_types: ["case", "tracing_request", "incident"],
        primero_program: @program,
        form_sections: [FormSection.create!(name: 'form_1')]
      )

      @role = Role.create!(
        name: 'Test Role 1',
        unique_id: "test-role-1",
        permissions: [
          Permission.new(
            :resource => Permission::CASE,
            :actions => [Permission::MANAGE]
          )
        ],
        modules: [@cp]
      )

      @agency_1 = Agency.create!(name: 'Agency 1', agency_code: 'agency1')

      @user_1 = User.create!(
        full_name: "Test User 1",
        user_name: 'test_user_1',
        password: 'a12345678',
        password_confirmation: 'a12345678',
        email: "test_user_1@localhost.com",
        agency_id: @agency_1.id,
        role: @role
      )

      @saved_search = SavedSearch.create!(
                                name: "test",
                                record_type: "child",
                                user: @user_1,
                                filters: [
                                  { "flag" => ["single", "flag"] },
                                  { "marked_for_mobile" => ["single", "true"] },
                                  { "owned_by_location1" => ["list", "LB7"] },
                                  { "child_status" => ["list", "open"] },
                                  { "record_state" => ["list", "true"] }
                                ])
    end

    describe "index" do
      it "should return all saved searches created by a user" do
        SavedSearch.where(user: @user_1).should_not be_empty
      end
    end

    describe "show" do
      it "should return specific saved search based on id" do
        SavedSearch.find_by_id(@saved_search.id).should_not be_nil
      end
    end

    describe "delete" do
      it "should delete saved search based on id" do
        @saved_search.destroy
        SavedSearch.where(user: @user_1).should be_empty
      end
    end

    describe "add_filter" do
      it "should set the filter if no filters were defined" do
        saved_search = SavedSearch.new(name: "test filter", record_type: "child", user: @user_1)
        saved_search.add_filter({ "filter1" => ["value1"] })
        saved_search.save!
        expect(SavedSearch.find_by_id(saved_search.id).filters).to eq([{ "filter1" => ["value1"] }])

      end

      it "should append the filter if filters was defined" do
        saved_search = SavedSearch.new(
                                    name: "test filter",
                                    record_type: "child",
                                    user: @user_1,
                                    filters: [{ "filter1" => ["value1"] }]
                                  )
        saved_search.add_filter({ "filter2" => ["value2"] })
        saved_search.save!
        search_filters = [{"filter1" => ["value1"]}, {"filter2" => ["value2"] }]
        expect(SavedSearch.find_by_id(saved_search.id).filters).to eq(search_filters)

      end
    end
  end
end
