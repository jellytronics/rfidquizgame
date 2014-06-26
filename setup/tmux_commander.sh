#!/bin/bash



cp rfidquizgame/linux/controller.yml ~/.tmuxinator/controller.yml
tmuxinator start controller

<<DEPRECIATED

echo "Entering TMUX Command Mode"

echo "Setting Permissions"

chmod +x ~/jellythings/Experiments/Mifare/tmux_mifare.sh
chomd +x ~/jellythings/Experiments/Sdr/tmux_sdr.sh
chmod +x ~/jellythings/StartupScripts/tmux_utils.sh

##	Ref Materials
#http://wiki.gentoo.org/wiki/Tmux

echo "Select options :-"

select choice in "Mifare Project" "Software Defined Radio Project" "System I/O Utilities" "Kill all TMUX Sessions" "Run All Installation Scripts" "Run Installation Scripts Interactively" "Run Startup Scripts" "Update All" "Update All ++" "Update All -force" "Make files executable" "Exit"; do
    case $choice in
        "Mifare Project" ) ~/jellythings/Experiments/Mifare/tmux_mifare.sh;;
        "Software Defined Radio Project" ) ~/jellythings/Experiments/Sdr/tmux_sdr.sh;;
		"System I/O Utilities" ) ~/jellythings/StartupScripts/tmux_utils.sh;;
		"Kill all TMUX Sessions" ) while tmux list-sessions | grep "windows"; do tmux kill-session; done;;
		"Run All Installation Scripts" ) ~/jellythings/StartupScripts/install-all-allplatforms.sh;;
		"Run Installation Scripts Interactively" ) ~ /jellythings/StartupScripts/install-all-allplatforms.sh -i;;
		"Run Startup Scripts" ) ~/jellythings/StartupScripts/startup-all-allplatforms.sh;;
		"Update All" ) ~/jellythings/StartupScripts/git_update_all.sh;;
		"Update All ++" ) ~/jellythings/StartupScripts/git_update_all.sh --all;;
		"Update All -force" ) ~/jellythings/StartupScripts/git_update_all.sh -f;;
		"Make files executable" ) chmod -R -f +x ~/jellythings;;
		"Exit" ) break;;
    esac
done

DEPRECIATED
