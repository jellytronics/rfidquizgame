if test -d ~/rfidquizgame
	then

	NOW=$(date +"%m-%d-%Y %T")
	echo "Updating rfidquizgame - $NOW"

	cd ~/rfidquizgame

	git pull
	git add -A
	git commit -m "Auto Backup and Sync - $NOW"
	git push origin master
	#reset_git_submodules
	git pull

else
	cd ~
	git clone git@bitbucket.org:jellyjellyrobot/rfidquizgame.git

fi