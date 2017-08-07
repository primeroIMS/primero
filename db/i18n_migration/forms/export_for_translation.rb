# This script exports forms to a .yml file that can be uploaded to Transifex for translations
# If a form id is passed in, it will export only that form
# If no form id is passed in, it will export all forms
#
# To execute this script:
#    RAILS_ENV=production bundle exec rails r /path/to/export_for_translation.rb <form id>
#
# Example:
#    RAILS_ENV=production bundle exec rails r ./db/i18n_migration/forms/export_for_translation.rb 'basic_identity'


#TODO - decide if we want to do this on form by form basis, or for all forms
#TODO - Do we want individual form files?  Or do we want 1 file for all forms?


def export_form(form_section)
  puts "Creating file #{form_section.unique_id}.yml"
  file = File.new("#{form_section.unique_id}.yml", 'w')
  file_hash = {}
  file_hash['en'] = form_section.localized_property_hash
  file << file_hash.to_yaml
  file.close
end


def export_all_forms
  puts "Creating Forms.yml"
  file = File.new('Forms.yml', 'w')
  form_hash = {}

  FormSection.all.each{|fs| form_hash[fs.unique_id] = fs.localized_property_hash}
  file_hash = {}
  file_hash['en'] = form_hash
  file << file_hash.to_yaml
  file.close
end


#####################
# BEGINNING OF SCRIPT
#####################
form_name = ARGV.try(:[], 0)

if form_name.present?
  fs = FormSection.by_unique_id(key: form_name).first
  if fs.present?
    export_form(fs)
  else
    puts "No FormSection found for #{form_name}"
  end
else
  export_all_forms
end
