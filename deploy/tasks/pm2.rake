require 'json'

namespace :pm2 do
  desc 'Upload deployment configuration'
  task :upload_conf do
    on roles(:app) do
      upload! 'deploy/ecosystem.json', File.join(fetch(:deploy_to), 'ecosystem.json')
    end
  end 

  desc 'Start/Restart app gracefully'
  task :start do
    on roles(:app) do
      within fetch(:deploy_to) do
        if (fetch(:restart) === 'true')
          execute :pm2, 'startOrRestart ecosystem.json'
        else
          execute :pm2, 'startOrGracefulReload ecosystem.json'
        end  
      end
    end
  end 
end
