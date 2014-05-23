if [[ $(sw_vers -productName) == *Mac* ]]
	then
	echo "hi mac, please install the desktop gui version"
	echo "ktksbye"
else
	if hash hamachi 2> /dev/null
		then
		hamachi installed
	else
		pacman -S --needed wget
		cd ~
		wget https://aur.archlinux.org/packages/lo/logmein-hamachi/logmein-hamachi.tar.gz
		tar -xzf ./logmein-hamachi.tar.gz
		cd logmein-hamachi
		makepkg -s --asroot
		pacman -U 
