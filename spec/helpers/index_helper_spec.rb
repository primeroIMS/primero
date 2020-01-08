require 'rails_helper'

describe IndexHelper do
  before do
    @view = Object.new
    @view.extend(IndexHelper)
    @primero_module = build :primero_module
  end

  context "when viewing cases"  do
    context "and Workflow Status is off" do
      before :each do
        @current_user.stub(:modules).and_return([])
      end

      context "and module is CP" do
        before :each do
          FormSection.stub(:has_photo_form).and_return(true)
          @view.instance_variable_set(:@is_cp, true)
          @view.instance_variable_set(:@is_gbv, false)
        end

        context "and photo form field exists" do
          before do
            FormSection.stub(:has_photo_form).and_return(true)
          end

          context "when the signed in user is a field worker" do
            before :each do
              @view.instance_variable_set(:@is_manager, false)
            end
            it "should return a header list" do
              @view.list_view_header('case').should == [
                                                        {title: '', sort_title: 'select'},
                                                        {title: "id", sort_title: "short_id"},
                                                        {title: "name", sort_title: "sortable_name"},
                                                        {title: "age", sort_title: "age"},
                                                        {title: "sex", sort_title: "sex"},
                                                        {title: "registration_date", sort_title: "registration_date"},
                                                        {title: "photo", sort_title: "photo"}
                                                       ]
            end

            it "should return filters to show" do
              @view.instance_variable_set(:@can_sync_mobile, true)
              @view.should_receive(:visible_filter_field?).and_return(true, true, true)
              @view.index_filters_to_show('case').should == [
                                                             "Flagged", "Mobile", "My Cases", "Status",
                                                             "Age Range", "Sex", "Protection Status",
                                                             "Urgent Protection Concern", "Type of Risk", "Risk Level", "Current Location",
                                                             "Dates", "No Activity", "Record State", "Photo"
                                                            ]
            end
          end

          context "when the signed in user is a manager" do
            before :each do
              @view.instance_variable_set(:@is_manager, true)
            end
            it "should return a header list" do
              @view.list_view_header('case').should == [
                                                        {title: '', sort_title: 'select'},
                                                        {title: "id", sort_title: "short_id"},
                                                        {title: "age", sort_title: "age"},
                                                        {title: "sex", sort_title: "sex"},
                                                        {title: "registration_date", sort_title: "registration_date"},
                                                        {title: "photo", sort_title: "photo"},
                                                        {title: "social_worker", sort_title: "owned_by"}
                                                       ]
            end

            it "should return filters to show" do
              @view.instance_variable_set(:@can_sync_mobile, true)
              # @current_user.should_receive(:modules).twice.and_return([])
              @view.should_receive(:visible_filter_field?).and_return(true, true, true)
              @view.index_filters_to_show('case').should == [
                                                             "Flagged", "Mobile", "Social Worker", "My Cases",
                                                             "Agency", "Status", "Age Range",
                                                             "Sex", "Protection Status", "Urgent Protection Concern", "Type of Risk", "Risk Level",
                                                             "Current Location", "Dates", "No Activity", "Record State", "Photo"
                                                            ]
            end
          end

          context "when the signed in user is a admin" do
            before :each do
              @view.instance_variable_set(:@is_admin, true)
              @view.instance_variable_set(:@is_manager, true)
              @view.instance_variable_set(:@can_view_reporting_filter, true)
              @view.instance_variable_set(:@can_sync_mobile, true)
            end

            it "should return filters to show" do
              # @current_user.should_receive(:modules).and_return([])
              @view.should_receive(:visible_filter_field?).and_return(true, true, true)
              @view.index_filters_to_show('case').should == [
                  "Flagged", "Mobile", "Social Worker", "My Cases", "Agency", "Status", "Age Range",
                  "Sex", "Protection Status", "Urgent Protection Concern", "Type of Risk", "Risk Level",
                  "Current Location", "Reporting Location", "Dates", "No Activity", "Record State", "Photo"
              ]
            end
          end
        end

        context "and photo form field does not exist" do
          before do
            FormSection.stub(:has_photo_form).and_return(false)
          end

          context "when the signed in user is a field worker" do
            before :each do
              @view.instance_variable_set(:@is_manager, false)
            end
            it "should return a header list" do
              @view.list_view_header('case').should == [
                  {title: '', sort_title: 'select'},
                  {title: "id", sort_title: "short_id"},
                  {title: "name", sort_title: "sortable_name"},
                  {title: "age", sort_title: "age"},
                  {title: "sex", sort_title: "sex"},
                  {title: "registration_date", sort_title: "registration_date"}
              ]
            end

            it "should return filters to show" do
              @view.instance_variable_set(:@can_sync_mobile, true)
              # @current_user.should_receive(:modules).and_return([])
              @view.should_receive(:visible_filter_field?).and_return(true, true, true)
              @view.index_filters_to_show('case').should == [
                  "Flagged", "Mobile", "My Cases", "Status",
                  "Age Range", "Sex", "Protection Status",
                  "Urgent Protection Concern", "Type of Risk", "Risk Level", "Current Location",
                  "Dates", "No Activity", "Record State"
              ]
            end
          end

          context "when the signed in user is a manager" do
            before :each do
              @view.instance_variable_set(:@is_manager, true)
            end
            it "should return a header list" do
              @view.list_view_header('case').should == [
                  {title: '', sort_title: 'select'},
                  {title: "id", sort_title: "short_id"},
                  {title: "age", sort_title: "age"},
                  {title: "sex", sort_title: "sex"},
                  {title: "registration_date", sort_title: "registration_date"},
                  {title: "social_worker", sort_title: "owned_by"}
              ]
            end

            it "should return filters to show" do
              @view.instance_variable_set(:@can_sync_mobile, true)
              # @current_user.should_receive(:modules).and_return([])
              @view.should_receive(:visible_filter_field?).and_return(true, true, true)
              @view.index_filters_to_show('case').should == [
                  "Flagged", "Mobile", "Social Worker", "My Cases",
                  "Agency", "Status", "Age Range",
                  "Sex", "Protection Status", "Urgent Protection Concern", "Type of Risk", "Risk Level",
                  "Current Location", "Dates", "No Activity", "Record State"
              ]
            end
          end

          context "when the signed in user is a admin" do
            before :each do
              @view.instance_variable_set(:@is_admin, true)
              @view.instance_variable_set(:@is_manager, true)
              @view.instance_variable_set(:@can_view_reporting_filter, true)
              @view.instance_variable_set(:@can_sync_mobile, true)
            end

            it "should return filters to show" do
              # @current_user.should_receive(:modules).and_return([])
              @view.should_receive(:visible_filter_field?).and_return(true, true, true)
              @view.index_filters_to_show('case').should == [
                  "Flagged", "Mobile", "Social Worker", "My Cases", "Agency", "Status", "Age Range",
                  "Sex", "Protection Status", "Urgent Protection Concern", "Type of Risk", "Risk Level",
                  "Current Location", "Reporting Location", "Dates", "No Activity", "Record State"
              ]
            end
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
                                                      {title: '', sort_title: 'select'},
                                                      {title: "id", sort_title: "short_id"},
                                                      {title: "survivor_code", sort_title: "survivor_code_no"},
                                                      {title: "case_opening_date", sort_title: "created_at"}
                                                     ]
          end

          it "should return filters to show" do
            @view.instance_variable_set(:@can_sync_mobile, true)
            # @current_user.should_receive(:modules).and_return([])
            @view.should_receive(:visible_filter_field?).and_return(true, true)
            @view.index_filters_to_show('case').should == [
                                                           "Flagged", "Mobile", "My Cases", "Status", "Age Range",
                                                           "Sex", "GBV Displacement Status", "Protection Status", "Agency Office",
                                                           "Case Open Date", "No Activity", "Record State"
                                                          ]
          end
        end

        context "when the signed in user is a manager" do
          before :each do
            @view.instance_variable_set(:@is_manager, true)
          end
          it "should return a header list" do
            @view.list_view_header('case').should == [
                                                      {title: '', sort_title: 'select'},
                                                      {title: "id", sort_title: "short_id"},
                                                      {title: "case_opening_date", sort_title: "created_at"},
                                                      {title: "social_worker", sort_title: "owned_by"}
                                                     ]
          end

          it "should return filters to show" do
            @view.instance_variable_set(:@can_sync_mobile, true)
            # @current_user.should_receive(:modules).and_return([])
            @view.should_receive(:visible_filter_field?).and_return(true, true)
            @view.index_filters_to_show('case').should == [
                                                           "Flagged", "Mobile", "Social Worker", "My Cases", "Agency",
                                                           "Status", "Age Range", "Sex", "GBV Displacement Status",
                                                           "Protection Status", "Agency Office", "Case Open Date", "No Activity","Record State"
                                                          ]
          end
        end
      end
    end

    context "and Workflow Status is on" do
      before :each do
        FormSection.stub(:get_allowed_form_ids).and_return([])
        @primero_module.workflow_status_indicator = true
        @current_user.stub(:modules).and_return([@primero_module])
      end

      it "returns filters to show" do
        expect(@view.index_filters_to_show('case')).to eq(["Flagged", "My Cases", "Workflow", "Status", "Age Range",
                                                           "Sex", "No Activity", "Record State"])
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
                                                    {title: '', sort_title: 'select'},
                                                    {title: "id", sort_title: "short_id"},
                                                    {title: 'date_of_incident', sort_title: 'incident_date_derived'},
                                                    {title: 'incident_location', sort_title: 'incident_location'},
                                                    {title: 'violations', sort_title: 'violations'}
                                                   ]
        end

        it "should return filters to show" do
          @view.instance_variable_set(:@can_sync_mobile, true)
          expect(@view.index_filters_to_show('incident')).to match_array(["Flagged",
                                                                          "Mobile",
                                                                          "Violation",
                                                                          "Deprived of liberty?",
                                                                          "Status",
                                                                          "Children",
                                                                          "Verification Status",
                                                                          "Incident Location",
                                                                          "Dates",
                                                                          "Armed Force",
                                                                          "Armed Group",
                                                                          "Record State",
                                                                          "Individual Age",
                                                                          "Individual Sex",
                                                                          "Individual Violation",
                                                                          "Perpetrator Arrested",
                                                                          "Perpetrator Detained",
                                                                          "Perpetrator Convicted",
                                                                          "Reason Deprived of liberty?",
                                                                          "Facilty Deprived of liberty?",
                                                                          "Punishment Deprived of liberty?"])
        end
      end

      context "when the signed in user is a manager" do
        before :each do
          @view.instance_variable_set(:@is_manager, true)
        end
        it "should return a header list" do
          @view.list_view_header('incident').should == [
                                                    {title: '', sort_title: 'select'},
                                                    {title: "id", sort_title: "short_id"},
                                                    {title: 'date_of_incident', sort_title: 'incident_date_derived'},
                                                    {title: 'incident_location', sort_title: 'incident_location'},
                                                    {title: 'violations', sort_title: 'violations'},
                                                    {title: "social_worker", sort_title: "owned_by"}
                                                   ]
        end

        it "should return filters to show" do
          @view.instance_variable_set(:@can_sync_mobile, true)
          expect(@view.index_filters_to_show('incident')).to match_array(["Flagged",
                                                                          "Mobile",
                                                                          "Violation",
                                                                          "Deprived of liberty?",
                                                                          "Social Worker",
                                                                          "Status",
                                                                          "Children",
                                                                          "Verification Status",
                                                                          "Incident Location",
                                                                          "Dates",
                                                                          "Armed Force",
                                                                          "Armed Group",
                                                                          "Record State",
                                                                          "Individual Age",
                                                                          "Individual Sex",
                                                                          "Individual Violation",
                                                                          "Perpetrator Arrested",
                                                                          "Perpetrator Detained",
                                                                          "Perpetrator Convicted",
                                                                          "Reason Deprived of liberty?",
                                                                          "Facilty Deprived of liberty?",
                                                                          "Punishment Deprived of liberty?"])
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
                                                    {title: '', sort_title: 'select'},
                                                    {title: "id", sort_title: "short_id"},
                                                    {title: 'date_of_interview', sort_title: 'date_of_first_report'},
                                                    {title: 'date_of_incident', sort_title: 'incident_date_derived'},
                                                    {title: 'violence_type', sort_title: 'gbv_sexual_violence_type'}
                                                   ]
        end

        it "should return filters to show" do
          @view.instance_variable_set(:@can_sync_mobile, true)
          @view.index_filters_to_show('incident').should == [
                                                         "Flagged", "Mobile", "Violence Type", "Agency Office", "Status", "Age Range",
                                                         "Incident Location", "Dates", "Protection Status", "Record State"
                                                        ]
        end
      end

      context "when the signed in user is a manager" do
        before :each do
          @view.instance_variable_set(:@is_manager, true)
        end
        it "should return a header list" do
          @view.list_view_header('incident').should == [
                                                    {title: '', sort_title: 'select'},
                                                    {title: "id", sort_title: "short_id"},
                                                    {title: 'date_of_interview', sort_title: 'date_of_first_report'},
                                                    {title: 'date_of_incident', sort_title: 'incident_date_derived'},
                                                    {title: 'violence_type', sort_title: 'gbv_sexual_violence_type'},
                                                    {title: "social_worker", sort_title: "owned_by"}
                                                   ]
        end

        it "should return filters to show" do
          @view.instance_variable_set(:@can_sync_mobile, true)
          @view.index_filters_to_show('incident').should == [
                                                         "Flagged", "Mobile", "Violence Type", "Social Worker", "Agency Office", "Status", "Age Range",
                                                         "Incident Location", "Dates", "Protection Status", "Record State"
                                                        ]
        end
      end
    end
  end

  context "Viewing tracing requests"  do
    #TODO - coming in future story
  end
end
