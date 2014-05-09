#!/bin.bash


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

echo "Bringing ssh-agent to sys env"
eval $(ssh-agent)
chmod 0600 /root/.ssh/id_rsa.pub
echo "Please enter "'""'" as passphrase in next line." 
ssh-add ~/.ssh/id_rsa.pub
echo "copy what you are about to see into the ssh-keys of your github account"
cat ~/.ssh/id_rsa.pub

