require 'spec_helper'

describe "form_section/_form_section.html.erb" do

  before :each do
    @form_section = FormSection.new({
      "unique_id" => "translated",
      "name" => "displayed_form_name",
      :order_form_group => 40,
      :order => 80,
      :order_subform => 0,
      :form_group_name => "Test Group"
    })
  end

  describe "translating form section name" do
    # TODO: Add back after demo deploy. Hiding certain tabs
    # it "should be shown with translated name" do
    #   translated_name = "translated_form_name"
    #   I18n.locale = :fr
    #   I18n.backend.store_translations("fr", @form_section.unique_id => translated_name)
    #   render :partial => 'form_section/tabs' , :object => [@form_section], :formats => [:html], :handlers => [:erb]
    #   rendered.should be_include(translated_name)
    #   rendered.should_not be_include(@form_section.name)
    # end
    #
    # it "should not be shown with translated name" do
    #   I18n.backend.store_translations("fr", @form_section.unique_id => nil)
    #   render :partial => 'form_section/tabs', :object => [@form_section], :formats => [:html], :handlers => [:erb]
    #   rendered.should be_include(@form_section.name)
    # end
  end

  # Section heading were removed.
  # describe "translating form section heading" do
  #   it "should be shown with translated heading" do
  #     translated_name = "translated_heading"
  #     I18n.locale = :fr
  #     I18n.backend.store_translations("fr", @form_section.unique_id => translated_name)
  #     @form_sections = [ @form_section ].group_by{|e| e.form_group_name}

  #     render :partial => 'form_section/show_form_section', :formats => [:html], :handlers => [:erb]

  #     rendered.should be_include(translated_name)
  #     rendered.should_not be_include(@form_section.name)
  #   end

  #     it "should not be shown with translated heading" do
  #       I18n.backend.store_translations("fr", @form_section.unique_id => nil)
  #       @form_sections = [ @form_section ].group_by{|e| e.form_group_name}
  #       render :partial => 'form_section/show_form_section', :formats => [:html], :handlers => [:erb]
  #     end
  # end

  describe "rendering text fields" do

    context "new record" do

      it "renders text fields with a corresponding label" do
        @form_section.add_field(build(:field))
        @child = Child.new
        render :partial => 'form_section/form_section', :locals => { :form_section => @form_section, :formObject => @child, :form_group_name => @form_section.form_group_name }, :formats => [:html], :handlers => [:erb]

        @form_section.fields.each do |field|
          rendered.should be_include("<label class=\"key inline\" for=\"#{@form_section.name.dehumanize}_#{field.tag_id}\">")

          rendered.should be_include("<input autocomplete=\"off\" data-field-tags=\"[]\" id=\"#{@form_section.name.dehumanize}_child_name\" is_disabled=\"false\" name=\"child[name]\" type=\"text\" value=\"\" />")
        end
      end
    end

    context "existing record" do

      it "prepopulates the text field with the existing value" do
        @child = Child.new :name => "Jessica"
        @form_section.add_field(build(:field))
        render :partial => 'form_section/form_section', :locals => { :form_section => @form_section, :formObject => @child, :form_group_name => @form_section.form_group_name }, :formats => [:html], :handlers => [:erb]

        rendered.should be_include("<input autocomplete=\"off\" data-field-tags=\"[]\" id=\"#{@form_section.name.dehumanize}_child_name\" is_disabled=\"false\" name=\"child[name]\" type=\"text\" value=\"Jessica\" />")
      end
    end
  end

  describe "rendering radio buttons" do

    context "new record" do

      it "renders radio button fields" do
        @child = Child.new
        @form_section.add_field(build(:field, type: "radio_button", name: "is_age_exact".dehumanize,
                                      display_name: "is_age_exact".humanize,
                                      option_strings_text_all: ["Is Exact", "Approximate"].join("\n")))
        render :partial => 'form_section/form_section', :locals => { :form_section => @form_section, :formObject => @child, :form_group_name => @form_section.form_group_name }, :formats => [:html], :handlers => [:erb]

        rendered.should be_include("<input data-field-tags=\"[]\" id=\"#{@form_section.name.dehumanize}_child_isageexact_exact\" is_disabled=\"false\" name=\"child[isageexact]\" type=\"radio\" value=\"is_exact\" />")
        expect(rendered).to match(/<label for="#{@form_section.name.dehumanize}_child_isageexact_is_exact">Is Exact<\/label>/)
        rendered.should be_include("<input data-field-tags=\"[]\" id=\"#{@form_section.name.dehumanize}_child_isageexact_approximate\" is_disabled=\"false\" name=\"child[isageexact]\" type=\"radio\" value=\"approximate\" />")
        expect(rendered).to match(/<label for="#{@form_section.name.dehumanize}_child_isageexact_approximate">Approximate<\/label>/)
      end
    end

    context "existing record" do

      it "renders a radio button with the current option selected" do
        @child = Child.new :isageexact => "approximate"
        @form_section.add_field(build(:field, type: "radio_button", name: "is_age_exact".dehumanize,
                                      display_name: "is_age_exact".humanize,
                                      option_strings_text_all: ["exact", "approximate"].join("\n")))

        render :partial => 'form_section/form_section', :locals => { :form_section => @form_section, :formObject => @child, :form_group_name => @form_section.form_group_name }, :formats => [:html], :handlers => [:erb]

        rendered.should be_include("<input data-field-tags=\"[]\" id=\"#{@form_section.name.dehumanize}_child_isageexact_exact\" is_disabled=\"false\" name=\"child[isageexact]\" type=\"radio\" value=\"exact\" />")
        rendered.should be_include("<input checked=\"checked\" data-field-tags=\"[]\" id=\"#{@form_section.name.dehumanize}_child_isageexact_approximate\" is_disabled=\"false\" name=\"child[isageexact]\" type=\"radio\" value=\"approximate\" />")
      end
    end
  end

  describe "rendering select boxes" do

    context "new record" do

      it "render select boxes" do
        @child = Child.new
        @form_section.add_field(build(:field, type: "select_box", name: "date_of_separation".dehumanize,
                                      display_name: "date_of_separation".humanize,
                                      option_strings_text_all: ["1-2 weeks ago", "More than a year ago"].join("\n")))

        render :partial => 'form_section/form_section', :locals => { :form_section => @form_section, :formObject => @child, :form_group_name => @form_section.form_group_name }, :formats => [:html], :handlers => [:erb]
        rendered.should be_include("<label class=\"key inline\" for=\"#{@form_section.name.dehumanize}_child_dateofseparation\">Date of separation<\/label>")
        rendered.should be_include("<select class=\"chosen-select \" data-field-tags=\"[]\" data-populate=\"null\" data-value=\"\" id=\"displayedformname_child_dateofseparation\" is_disabled=\"false\" name=\"child[dateofseparation]\"><option selected=\"selected\" value=\"\">(Select...)</option>\n<option value=\"1-2 weeks ago\">1-2 weeks ago</option>\n<option value=\"More than a year ago\">More than a year ago</option></select>")
        expect(rendered).to match(/<option value="1_2_weeks_ago">1-2 weeks ago<\/option>/)
        expect(rendered).to match(/<option value="more_than_a_year_ago">More than a year ago<\/option>/)
      end
    end
  end

  context "existing record" do
    it "renders a select box with the current value selected" do
      @child = Child.new :date_of_separation => "1_2_weeks_ago"
      @form_section.add_field(build(:field, type: "select_box", name: "date_of_separation".dehumanize,
                                    display_name: "date_of_separation".humanize,
                                    option_strings_text_all: ["1-2 weeks ago", "More than a year ago"].join("\n")))

      render :partial => 'form_section/form_section', :locals => { :form_section => @form_section, :formObject => @child, :form_group_name => @form_section.form_group_name }, :formats => [:html], :handlers => [:erb]

      expect(rendered).to match(/<label class="key inline" for="displayedformname_child_dateofseparation">Date of separation<\/label>/)
      expect(rendered).to match(/<select class=\"chosen-select \ data-field-tags="\[\]" data-populate="null" data-value="" id="displayedformname_child_dateofseparation" is_disabled=\"false\" name="child\[dateofseparation\]">/)
      expect(rendered).to match(/<option value="1_2_weeks_ago">1-2 weeks ago<\/option>/)
      expect(rendered).to match(/<option value="more_than_a_year_ago">More than a year ago<\/option>/)
    end
  end

  describe "rendering check boxes" do

    context "existing record" do

      it "renders checkboxes as checked if the underlying field is set to Yes" do
        #TODO: Please fix to be compatible with i18n
        @child = Child.new :relatives => ["Brother", "Sister"]
        @form_section.add_field Field.new_field("check_boxes", "relatives", ["Sister", "Brother", "Cousin"])

        render :partial => 'form_section/form_section', :locals => { :form_section => @form_section, :formObject => @child, :form_group_name => @form_section.form_group_name }, :formats => [:html], :handlers => [:erb]

        rendered.should be_include("<input checked=\"checked\" data-field-tags=\"[]\" id=\"#{@form_section.name.dehumanize}_child_relatives_sister\" is_disabled=\"false\" name=\"child[relatives][]\" type=\"checkbox\" value=\"Sister\" />")
        rendered.should be_include("<input checked=\"checked\" data-field-tags=\"[]\" id=\"#{@form_section.name.dehumanize}_child_relatives_sister\" is_disabled=\"false\" name=\"child[relatives][]\" type=\"checkbox\" value=\"Sister\" />")
      end
    end
  end

  describe "rendering date ranges" do
    context "new record" do
      it "renders date range fields" do
        @child = Child.new
        field = Field.new({"name" => "test_date_range",
                           "type" => "date_range",
                           "display_name_all" => "Test Date Range"
                          })
        @form_section.add_field field

        render :partial => 'form_section/form_section', :locals => { :form_section => @form_section, :formObject => @child, :form_group_name => @form_section.form_group_name }, :formats => [:html], :handlers => [:erb]

        rendered.should be_include("<label class=\"key inline\" for=\"#{@form_section.name.dehumanize}_#{field.tag_id}\">")
        rendered.should be_include("<input class=\"form_date_field has_help\" id=\"#{@form_section.name.dehumanize}_child_test_date_range\" is_disabled=\"false\" name=\"child[test_date_range]\" type=\"text\" value=\"\" />")
      end
    end

    context "on subform" do

      before :each do
        @subform = FormSection.new({
          "visible"=>false,
          "is_nested"=>true,
          "unique_id" => "translated_sub",
          "name" => "displayed_subform_name",
          :order_form_group => 40,
          :order => 80,
          :order_subform => 1,
          :initial_subforms => 1,
          :form_group_name => "Test Group"
        })
      end

      context "new record" do
        #TODO - test commented out due to difficulties testing subforms
        xit "renders date range fields" do
          @child = Child.new
          field = Field.new({"name" => "test_date_range",
                             "type" => "date_range",
                             "display_name_all" => "Test Date Range"
                            })
          @subform.add_field field

          subField = Field.new({"name" => "test_subform",
                                "type" => "subform", "editable" => true,
                                "subform_section_id" => @subform.unique_id,
                                "display_name_all" => "Test Sub Form",
                                "expose_unique_id" => true,
                               })

          @form_section.add_field subField

          #TODO for now - this will not render because the subform does not exist in the database
          #If you were to make this to work, the subform would have to exist in the db
          render :partial => 'form_section/form_section', :locals => { :form_section => @form_section, :formObject => @child, :form_group_name => @form_section.form_group_name }, :formats => [:html], :handlers => [:erb]

          rendered.should be_include("<label class=\"key inline\" for=\"#{@form_section.name.dehumanize}_#{field.tag_id}\">")
          #rendered.should be_include("<input id=\"#{@form_section.name.dehumanize}_#{field.tag_id}_from\" name=\"#{field.tag_name_attribute}\" type=\"text\" value=\"\" />")
          #TODO fix this test
          #rendered.should be_include("<input id=\"#{@form_section.name.dehumanize}_#{field.tag_id}_from\"  />")

        end
      end
    end

  end


  #TODO Date picker must be implemented in Advanced Search Page

  #describe "rendering date field" do

    #context "new record" do
    #  it "renders date field" do
    #    @child = Child.new
    #      @form_section.add_field(build(:field, type: "date_field", name: "Some date".dehumanize, display_name: "Some date".humanize))
    #
    #    render :partial => 'form_section/form_section', :locals => { :form_section => @form_section }, :formats => [:html], :handlers => [:erb]
    #    rendered.should be_include("label for=\"child_some_date\"")
    #    rendered.should be_include("<input id=\"child_some_date\" name=\"child[some_date]\" type=\"text\" />")
    #    rendered.should be_include("<script type=\"text/javascript\">\n//<![CDATA[\n$(document).ready(function(){ $(\"#child_some_date\").datepicker({ dateFormat: 'dd M yy' }); });\n//]]>\n</script>")
    #  end
    #end
    #
    #context "existing record" do
    #
    #  it "renders date field with the previous date" do
    #    @child = Child.new :some_date => "13/05/2004"
    #      @form_section.add_field(build(:field, type: "date_field", name: "Some date".dehumanize, display_name: "Some date".humanize))
    #
    #    render :partial => 'form_section/form_section', :locals => { :form_section => @form_section }, :formats => [:html], :handlers => [:erb]
    #
    #
    #    rendered.should be_include("<input id=\"child_some_date\" name=\"child[some_date]\" type=\"text\" value=\"13/05/2004\" />")
    #    rendered.should be_include("<script type=\"text/javascript\">\n//<![CDATA[\n$(document).ready(function(){ $(\"#child_some_date\").datepicker({ dateFormat: 'dd M yy' }); });\n//]]>\n</script")
    #  end
    #
    #end
  #end

end
