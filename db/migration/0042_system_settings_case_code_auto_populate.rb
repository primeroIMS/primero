#There should only be 1 row in system settings
system_settings = SystemSettings.first
if system_settings.present?
  system_settings.auto_populate_list ||= []
  if system_settings.auto_populate_info('case_id_code').blank? && system_settings.case_code_format.present?
    ap1 = AutoPopulateInformation.new(field_key: 'case_id_code',
                                      format: system_settings.case_code_format,
                                      separator: system_settings.case_code_separator,
                                      auto_populated: true)
    system_settings.auto_populate_list << ap1
    system_settings.case_code_format = nil
    system_settings.case_code_separator = nil
    puts 'Updating SystemSettings auto_populate_list with case_id_code'
    system_settings.save
  else
    puts 'Skipping SystemSettings case_id_code auto_populate update... already done'
  end
else
  puts 'Skipping SystemSettings case_id_code auto_populate update... SystemSettings not present'
end