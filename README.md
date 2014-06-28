#RFID QUIZ Game


## Information

This project is created as a scalable, networked based quiz game where RFID cards are used to answer questions posted on a locally hosted website.

## Technical Information

The official supported platform is the BeagleBone Black.
Testing will be conducted on Raspberry Pis and Odriod U3 platforms.

## Installation

- Quick Disclaimer

  The installation process will take about an hour depending on your internet speed.

- Enable system services

  Add nameserver to dns lookup table, then set write protection to it

  ```sh
  echo "nameserver 8.8.8.8" >> /etc/resolv.conf
  chattr +i /etc/resolv.conf
  ```

  start daemons

  ```sh
  systemctl start dhcpcd
  systemctl enable dhcpcd
  systemctl start sshd
  systemctl enable sshd
  ```

- Install the base system using the instructions from the link below

  ```html
  http://archlinuxarm.org/platforms/armv7/ti/beaglebone-black
  ```

  For example, if you are using the supplied sd card...

  ```sh
  cd ~
  rm -r test
  mkdir test
  cd test
  wget http://archlinuxarm.org/os/omap/BeagleBone-bootloader.tar.gz
  wget http://archlinuxarm.org/os/ArchLinuxARM-am33x-latest.tar.gz
  pacman -Syu --needed wget dosfstools ntp
  timedatectl set-timezone Asia/Singapore
  timedatectl set-ntp 1 #sets ntp
  /usr/bin/ntpdate -b -s -u pool.ntp.org
  hwclock --systohc --utc
  cd ~/test
  mkfs.vfat -F 16 /dev/mmcblk1p1
  mkfs.ext4 /dev/mmcblk1p2
  mkdir boot
  mount /dev/mmcblk1p1 boot
  tar -xvf BeagleBone-bootloader.tar.gz -C boot --no-same-permissions --no-same-owner --touch
  umount boot
  mkdir root
  mount /dev/mmcblk1p2 root
  tar -xf ArchLinuxARM-am33x-latest.tar.gz -C root
  umount root
  poweroff
  ```

  If all else fails, you can try this fundamental install script adapted from http://archlinuxarm.org/forum/viewtopic.php?f=48&t=5852

  ```sh
  pacman -Syu --needed wget dosfstools ntp
  timedatectl set-timezone Asia/Singapore
  timedatectl set-ntp 1 #sets ntp
  /usr/bin/ntpdate -b -s -u pool.ntp.org
  hwclock --systohc --utc
  fdisk /dev/mmcblk1
  mkfs.vfat -F 16 /dev/mmcblk1p1
  cd ~/test
  mount /dev/mmcblk0p1 /mnt
  mkdir /mnt-boot
  mount /dev/mmcblk1p1 /mnt-boot
  cp /mnt/* /mnt-boot
  umount /mnt
  umount /mnt-boot
  pacman -S arch-install-scripts
  mkfs.ext4 /dev/mmcblk1p2
  mount /dev/mmcblk1p2 /mnt
  pacstrap /mnt base
  arch-chroot /mnt
  echo "en_US.UTF-8 UTF-8" >> /etc/locale.gen
  locale-gen
  pacman -Syu --needed ntp openssh
  pacman -S --needed base-devel
  pacman -R linux-armv7
  pacman -S linux-am33x
  systemctl enable dhcpcd@eth0
  systemctl enable sshd
  passwd
  exit
  umount /mnt
  poweroff
  ```

  Note that extracting tar files to FAT volumes will incur an error due to permissions write failure on FAT systems. use --no-same-owner and -m

- Set up environment

  From this point onwards, you shld be ssh-ed into the plafform

  ```sh
  pacman -Syu
  pacman -S --needed git udisks udevil openssh ntp
  timedatectl set-timezone Asia/Singapore
  timedatectl set-ntp 1 #sets ntp
  /usr/bin/ntpdate -b -s -u pool.ntp.org
  hwclock --systohc --utc
  #echo "formatting sdcard"
  #mkfs.ext4 /dev/mmcblk0p1
  echo "mounting sdcard @ /media/sdcard"
  udevil mount -o ro,noatime /dev/mmcblk0p1 /media/sdcard
  ```


- Set up ssh

  ```sh
  systemctl start sshd
  systemctl enable sshd
  if cat .ssh/id_rsa 2> /dev/null
    then
    echo "ssh keys available"
  else
    echo "ssh keys unavailable. making one now"
    mkdir ~/.ssh
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

- Configure Git

  ```sh
  git config --global user.email "you@example.com"
  git config --global user.name "Your Name"
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

## Other stuff

- Setup hostname

  ```sh
  hostnamectl set-hostname myhostname
  vim /etc/hosts

  passwd

  cat .ssh/id_rsa.pub | ssh root@hostname 'cat >> .ssh/authorized_keys'
  ```

## Usage (QuizMaster and Contestants)

- It should be intuitive.

## Usage (Unified Bash Interface)

- Type

  ```sh
  cd ~/rfidquizgame
  setup/tmux_startup.sh
  ```



## Comments

I will try my best to work on the codes and iron out all the kinks. (I'm a n00b student btw)

I will port/fork whatever sub project within Experiments when the code matures and gains suitable applications externally.

This program contains at least one easter egg.
