#!/usr/bin/env/bash
echo "+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+"
echo " ---> starting socket-events..."
echo " ---> spinning up docker services..."

docker-compose up -d --build

echo " ---> waiting for server to be listening..."

SENTINEL_STRING="server listening"

( docker-compose logs -f & )| grep -q "${SENTINEL_STRING}"

if [ $? -eq 0 ]; then
  echo " ---> ...ok"
else
  echo " ---> there was a problem starting the server" >&2
  exit $?
fi

echo " ---> waiting for chat app to be listening..."

SENTINEL_STRING="Ready on http://localhost:3000"

( docker-compose logs -f & )| grep -q "${SENTINEL_STRING}"

if [ $? -eq 0 ]; then
  echo " ---> ...ok"
else
  echo " ---> there was a problem starting the chat app" >&2
  exit $?
fi

echo " ---> ...done"
echo "+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+"

exit 0
