#!/bin/bash

#Creates 1 tmux session with
	#Window 1 - Overral System Attributes | I/O Statistics | Mifare Statistics
		#Pane 1 - Top (Command)
		#Pane 2 - Mifare daemon
		#Pane 3 - GPIO
	#Window 2 - Quiz Interface
	#Window 3 - Server Interface
		#Pane 1 - startup_website.sh --> Node script
		#Pane 2 - mongod
		#Pane 3 - mongo
	#Window 4 - Server Interface 2
		#Pane 1 - node.js file server at ~/ with http-server
		#Pane 2 - 
	#Window 5 - Development Interface
		#Pane 1 - Git

cd ~/rfidquizstash
cp ~/rfidquizgame/website/mongodb.conf ~/rfidquizstash/website/mongodb.conf
cp ~/rfidquizgame/website/mongodb.yml ~/rfidquizstash/website/mongodb.yml

chmod +x ~/rfidquizgame/website/startup_website.sh
chmod +x ~/rfidquizgame/website/start_mongod.sh

##Tmuxinator option

#cp ~/rfidquizgame/linux/
#tmuxinator start 



#script starts here yoz

tmux has-session -t controller | if [ $? != 0 ]
then

tmux new-session -s controller -n system_att -d
tmux split-window -v -t controller
tmux split-window -h -t controller
tmux new-window -n quiz -t controller
tmux new-window -n serv1 -t controller
tmux split-window -v -t controller
tmux split-window -h -t controller
tmux new-window -n serv2 -t controller
tmux split-window -v -t controller
tmux split-window -h -t controller
tmux new-window -n dev -t controller

tmux send-keys -t controller:1.1 'cd ~/rfidquizgame' C-m
tmux send-keys -t controller:1.2 'cd ~/rfidquizgame' C-m
tmux send-keys -t controller:1.3 'cd ~/rfidquizgame' C-m
tmux send-keys -t controller:2.1 'cd ~/rfidquizgame' C-m
tmux send-keys -t controller:3.1 'cd ~/rfidquizgame' C-m
tmux send-keys -t controller:3.2 'cd ~/rfidquizgame' C-m
tmux send-keys -t controller:3.3 'cd ~/rfidquizgame' C-m
tmux send-keys -t controller:4.1 'cd ~/rfidquizgame' C-m
tmux send-keys -t controller:4.2 'cd ~/rfidquizgame' C-m
tmux send-keys -t controller:4.3 'cd ~/rfidquizgame' C-m
tmux send-keys -t controller:5.1 'cd ~/rfidquizgame' C-m

tmux send-keys -t controller:1.1 'top' C-m
tmux send-keys -t controller:1.2 'sleep 1' C-m
tmux send-keys -t controller:1.3 'sleep 1' C-m
tmux send-keys -t controller:3.1 'website/startup_website.sh' C-m
tmux send-keys -t controller:3.2 'sleep 5; mongo' C-m
tmux send-keys -t controller:3.3 'website/start_mongod.sh' C-m
tmux send-keys -t controller:4.1 'node_modules/http-server/bin/http-server -p 8081' C-m
tmux send-keys -t controller:5.1 'setup/git_update.sh' C-m

fi

tmux attach -t controller





