# Primero setup from scratch

These instructions were followed using Ubuntu 16.04. It is assumed Ubuntu we are starting with Linux Ubuntu 16.04

Assuming you are starting in the home directory: ~/


Install git if it is not installed yet:
```
sudo apt-get install git
```


Install couchdb:
```
sudo apt-get install couchdb
```


Install java:
```
sudo apt-get install default-jdk
```

Install rvm:
```
\curl -sSL https://get.rvm.io | bash -s stable
```

Add rvm to console modifying the file bashrc. Open the file
```
vim ~/.bashrc
```
And add:

```
export PATH="$PATH:$HOME/.rvm/bin/" #Add RVM to path for scripting
source ~/.rvm/scripts./rvm
```

Clone the repository (On primero directory).
```
git clone https://<your_bb_user>@bitbucket.org/quoin/primero.git
cd ~/primero
```

From here on, we assume we are on ~/primero

Install ruby version
```
rvm install 2.1.5 --patch railsexpress -n ruby-2.1.5-railsexpress
```


Run rvm
```
source ~/.rvm/scripts/rvm
```


Check the ruby version we are on
```
rvm list
```


Install Bundler
```
gem install bundler
```


Install gems
```
bundle install
```


Make sure CouchDB is running
```
curl http://localhost:5984
```


Get a list of databases from couchDB
```
curl -X GET http://127.0.0.1:5984/_all_dbs
```


Create couchdb.yml file from example
```
cp ~/primero/config/couchdb.yml.example ~/primero/config/couchdb.yml
```

Create mailers.yml file from example
```
cp ~/primero/config/mailers.yml.example ~/primero/config/mailers.yml
```

Create sunspot.yml file from example
```
cp ~/primero/config/sunspot.yml.example ~/primero/config/sunspot.yml
```

Display all the Rake tasks
```
bundle exec rake -T
```


Create system administrator for couchdb
```
bundle exec rake db:create_couch_sysadmin[primero,primero]
```

Migrate
```
bundle exec rake db:migrate
bundle exec rake db:migrate:design
```


Seed with data
```
bundle exec rake db:seed
```


Restart Solr
```
bundle exec rake sunspot:solr:restart
```


Reindex
```
bundle exec rake sunspot:solr:reindex
```


Run Server
```
bundle exec rails server
```
