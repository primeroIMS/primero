module FormSectionHelper
  def sorted_highlighted_fields
    FormSection.sorted_highlighted_fields
  end

  def forms_for_display
    FormSection.all.sort_by{ |form| form.name || "" }.map{ |form| [form.name, form.unique_id] }
  end

  def url_for_form_section_field(form_section_id, field)
    field.new? ? form_section_fields_path(form_section_id) : form_section_field_path(form_section_id, field.name)
  end

  def url_for_form_section(form_section)
    form_section.new? ? form_sections_path : form_section_path(form_section.unique_id)
  end

  def build_form_tabs(group, forms)
    form = forms.first
    if forms.count > 1
      content_tag :li, class: 'group' do
        concat(
          link_to("#tab_#{form.section_name}", class: 'group') do
            concat(t(group, :default => group))
          end
        )
        concat(build_group_tabs(forms))
      end
    else
      content_tag :li, class: "#{form.is_first_tab ? 'current': ''}" do
        concat(
          link_to("#tab_#{form.section_name}", class: 'non-group') do
            concat(t(form.unique_id, :default => form.name))
          end
        )
      end
    end
  end

  def build_group_tabs(forms)
    group_id = "group_" + forms[0].form_group_name.gsub(" ", "").gsub("/", "")
    content_tag :ul , class: 'sub', id: group_id do
     for form in forms
      concat(content_tag(:li, 
        link_to("#tab_#{form.section_name}") do 
          concat(t(form.unique_id, :default => form.name))
        end, class: "#{form.is_first_tab ? 'current': ''}"
      ))
     end
    end
  end

  #PRIMERO-439  WIP
  def build_form_custom_list(group, forms)
    form = forms.first
    if forms.count > 1
      content_tag :li, class: 'group' do
        concat(
          link_to(edit_form_section_path(form.section_name), class: 'group') do
            concat(t(group, :default => group))
          end
        )
        concat(build_group_custom_list(forms))
      end
    else
      content_tag :li, class: "#{(form.visible.present? && form.visible == false) ? 'hidden_form' : ''}" do
        concat(
          link_to(edit_form_section_path(form.section_name), class: 'non-group') do
            concat(t(form.unique_id, :default => form.name))
          end
        )
      end
    end
  end

  def build_group_custom_list(forms)
    group_id = "group_" + forms[0].form_group_name.gsub(" ", "").gsub("/", "")
    content_tag :ul , class: 'sub', id: group_id do
     for form in forms
      concat(content_tag(:li,
        link_to(edit_form_section_path(form.section_name)) do
          concat(t(form.unique_id, :default => form.name))
        end, class: "#{(form.visible.present? && form.visible == false) ? 'hidden_form' : ''}" 
      ))
     end
    end
  end
end
