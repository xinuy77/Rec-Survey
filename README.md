# Rec-Survey
## Setup
1. Configure config/default.json
    - Mongo and Kurento host ip to current hostmachines private ip
    - Set global ip for view port 
2. Install docker and docker-compose
3. Start application by following command

```
$ docker-compose up -d
```

## Setup in cloud server
You would need to setup STUN and TURN server to host this application in cloud environment  
1. configure STUN and TURN server address of mediaserver in docker-compose
    - default STUN server is stun.l.google.com:19302
    - default TURN URL is kurento:kurentopw@<globalip>:3478
2. configure client config STUN and TURN server address
    - more to be added later

## Required port

|Application         |Protocol/Port  |
|:------------------:|:-------------:|
|Kurento Media Server|udp: 0-65535   |
|coTurn Server       |tcp & udp: 3478|
|rec-survey-api      |tcp: 2000      |
