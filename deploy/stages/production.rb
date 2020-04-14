server '142.93.249.102',
    roles: %w{app},
    user: 'savetodrive',
    port: 22

set :stage, :production

namespace :production do
    task :ask_production_confirmation do
        set(:confirmed) do
            puts <<-WARN
            ========================================================================
                WARNING: You're about to perform actions on production server(s)
                Please confirm that all your intentions are kind and friendly
            ========================================================================
            WARN
            
            puts "Are you sure you want to continue?"
            ask (:confirmation)
            
            if fetch(:confirmation) == 'yes' then true else false end
        end
    
        unless fetch(:confirmed)
            puts "\nDeploy cancelled!"
            exit
        end
    end
end

namespace :deploy do
    before :starting, "production:ask_production_confirmation"
end
