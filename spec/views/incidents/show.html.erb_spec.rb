require 'rails_helper'

class Schema;
end

describe "incidents/show.html.erb" do

  describe "displaying an incidents details"  do
    before :each do
      @user = double('user', :permissions => Permission.all_permissions_list, :has_permission? => true, :group_permission? => Permission::GROUP,
                     :user_name => 'name', :id => 'test-user-id', :full_name => 'Jose Smith')
      @user.stub(:has_permission_by_permission_type?).and_return(true)
      @user.stub(:localize_date)
      controller.stub(:current_user).and_return(@user)
      controller.stub(:model_class).and_return(Incident)
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
      mod = PrimeroModule.create({_id: 'primeromodule-mrm'})
      Incident.any_instance.stub(:field_definitions).and_return([])
      @incident = Incident.create(:unique_identifier => "georgelon12345",
                            :created_by => 'jsmith', :owned_by => @user.user_name, :owned_by_full_name => 'Jose Smith',
                            :created_at => "July 19 2010 13:05:32UTC", :module_id => mod.id)

      @incident.stub(:short_id).and_return('2341234')
      @incident.stub(:owner).and_return(@user)

      controller.stub(:incident, @incident)
      assign(:form_sections,[@form_section].group_by{|e| e.form_group_name})
      assign(:incident, @incident)
      assign(:current_user, User.new)
      assign(:duplicates, Array.new)
    end

    it "renders all fields found on the FormSection" do
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
      @form_section['enabled'] = false

      render

      rendered.should_not have_tag("dl.section_name dt")
    end

    context "export button" do
      it "should not show links to export when user doesn't have appropriate permissions" do
        @user.stub(:has_permission?).and_return(false)
        render
        rendered.should_not have_tag("a[href='#{incident_path(@incident,:format => :csv)}']")
      end

      it "should show links to export when user has appropriate permissions" do
        link = incident_path @incident, :format => :csv, :action => :show, :controller => :incidents, :id => @incident.id, :page => :all, :per_page => :all
        @user.stub(:has_permission?).with([Permission::READ]).and_return(true)

        render :partial => "incidents/show_incident_toolbar", :locals => {:incident => @incident}
        rendered.should have_xpath("//a[contains(@href, '#{link}')]", :visible => false)
      end
    end

  end

end
