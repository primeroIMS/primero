
module Importers
  class CPIMSImporter < BaseImporter
    def self.id
      'cpims'
    end

    def self.display_name
      'CPIMS'
    end

    def self.import(file_obj)
      book = Spreadsheet.open(file_obj)
      rows = book.worksheets[0].to_a

      #Remove empty lines
      #This includes the "Form Name" line which has a blank first column
      #TODO - would it be better to just delete the row from the excel file?
      rows.reject! {|r| r.blank? || r[0].blank?}

      #Now we have the first 2 lines as heading lines
      #Reconcile / merge row 1 and 2.  The heading is a mixture of both.  Confused yet?
      #To do this, iterate through row 1's elements, if nil, replace with value from row 2.
      a = []
      rows[0].each_with_index {|r, i| a << (r || rows[1][i])}
      rows.shift(2)
      rows.unshift(a)

      cpims_data = flat_to_nested(rows)

      #Now translate CPIMS stuff to Primero stuff
      primero_data = []
      cpims_data.each {|d| primero_data << map_from_CPIMS(d)}
      return primero_data
    end

     #Map CPIMS hash data to a Primero Case hash
    def self.map_from_CPIMS(cpims_hash)
      case_hash = {}

      case_hash['unique_identifier'] = case_hash['case_id'] = cpims_hash['PersonGId'] if cpims_hash['PersonGId'].present?
      case_hash['model_type'] = 'Case'
      case_hash['owned_by'] = 'primero'
      case_hash['owned_by_text'] = cpims_hash['SocialWorker'] if cpims_hash['SocialWorker'].present?
      case_hash['agency'] = cpims_hash['Agency'] if cpims_hash['Agency'].present?
      case_hash['database_operator_user_name'] = cpims_hash['DatabaseOperator'] if cpims_hash['DatabaseOperator'].present?
      case_hash['location_registration'] = cpims_hash['RegistrationLocation'] if cpims_hash['RegistrationLocation'].present? #TODO - add loc2, 3, 4, 5
      case_hash['location_current'] = cpims_hash['CurrentLocation'] if cpims_hash['CurrentLocation'].present? #TODO - add loc2, 3, 4, 5
      case_hash['created_by'] = 'primero'
      case_hash['module_id'] = 'primeromodule-cp'
      case_hash['tracing_status'] = cpims_hash['Status'] if cpims_hash['Status'].present?
      case_hash['child_status'] = Record::STATUS_OPEN   #TODO is there an incoming value for this?

      if cpims_hash['FirstName'].present? && cpims_hash['LastName'].present?
        case_hash['name'] = cpims_hash['FirstName'] + " " + cpims_hash['LastName']
      elsif cpims_hash['FirstName'].present?
        case_hash['name'] = cpims_hash['FirstName']
      elsif cpims_hash['LastName'].present?
        case_hash['name'] = cpims_hash['LastName']
      end

      case_hash['registration_date'] = cpims_hash['DateOfRegistration'] if cpims_hash['DateOfRegistration'].present?
      case_hash['sex'] = cpims_hash['Sex'] if cpims_hash['Sex'].present?
      case_hash['date_of_birth'] = cpims_hash['DateOfBirth'] if cpims_hash['DateOfBirth'].present?
      case_hash['estimated'] = cpims_hash['Estimated'] if cpims_hash['Estimated'].present?  #TODO primero value is boolean. Verify CPIMS value and if need to translate
      case_hash['icrc_ref_no'] = cpims_hash['ICRCId'] if cpims_hash['ICRCId'].present?
      case_hash['unhcr_id_no'] = cpims_hash['UNHCRId'] if cpims_hash['UNHCRId'].present?
      case_hash['protection_concerns'] = cpims_hash['ChildCategoryNIds'].split(',') if cpims_hash['ChildCategoryNIds'].present?
      case_hash['language'] = cpims_hash['LanguageNIds'].split(',') if cpims_hash['LanguageNIds'].present?
      case_hash['nationality'] = cpims_hash['NationalityNIds'].split(',') if cpims_hash['NationalityNIds'].present?
      case_hash['religion'] = cpims_hash['ReligionNIds'].split(',') if cpims_hash['ReligionNIds'].present?
      case_hash['ethnicity'] = cpims_hash['EthnicityNId'].split(',') if cpims_hash['EthnicityNId'].present?

      #TODO remaining fields

      return case_hash
    end

  end
end
