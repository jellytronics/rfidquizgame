##The installation process consists of creating a micro SD card from which to boot into Arch Linux ARM, then installing to eMMC if you choose to. In order to boot to SD, you must hold down the switch on the top of the board near the micro SD slot as you apply power. This will tell the board to boot from SD first instead of eMMC, and it will remember this until you remove power so future reboots will always boot from SD.

#A process for installing to eMMC in one step will be coming soon.

#Note
#The BeagleBone Black can draw more than 500mA through the mini-USB port, particularly when using an SD card. For this reason, we recommend using a USB charger that can supply more than this as opposed to a port on a computer.

#SD Card Creation

#At a minimum, you need to create the first partition on an SD card to store the bootloader files and kernel uImage. For the root filesystem you can choose to use either a USB drive or the second partition on the SD card. This example will partition an SD card. Replace instances of /dev/sdX with the device that the card registers as on your computer.
#Start fdisk to partition the SD card:
fdisk /dev/sdX
#At the fdisk prompt, delete old partitions and create a new one:
#Type o. This will clear out any partitions on the drive.
#Type p to list partitions. There should be no partitions left.
#Now type n, then p for primary, 1 for the first partition on the drive, enter to accept the default first sector, then +64M to set the size to 64MB.
#Type t to change the partition type, then e to set it to W95 FAT16 (LBA).
#Type a to set the bootable flag on the first partition.
#Now type n, then p for primary, 2 for the second partition on the drive, and enter twice to select the default first and last sectors.
#Write the partition table and exit by typing w.
#Create the FAT16 filesystem:
mkfs.vfat -F 16 /dev/sdX1
#Create the ext4 filesystem:
mkfs.ext4 /dev/sdX2
#Download the BeagleBone bootloader tarball and extract the files onto the first partition of the SD card. These files contain the bootloaders needed to load the kernel. The file MLO needs to be the first file put onto the FAT partition, and extracting the tarball as-is should do this for you. If you have problems getting to U-Boot, re-format and place the files manually.
wget http://archlinuxarm.org/os/omap/BeagleBone-bootloader.tar.gz
mkdir boot
mount /dev/sdX1 boot
tar -xvf BeagleBone-bootloader.tar.gz -C boot --no-same-permissions --no-same-owner
umount boot
#Download the root filesystem tarball and extract it (as root, not via sudo) to the ext3 partition on either the SD card or the USB drive. It is important to do this as root, as special files need to be created as part of the filesystem that can only be created by root.
wget http://archlinuxarm.org/os/ArchLinuxARM-am33x-latest.tar.gz
mkdir root
mount /dev/sdX2 root
tar -xf ArchLinuxARM-am33x-latest.tar.gz -C root
umount root
#Insert the card into the system and apply power while holding down the boot selection switch located on the top of the board near where the micro SD card plugged in. This will tell the board to boot from SD instead of eMMC. After the system is booted, you can SSH to the IP that gets assigned and login with the user/pass: root/root.
#Installing to eMMC

#After booting into Arch Linux ARM, ensure you have wget and dosfstools installed:
pacman -Syu wget dosfstools
#Follow the above steps 4 through 7 using the device /dev/mmcblk1p[1|2]. Repartitioning is not required since the eMMC is already partitioned correctly.
#Power down the system, waiting until all the LEDs go out:
poweroff
#Remove power, remove the micro SD card, then reapply power. The system will boot into eMMC. If an SD card created with the above steps is still in the system when it boots, it will boot to the SD card instead of eMMC.
#To use the micro SD slot for general storage, simply partition and format the device as a normal drive. Also note that the card must be inserted at boot for it to be recognized.
#Bootloader configuration

#The bootloader tarball you downloaded while making your SD card contains a default U-boot configuration in the uEnv.txt file. If you need to change the configuration for any reason, just edit that file.
#The default uEnv.txt configuration file loads the kernel zImage and dtb from the second ext4 partition on the SD card or eMMC, and tells the kernel to look for the root filesystem on the second partition.