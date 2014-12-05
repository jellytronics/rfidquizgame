#!/bin/sh
#https://gorails.com/setup/osx/10.10-yosemite

cd ~/rfidquizstash

brew update
brew install rbenv ruby-build

echo 'if which rbenv > /dev/null; then eval "$(rbenv init -)"; fi' >> ~/.zshrc
source ~/.zshrc

rbenv install 2.1.3
rbenv global 2.1.3
ruby -v
# ruby 2.1.3

sudo gem install rails
rbenv rehash
rails -v
# Rails 4.1.6

sudo gem update --system

<<MYSQL
brew install -g mysql
# To have launchd start mysql at login:
ln -sfv /usr/local/opt/mysql/*plist ~/Library/LaunchAgents
# Then to load mysql now:
launchctl load ~/Library/LaunchAgents/homebrew.mxcl.mysql.plist
MYSQL

<<POSTGRESQL
brew install postgresql
# To have launchd start postgresql at login:
ln -sfv /usr/local/opt/postgresql/*plist ~/Library/LaunchAgents
# Then to load postgresql now:
launchctl load ~/Library/LaunchAgents/homebrew.mxcl.postgresql.plist
POSTGRESQL

sudo gem install jekyll

brew install python
pip install virtualenv
pip install -U numpy scipy matplotlib scikit-learn
pip install Pygments
