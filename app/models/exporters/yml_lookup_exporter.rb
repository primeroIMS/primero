module Exporters
  class YmlLookupExporter

    def initialize(opts={})
      @export_dir_path = dir
      @locale = opts[:locale].present? ? opts[:locale] : FormSection::DEFAULT_BASE_LANGUAGE
    end

    def dir_name
      File.join(Rails.root.join('tmp', 'exports'), "lookups_yml_export_#{DateTime.now.strftime("%Y%m%d.%I%M%S")}")
    end

    def dir
      FileUtils.mkdir_p dir_name
      dir_name
    end

    def yml_file_name(file_name='default')
      filename = File.join(@export_dir_path, "#{file_name}.yml")
    end

    def create_file_for_lookup(export_file=nil)
      Rails.logger.info {"Creating file #{export_file}.yml"}
      export_file_name = yml_file_name(export_file.to_s)
      @io = File.new(export_file_name, "w")
    end

    def complete
      @io.close if !@io.closed?
      return @io
    end

    def export_lookups_to_yaml
      Rails.logger.info {"Begging of Lookups YAML Exporter..."}
      Rails.logger.info {"Writing files to directory location: '#{@export_dir_path}"}
      lookups = Lookup.all.all
      if lookups.present?
        Rails.logger.info {"Locale: #{@locale}"}
        create_file_for_lookup('lookups')
        lookup_hash = {}
        lookups.each {|lkp| lookup_hash[lkp.id] = lkp.localized_property_hash(@locale)}
        file_hash = {}
        file_hash['en'] = lookup_hash
        @io << file_hash.to_yaml
        complete
      else
        Rails.logger.warn {'No Lookups found'}
      end
    end
  end
end
