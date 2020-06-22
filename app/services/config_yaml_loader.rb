# frozen_string_literal: true

# Loads a configuration from a YAML file and converts it into a deep hash with following these rules:
#   - Every key is a symbol
#   - Exclude and deep compact the k,v pairs where values that match the pattern /^\$.+/.
#     This will exclude values that have not been affected by envsubst
#   - Optionally grab the keys only for the environment
class ConfigYamlLoader
  class << self
    def load(file_path, use_rails_env = true)
      hash = YAML.safe_load(File.open(file_path)).deep_symbolize_keys
      hash = hash[Rails.env.to_sym] if use_rails_env
      exclude_unsubstituted_envvars(hash)
    end

    def exclude_unsubstituted_envvars(value)
      if value.is_a?(Hash)
        value.map { |k, v| [k, exclude_unsubstituted_envvars(v)] }.to_h.compact
      elsif value.is_a?(Array)
        value.map { |v| exclude_unsubstituted_envvars(v) }.compact
      elsif value.is_a?(String) && value =~ /^\$.+/
        nil
      else
        value
      end
    end
  end
end
