#!/usr/bin/env/bash
echo "+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+--+-+-+-+--+-+-+-+--+-+-+-+-+-+-+-+-+-+"
echo "+- _______  _______  _______  ___   _  _______  _______    _______  __   __  _______  __    _  _______  _______   -+"
echo "+- |       ||       ||       ||   | | ||       ||       |  |       ||  | |  ||       ||  |  | ||       ||       | -+"
echo "+- |  _____||   _   ||       ||   |_| ||    ___||_     _|  |    ___||  |_|  ||    ___||   |_| ||_     _||  _____| -+"
echo "+- | |_____ |  | |  ||       ||      _||   |___   |   |    |   |___ |       ||   |___ |       |  |   |  | |_____  -+"
echo "+- |_____  ||  |_|  ||      _||     |_ |    ___|  |   |    |    ___||       ||    ___||  _    |  |   |  |_____  | -+"
echo "+- _____|  ||       ||     |_ |    _  ||   |___   |   |    |   |___  |     | |   |___ | | |   |  |   |   _____| | -+"
echo "+- |_______||_______||_______||___| |_||_______|  |___|    |_______|  |___|  |_______||_|  |__|  |___|  |_______| -+"
echo "- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - "
echo " - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  "
echo ""
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
echo " - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  "
echo "+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+--+-+-+-+--+-+-+-+--+-+-+-+-+-+-+-+-+-+"

exit 0
