namespace :subscription do
    desc 'Copy key'
    task :copy_key do
      on roles(:app) do
        within release_path do
            execute :cp, "~/webapp/keys/subscription-key.pem storage/"
        end
      end
    end  
  end
  