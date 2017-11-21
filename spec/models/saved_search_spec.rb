require 'rails_helper'

describe SavedSearch do
  describe "saved searches" do
    before :each do
      SavedSearch.all.each {|a| a.destroy}

      @saved_search = SavedSearch.create!(
        "id" => "123123123",
        "name" => "test",
        "filter" => {
          "flag" => ["single", "flag"],
          "marked_for_mobile" => ["single", "true"],
          "owned_by_location1" => ["list", "LB7"],
          "approval_status" => {
            "approval_status_case_plan" => ["or_op", "pending"]
          },
          "child_status" => ["list", "open"],
          "record_state" => ["list", "true"]
        },
        "record_type" => "child",
        "action"=>"create",
        "user_name" => "brucewayne",
        "controller" => "saved_searches")
    end

    describe "index" do
      it "should return all saved searches created by a user" do
        SavedSearch.by_user_name(key: "brucewayne").all.should_not be_empty
      end
    end

    describe "show" do
      it "should return specific saved search based on id" do
        SavedSearch.get("123123123").should_not be_empty
      end
    end

    describe "delete" do
      it "should delete saved search based on id" do
        @saved_search.destroy
        SavedSearch.by_user_name(key: "brucewayne").should be_empty
      end
    end
  end
end