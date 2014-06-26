HOSTNAME=`uname -n`
KERNEL=`uname -r`
CPU=`uname -p`
ARCH=`uname -m`

# The different colours as variables

W="\033[01;37m"
B="\033[01;34m"
R="\033[01;31m" 
X="\033[00;37m"

echo "$R#===================================================#" 
echo  "       $W Welcome $B $USER $W to $B $HOSTNAME  " 
echo  "       $R ARCH   $W= $ARCH                     " 
echo  "       $R KERNEL $W= $KERNEL                   " 
echo  "       $R CPU    $W= $CPU                      " 
echo  "$R#==================================================#"

command cowsay $(fortune)

echo "Please do not screw this system up - XOXO Jeremias"

