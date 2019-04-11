module Cloneable
  extend ActiveSupport::Concern

  def clone(new_name = '')
    new_record = self.dup.tap do |r|
      r.name = new_name.presence || r.name.prepend("#{I18n.t('copy_of')} ")
      r.unique_id = nil if r.respond_to?('unique_id')
      # Using method reflect_on_all_associations to get all associatons of the origina model
      if r.respond_to?('reflect_on_all_associations')
        self.class.reflect_on_all_associations.map do |rel|
          r.send("#{rel.plural_name}=", self.send(rel.plural_name)) if self.send(rel.plural_name).present?
        end
      end
    end
    new_record
  end

end
