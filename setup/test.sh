#!/bin/bash
function addtofile {
	if cat $1 | grep $2
		then
		echo "it is already included"
	else
		cat $2 >> $1
	fi
}

addtofile ~/noob "nooby nooby noob"
addtofile ~/noob "12312 123 123 123"
