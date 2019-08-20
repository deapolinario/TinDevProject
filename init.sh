#!/bin/bash
#
# Start or Stop Project TinDev
#

start(){
  cd backend
  yarn dev >backend.log 2>&1 &
  cd ../frontend
  yarn start >frontend.log 2>&1 &
}

stop(){
  killall -9 node >/dev/null 2>&1 &
}

CMD=$1
#check parameters
if [[ "$CMD" == "" ]]
  then
    echo "Comandos:"
    echo "  'start' - Start backend and frontend TinDev "
    echo "  'stop' - Stop all apps TinDev"
    exit 1
fi

if [ "$CMD" == "start" ]
  then
    stop
    start
    exit 0
fi

if [ "$CMD" == "stop" ]
  then
    stop
    exit 0
fi
