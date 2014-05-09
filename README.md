#RFID QUIZ Game


## Information

tO be updated


## Installation


- Install the base system using the insturctions from the link below
  ```html
  http://archlinuxarm.org/platforms/armv7/ti/beaglebone-black
  ```
  Note that extracting tar files to FAT volumes will incur an error due to permissions write failure on FAT systems. use --no-same-permissions

- Set up environment

  ```sh
  pacman -Syu
  pacman -S git udisks udevil
  #echo "formatting sdcard"
  #mkfs.ext4 /dev/mmcblk0p1
  echo "mounting sdcard @ /media/sdcard"
  udevil mount -o ro,noatime /dev/mmcblk0p1 /media/sdcard
  ```


- Set up ssh

  ```sh
  systemctl start sshd
  systemctl enable sshd
  systemctl is-enabled sshd
  if cat 2> /dev/null
    then
    echo "ssh keys available"
  else
    echo "ssh keys unavailable. making one now"
    cp ~/.ssh/id_rsa ~/.ssh/id_rsa.bu
    cp ~/.ssh/id_rsa.pub ~/.ssh/id_rsa.pub.bu
    ssh-keygen -q -f ~/.ssh/id_rsa -P ""
  fi

  echo "Bringing ssh-agent to sys env"
  eval $(ssh-agent)

  chmod 0600 /root/.ssh/id_rsa.pub
  echo "Please enter "'""'" as passphrase in next line." 
  ssh-add ~/.ssh/id_rsa.pub
  echo "copy what you are about to see into the ssh-keys of your github account"
  cat ~/.ssh/id_rsa.pub
  ```

- Git clone this
  ```sh
  cd ~
  git clone git@github.com:jellyjellyrobot/rfidquizgame.git
  ```

- Start install script

  ```sh
  cd ~/rfidquizgame/setup/
  chmod +x setup.sh #if needed
  ./setup.sh
  ```

- Brew a cuppa coffee, chillout and Enjoy!!!

## Usage (QuizMaster)

- To be updated

## Usage (Contestants)

- To be updated

## Usage (Unified Bash Interface)

- Type

  ```sh
  cd ~/rfidquizgame
  setup/tmux_commander.sh
  ```



## Comments

I will try my best to work on the codes and iron out all the kinks (I'm a student btw)

I will port/fork whatever sub project within Experiments when the code matures and gains suitable applications externally.