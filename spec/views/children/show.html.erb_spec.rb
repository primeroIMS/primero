require 'rails_helper'

class Schema;
end

describe "children/show.html.erb" do

  describe "displaying a child's details"  do
    before :all do
      PrimeroModule.all.each &:destroy
      @mod ||= PrimeroModule.create!(_id: 'primeromodule-cp', program_id: 'fakeprogram',
                                  name: 'CP', associated_record_types: ['case'],
                                  form_section_ids: ['xxxxx'],
                                  module_options: { workflow_status_indicator: false })
    end

    before :each do
      @user = double('user', :permissions => Permission.all_permissions_list, :has_permission? => true, :group_permission? => Permission::GROUP,
                     :user_name => 'name', :id => 'test-user-id', :full_name => 'Jose Smith')
      @user.stub(:has_permission_by_permission_type?).and_return(true)
      @user.stub(:localize_date)
      @user.stub(:reporting_location)
      @user.stub(:location).and_return('FAKE000')
      @user.stub(:has_permission_by_permission_type?).and_return(true)
      @service_types=[]
      @agencies=[]
      @reporting_locations_for_select=[]
      controller.stub(:current_user).and_return(@user)
      controller.stub(:model_class).and_return(Child)
      view.stub(:current_user).and_return(@user)
      view.stub(:user_signed_in?).and_return(true)
      view.stub(:current_user_name).and_return('name')
      @form_section = FormSection.new({
        :unique_id => "section_name",
        :visible => "true",
        :order_form_group => 40,
        :order => 80,
        :order_subform => 0,
        :form_group_name => "Test Group"
      })

      Child.any_instance.stub(:field_definitions).and_return([])
      @child = Child.create(:name => "fakechild", :age => "27", :gender => "male",
                            :date_of_separation => "1-2 weeks ago", :unique_identifier => "georgelon12345",
                            :created_by => 'jsmith', :owned_by => @user.user_name, :owned_by_full_name => 'Jose Smith',
                            :created_at => "July 19 2010 13:05:32UTC", :photo => uploadable_photo_jeff,
                            :module_id => @mod.id)

      @child.stub(:has_one_interviewer?).and_return(true)
      @child.stub(:short_id).and_return('2341234')
      @child.stub(:owner).and_return(@user)

      controller.stub(:child, @child)
      assign(:form_sections,[@form_section].group_by{|e| e.form_group_name})
      assign(:child, @child)
      assign(:current_user, User.new)
      assign(:duplicates, Array.new)
      @referral_roles = []
      @transfer_roles = []
      @associated_users = []
    end

    # TODO: Photo removed for demo deploy. Add back later
    # it "displays the child's photo" do
    #   assign(:aside,'picture')
    #
    #   render :template => 'children/show', :layout => 'layouts/application'
    #
    #   rendered.should have_tag(".profile-image") do
    #     with_tag("a[href=?]", child_resized_photo_path(@child, @child.primary_photo_id, 640))
    #     with_tag("img[src=?]", child_resized_photo_path(@child, @child.primary_photo_id, 328))
    #   end
    # end

    it "renders all fields found on the FormSection" do
      @current_modules = []
      @form_section.add_field(build(:field, name: 'age', display_name: 'Age'))
      @form_section.add_field(build(:field, type: Field::RADIO_BUTTON, name: "gender".dehumanize,
                                    display_name: "gender".humanize,
                                    option_strings_text_all: ["male", "female"].join("\n")))
      @form_section.add_field(build(:field, type: Field::SELECT_BOX, name: "date_of_separation".dehumanize,
                                    display_name: "date_of_separation".humanize,
                                    option_strings_text_all: ["1-2 weeks ago", "More than"].join("\n")))
      render

      rendered.should have_tag(".section_name") do
        with_tag(".profile-section-label", /Age/)
        with_tag(".profile-section-label", /Gender/)
        with_tag(".profile-section-label", /Date of separation/)
      end

      rendered.should have_tag(".key") do
        with_tag(".value", "27")
        with_tag(".value", "male")
        with_tag(".value", "1-2 weeks ago")
      end
    end

    it "does not render fields found on a disabled FormSection" do
      @current_modules = []
      @form_section['enabled'] = false

      render

      rendered.should_not have_tag("dl.section_name dt")
    end

    describe "interviewer details" do
      it "should show registered by details and no link to change log if child has not been updated" do
        render :partial => "record_shared/header_message", :locals => {:record => @child, model: 'child'}
        rendered.should be_include('Created By:')
        rendered.should be_include('Jose Smith')
        rendered.should_not be_include("Last updated")
      end

      it "should show link to change log if child has been updated by multiple people" do
        child = Child.create(:age => "27", :unique_identifier => "georgelon12345",
                             :_id => "id12345", :created_by => 'jsmith', :created_at => "July 19 2010 13:05:32UTC",
                             :last_updated_by => "jdoe", :last_updated_at => "July 20 2010 14:15:59UTC",
                             :owned_by_full_name => 'Jose Smith')
        child.stub(:has_one_interviewer?).and_return(false)
        child.stub(:owner).and_return(@user)

        assign(:child,child)

        render :partial => "record_shared/header_message", :locals => {record: child, model: 'child'}

        rendered.should be_include('Created By:')
        rendered.should be_include('Jose Smith')
        rendered.should be_include('Last Update:')
        rendered.should be_include(child.last_updated_at.strftime('%d-%b-%Y'))
      end

      # Functionality removed
      # it "should not show link to change log if child was registered by and updated again by only the same person" do
      #   render :partial => "record_shared/header_message", :locals => {:recrod => @child, :model => 'child'}

      #   rendered.should have_tag("#interviewer_details")
      #   rendered.should be_include('Registered by')
      #   rendered.should be_include('jsmith')
      #   rendered.should_not be_include("and others")
      # end

      # Mobile message was removed
      # it "should always show the posted at details when the record has been posted from a mobile client" do
      #   child = Child.create(:posted_at=> "2007-01-01 14:04UTC", :posted_from=>"Mobile", :unique_id=>"bob",
      #   :_id=>"123123", :created_by => 'jsmith', :created_at => "July 19 2010 13:05:32UTC")
      #   child.stub(:has_one_interviewer?).and_return(true)
      #   child.stub(:short_id).and_return('2341234')

      #   user = User.new 'time_zone' => TZInfo::Timezone.get("US/Samoa")

      #   assign(:child,child)
      #   assign(:user,user)

      #   render :partial => "record_shared/header_message", :locals => {:record => child, :model => 'child'}

      #   rendered.should have_selector("#interviewer_details") do |fields|
      #     fields[0].should contain("Posted from the mobile client at: 01 January 2007 at 03:04 (SST)")
      #   end
      # end

      # it "should not show the posted at details when the record has not been posted from mobile client" do
      #   render :partial => "record_shared/header_message", :locals => {:child => @child, :current_user => @user, :duplicates => ""}

      #   rendered.should have_selector("#interviewer_details") do |fields|
      #     fields[0].should_not contain("Posted from the mobile client")
      #   end
      # end
    end

    context "export button" do
      it "should not show links to export when user doesn't have appropriate permissions" do
        @current_modules = []
        @user.stub(:has_permission?).and_return(false)
        render
        rendered.should_not have_tag("a[href='#{child_path(@child,:format => :csv)}']")
      end

      it "should show links to export when user has appropriate permissions" do
        @current_modules = []
        link = child_path @child, :format => :csv, :action => :show, :controller => :children, :id => @child.id, :page => :all, :per_page => :all
        @user.stub(:has_permission?).with([Permission::READ]).and_return(true)

        render :partial => "children/show_child_toolbar", :locals => {:child => @child}
        rendered.should have_xpath("//a[contains(@href, '#{link}')]", :visible => false)
      end
    end

  end

end
