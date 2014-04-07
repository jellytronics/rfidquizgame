#!/bin/bash

#Creates 1 tmux session with
	#Window 1 - Overral System Attributes | I/O Statistics | Mifare Statistics
		#Pane 1 - Top (Command)
		#Pane 2 - Mifare daemon
		#Pane 3 - GPIO
	#Window 2 - Quiz Interface
	#Window 3 - Server Interface
	#Window 4 - Development Interface
		#Pane 1 - Git

chmod +x ~/rfidquizgame/website/startup_website.sh

tmux has-session -t controller | if [ $? != 0 ]
then

tmux new-session -s controller -n system_att -d
tmux split-window -v -t controller
tmux split-window -h -t controller
tmux new-window -n quiz_interface -t controller
tmux new-window -n server_interface -t controller
tmux new-window -n dev -t controller

tmux send-keys -t controller:1.1 'top' C-m
tmux send-keys -t controller:1.2 '' C-m
tmux send-keys -t controller:1.3 '' C-m
tmux send-keys -t controller:2 'cd ~/rfidquizgame' C-m
tmux send-keys -t controller:3 'cd ~/rfidquizgame' C-m
tmux send-keys -t controller:3 'website/startup_website.sh' C-m
tmux send-keys -t controller:4.1 'cd ~/rfidquizgame' C-m

fi






