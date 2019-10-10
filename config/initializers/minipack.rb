Minipack.configuration do |c|
  # By default c.cache is set to `false`, which means an application always parses a
  # manifest.json. In development, you should set cache false usually.
  # Instead, setting it `true` which caches the manifest in memory is recommended basically.
  c.cache = !Rails.env.development?

  # Register a path to a manifest file here. Right now you have to specify an absolute path.
  c.manifest = if Rails.env.development?
    'http://localhost:9000/packs/manifest.json'
  else
    Rails.root.join('public', 'packs', 'manifest.json')
  end

  # If you are not extracting CSS in your webpack config you should set this flag to false
  # c.extract_css = !Rails.env.development?

  # The base directory for the frontend system. By default, it will be
  # `Rails.root`.
  # c.base_path = Rails.root
  #
  # Suppose you want to change the root directory for the frontend system such as `frontend`.
  # Note that a base_path can be a relative path from `Rails.root`.
  # c.base_path = 'frontend'

  # You can invokes a command to build assets in node from Minipack.
  #
  # When running tests, the lazy compilation is cached until a cache key, based
  # on file checksum under your tracked paths, is changed. You can configure
  # which paths are tracked by adding new paths to `build_cache_key`. Each path
  # can be a relative path from the `base_dir`.
  #
  # The value will be as follows by default:
  # c.build_cache_key = [
  #   'package.json', 'package-lock.json', 'yarn.lock', 'webpack.config.js',
  #   'webpackfile.js', 'config/webpack.config.js', 'config/webpackfile.js',
  #   'app/javascripts/**/*',
  # ]
  #
  # You can override it.
  # c.build_cache_key = ['package.json', 'package-lock.json', 'config/webpack.config.js', 'src/**/*']
  #
  # Or you can add files in addition to the defaults:
  # c.build_cache_key << 'src/**/*'

  # A command to to build assets. The command you specify is executed under the `base_dir`.
  # c.build_command = 'node_modules/.bin/webpack'
  #
  # You may want to customize it with options:
  # c.build_command = 'node_modules/.bin/webpack --config config/webpack.config.js --mode production'
  #
  # You are also able to specify npm run script.
  # c.build_command = 'npm run build'

  # A full package installation command, with it's arguments and options. The command is executed under the `base_path`.
  # c.pkg_install_command = 'npm install'
  #
  # If you prefer `yarn`:
  # c.pkg_install_command = 'yarn install'
end
