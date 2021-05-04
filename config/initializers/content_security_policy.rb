# frozen_string_literal: true

# Define an application-wide content security policy
# For further information see the following documentation
# https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy

return unless Rails.env.production?

self_sources = %i[self https]
media_sources =
  case ENV['PRIMERO_STORAGE_TYPE']
  when 'microsoft'
    self_sources + ["https://#{ENV['PRIMERO_STORAGE_AZ_ACCOUNT']}.blob.core.windows.net"]
  else
    self_sources
  end

Rails.application.config.content_security_policy do |policy|
  policy.default_src(*self_sources)
  policy.font_src(*self_sources)
  policy.img_src(*media_sources)
  policy.media_src(*media_sources)
  policy.object_src(:none)
  policy.script_src(*self_sources)
  policy.style_src(*self_sources)
  policy.child_src(*self_sources)
  policy.frame_src(:none)

  # Specify URI for violation reports
  # policy.report_uri "/csp-violation-report-endpoint"
end

# If you are using UJS then enable automatic nonce generation
# Rails.application.config.content_security_policy_nonce_generator = -> request { SecureRandom.base64(16) }

# Report CSP violations to a specified URI
# For further information see the following documentation:
# https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy-Report-Only
Rails.application.config.content_security_policy_report_only = true
