#!/usr/bin/env/bash
echo "+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+--+-+-+-+--+-+-+-+--+-+-+-+--+-+-"
echo " ---> stopping socket-events"

echo " ---> stopping docker services..."

docker-compose down

echo " ---> ...ok"

echo " ---> cleaning up docker..."

docker system prune -f

echo " ---> ...ok"


echo " ---> done"
echo "+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+--+-+-+-+--+-+-+-+--+-+-+-+--+-+-"

exit 0
