
namespace :yarn do
    desc "Running yarn Install"
    task :install do |task|
      on roles(:app) do
        within release_path do
          execute :test, "-d #{current_path}/node_modules && cp -r #{current_path}/node_modules ./ || true"
          execute :"~/.yarn/bin/yarn", "install --no-lockfile --production"
        end
      end
    end
  end
  