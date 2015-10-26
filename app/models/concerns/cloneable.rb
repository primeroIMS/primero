module Cloneable
  extend ActiveSupport::Concern
  include Namable

  #This is necessary to clear the couch '_rev' attribute so the new record is instantiated properly
  #without conflicting with the original
  #If a name is passed in, that name is used
  #Otherwise, the current name is prepended with 'copy of'
  def clone(new_name = '')
    new_record = self.dup
    new_record['_id'] = nil
    new_record['_rev'] = nil
    if new_name.present?
      new_record.name = new_name
    else
      new_record.name.prepend('copy of ')
    end
    new_record.generate_id
    new_record
  end

end
