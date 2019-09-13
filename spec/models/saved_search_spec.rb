require 'rails_helper'

describe SavedSearch do
  describe "saved searches" do
    before :each do
      SavedSearch.all.each {|a| a.destroy}

      @saved_search = SavedSearch.create!(
                                name: "test",
                                record_type: "child",
                                user_name: "brucewayne",
                                filters: {
                                  "flag" => ["single", "flag"],
                                  "marked_for_mobile" => ["single", "true"],
                                  "owned_by_location1" => ["list", "LB7"],
                                  "approval_status" => {
                                    "approval_status_case_plan" => ["or_op", "pending"]
                                  },
                                  "status" => ["list", "open"],
                                  "record_state" => ["list", "true"]
                                })
    end

    describe "index" do
      it "should return all saved searches created by a user" do
        SavedSearch.where(user_name: "brucewayne").should_not be_empty
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
        SavedSearch.where(user_name: "brucewayne").should be_empty
      end
    end

    describe "add_filter" do
      it "should set the filter if no filters was defined" do
        saved_search = SavedSearch.new(
                                    name: "test filter",
                                    record_type: "child",
                                    user_name: "brucewayne")
        saved_search.add_filter("filter1", "value1")
        saved_search.save!
        expect(SavedSearch.find_by_id(saved_search.id).filters).to eq({"filter1" => "value1"})

      end

      it "should append the filter if filters was defined" do
        saved_search = SavedSearch.new(
                                    name: "test filter",
                                    record_type: "child",
                                    user_name: "brucewayne",
                                    filters: { filter1: "value1"})
        saved_search.add_filter("filter2", "value2")
        saved_search.save!
        expect(SavedSearch.find_by_id(saved_search.id).filters).to eq({"filter1" => "value1", "filter2" => "value2"})

      end
    end
  end
end
