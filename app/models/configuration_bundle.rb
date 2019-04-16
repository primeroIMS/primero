class ConfigurationBundle < ApplicationRecord

  # include Memoizable #Nothing to memoize but provides refresh infrastructure

  def self.import(model_data, applied_by=nil)
    Rails.logger.info "Starting configuration bundle import..."
    begin
      model_data.map do |model_clazz, data_arr|
        model = model_clazz.constantize

        Rails.logger.info "Removing the data for: #{model.name}"
        Field.delete_all if model == FormSection
        model.delete_all

        Rails.logger.info "Inserting data for: #{model.name}"
        data_arr.map do |data|
          if model == FormSection
            form = model.create!(data.except('fields'))
            data['fields'].map do |field|
              field['subform_section_id'] = FormSection.find_by(unique_id: field['subform_section_id']).id if field['subform_section_id'].present?
              f = Field.new(field)
              f.form_section = form
              f.save!
            end
          else
            data['form_sections'] = FormSection.where(unique_id: data['form_sections']) if data['form_sections'].present?
            data['primero_program_id'] = PrimeroProgram.find_by(unique_id: data['primero_program_id']).id if data['primero_program_id'].present?
            record = model.new(data)
            record.save!
          end
        end
        Rails.logger.info "#{model.count} records inserted for: #{model.name}"
      end
      # TODO should we save on auditlog?
      ConfigurationBundle.create! applied_by: applied_by
    rescue => e
      p e.inspect
    end
    Rails.logger.info "Successfully completed configuration bundle import."
  end

  def self.export
    bundle_data = {}
    bundle_models.each do |model|
      bundle_data[model.name] = data_from_models(model)
    end
    bundle_data
  end

  def self.export_as_json
    JSON.pretty_generate(export)
  end

  def self.bundle_models
    [
      Agency, ContactInformation, FormSection, Location, Lookup,
      PrimeroProgram, PrimeroModule, Report, Role,
      UserGroup, ExportConfiguration, SystemSettings
    ]
  end

  def self.data_from_models(model)
    if model == FormSection
      form_sections = []
      model.all.map do |record|
        form = {}
        form = record.attributes.except('id')
        fields = record.fields.map{ |f| f.attributes.except('id') }
        form['fields'] = fields.map do |f|
          f['form_section_id'] = form['unique_id']
          f['subform_section_id'] = FormSection.find(f['subform_section_id']).unique_id if f['subform_section_id'].present?
          f
        end
        form_sections << form
      end
      form_sections
    elsif model.in?([PrimeroModule, Role])
      model.all.map do |record|
        record.attributes.tap do |pm|
          pm.delete('id')
          pm['form_sections'] = record.form_sections.pluck(:unique_id)
          pm['primero_program_id'] = record.primero_program.unique_id if model == PrimeroModule
        end
      end
    else
      model.all.map{ |r| r.attributes.except('id') }
    end
  end

  #Ducktyping to allow refreshing
  # def self.flush_cache ; end
end
