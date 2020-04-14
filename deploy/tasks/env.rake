require 'json'

namespace :env do
  desc 'Upload .env'
  task :create do
    on roles(:app) do
        within release_path do
            execute :cp, '~/webapp/parameters.env .env'
        end
    end
  end
end
