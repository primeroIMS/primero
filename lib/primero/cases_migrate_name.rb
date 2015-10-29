module CasesMigrateName
    # SL-115 Beta: Migrate 'name' data to new name fields.
    #   a.) Anything in the name field before the first space will be copied
    #       into the first_name field.
    #   b.) Anything between the first space and after the second space
    #       will be copied into the middle name field.
    #   c.) Anything after the second space will be copied into the
    #       last_name field.
    #   d.) If the string in the name field only has one space in it,
    #       the first half goes in the first_name field,
    #       and the second half goes in the last_name field.
    #   e.) If the string has no spaces, the whole thing goes in the
    #       first_name field.
    def self.migrate_name_to_fields_names
      #Only CP cases has first name, last name and middle name.
      start_key = [PrimeroModule::CP]
      end_key = [PrimeroModule::CP, {}]
      Child.by_missed_fields_names(:startkey => start_key, :endkey => end_key).each do |case_record|
        names = case_record.name.split(" ")
        if names.length == 1
          case_record.name_first = names[0]
        elsif names.length == 2
          case_record.name_first = names[0]
          case_record.name_last = names[1]
        elsif names.length >= 3
          case_record.name_first = names[0]
          case_record.name_middle = names[1]
          case_record.name_last = names.slice(2, names.length - 2).join(" ")
        end
        if case_record.changed?
          if case_record.save
            puts "Updated case #{case_record.id} ..."
          else
            puts "Can't Updated case #{case_record.id} ..."
          end
        end
      end
    end
  end
