require 'spec_helper'

describe IndexHelper do
  before do
    @view = Object.new
    @view.extend(IndexHelper)
  end

  context "Viewing cases"  do
    context "when CP" do
      before :each do
        @view.instance_variable_set(:@is_cp, true)
        @view.instance_variable_set(:@is_gbv, false)
      end

      context "when the signed in user is a field worker" do
        before :each do
          @view.instance_variable_set(:@is_manager, false)
        end
        it "should return a header list" do
          @view.list_view_header('case').should == [
                                                    {:title=>"id", :sort_title=>"short_id"}, 
                                                    {:title=>"name", :sort_title=>"sortable_name"}, 
                                                    {:title=>"age", :sort_title=>"age"}, 
                                                    {:title=>"sex", :sort_title=>"sex"}, 
                                                    {:title=>"registration_date", :sort_title=>"registration_date"}, 
                                                    {:title=>"photo", :sort_title=>"photo"}
                                                   ]
        end

        it "should return filters to show" do
          @view.index_filters_to_show('case').should == [
                                                         "Flagged", "Status", "Age Range", "Sex", "Protection Status", 
                                                         "Urgent Protection Concern", "Risk Level", "Current Location",
                                                         "Registration Date", "Record State"
                                                        ]
        end
      end

      context "when the signed in user is a manager" do
        before :each do
          @view.instance_variable_set(:@is_manager, true)
        end
        it "should return a header list" do
          @view.list_view_header('case').should == [
                                                    {:title=>"id", :sort_title=>"short_id"}, 
                                                    {:title=>"age", :sort_title=>"age"}, 
                                                    {:title=>"sex", :sort_title=>"sex"}, 
                                                    {:title=>"registration_date", :sort_title=>"registration_date"}, 
                                                    {:title=>"photo", :sort_title=>"photo"},
                                                    {:title=>"social_worker", :sort_title=>"owned_by"}
                                                   ]
        end

        it "should return filters to show" do
          @view.index_filters_to_show('case').should == [
                                                         "Flagged", "Social Worker", "Status", "Age Range", "Sex", "Protection Status", 
                                                         "Urgent Protection Concern", "Risk Level", "Current Location",
                                                         "Registration Date", "Record State"
                                                        ]
        end
      end

    end

    context "when GBV" do
      before :each do
        @view.instance_variable_set(:@is_cp, false)
        @view.instance_variable_set(:@is_gbv, true)
      end

      context "when the signed in user is a field worker" do
        before :each do
          @view.instance_variable_set(:@is_manager, false)
        end
        it "should return a header list" do
          @view.list_view_header('case').should == [
                                                    {:title=>"id", :sort_title=>"short_id"},
                                                    {:title=>"survivor_code", :sort_title=>"survivor_code_no"},
                                                    {:title=>"case_opening_date", :sort_title=>"created_at"}
                                                   ]
        end

        it "should return filters to show" do
          @view.index_filters_to_show('case').should == [
                                                         "Flagged", "Status", "Age Range", "Sex", "GBV Displacement Status", 
                                                         "Protection Status", "Case Open Date", "Record State"
                                                        ]
        end
      end

      context "when the signed in user is a manager" do
        before :each do
          @view.instance_variable_set(:@is_manager, true)
        end
        it "should return a header list" do
          @view.list_view_header('case').should == [
                                                    {:title=>"id", :sort_title=>"short_id"}, 
                                                    {:title=>"case_opening_date", :sort_title=>"created_at"},
                                                    {:title=>"social_worker", :sort_title=>"owned_by"}
                                                   ]
        end

        it "should return filters to show" do
          @view.index_filters_to_show('case').should == [
                                                         "Flagged", "Social Worker", "Status", "Age Range", "Sex", "GBV Displacement Status", 
                                                         "Protection Status", "Case Open Date", "Record State"
                                                        ]
        end
      end
    end
  end

  context "Viewing incidents"  do
    context "when MRM" do
      before :each do
        @view.instance_variable_set(:@is_mrm, true)
        @view.instance_variable_set(:@is_gbv, false)
      end

      context "when the signed in user is a field worker" do
        before :each do
          @view.instance_variable_set(:@is_manager, false)
        end
        it "should return a header list" do
          @view.list_view_header('incident').should == [
                                                    {:title=>"id", :sort_title=>"short_id"},
                                                    {title: 'date_of_incident', sort_title: 'date_of_incident'},
                                                    {title: 'incident_location', sort_title: 'incident_location'},
                                                    {title: 'violations', sort_title: 'violations'}
                                                   ]
        end
      end

      context "when the signed in user is a manager" do
        before :each do
          @view.instance_variable_set(:@is_manager, true)
        end
        it "should return a header list" do
          @view.list_view_header('incident').should == [
                                                    {:title=>"id", :sort_title=>"short_id"},
                                                    {title: 'date_of_incident', sort_title: 'date_of_incident'},
                                                    {title: 'incident_location', sort_title: 'incident_location'},
                                                    {title: 'violations', sort_title: 'violations'},
                                                    {:title=>"social_worker", :sort_title=>"owned_by"}
                                                   ]
        end
      end
    end

    context "when GBV" do
      before :each do
        @view.instance_variable_set(:@is_mrm, false)
        @view.instance_variable_set(:@is_gbv, true)
      end

      context "when the signed in user is a field worker" do
        before :each do
          @view.instance_variable_set(:@is_manager, false)
        end
        it "should return a header list" do
          @view.list_view_header('incident').should == [
                                                    {:title=>"id", :sort_title=>"short_id"},
                                                    {title: 'date_of_interview', sort_title: 'date_of_first_report'},
                                                    {title: 'date_of_incident', sort_title: 'date_of_incident'},
                                                    {title: 'violence_type', sort_title: 'gbv_sexual_violence_type'}
                                                   ]
        end
      end

      context "when the signed in user is a manager" do
        before :each do
          @view.instance_variable_set(:@is_manager, true)
        end
        it "should return a header list" do
          @view.list_view_header('incident').should == [
                                                    {:title=>"id", :sort_title=>"short_id"},
                                                    {title: 'date_of_interview', sort_title: 'date_of_first_report'},
                                                    {title: 'date_of_incident', sort_title: 'date_of_incident'},
                                                    {title: 'violence_type', sort_title: 'gbv_sexual_violence_type'},
                                                    {:title=>"social_worker", :sort_title=>"owned_by"}
                                                   ]
        end
      end
    end
  end

  context "Viewing tracing requests"  do
    #TODO - coming in future story
  end
end
