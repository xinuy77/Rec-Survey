# Rec-Survey

## General Setup
1. Configure config/default.json
    - Mongo and Kurento host ip to current hostmachines private ip address
    - Set global ip for view port 
2. Configure rec-survey-view/nginx.conf
    - set reverse proxy location to your local private ip address
3. Install docker and docker-compose
    - https://docs.docker.com/compose/install/
    - https://docs.docker.com/install/linux/docker-ce/ubuntu/
4. Start application by following command

```
$ docker-compose up -d
```

## Setup in hosted server
You need to setup TURN server to host this application in cloud environment  
1. Setting up TURN server: https://doc-kurento.readthedocs.io/en/6.6.2/faq.html
    - check connectivity of your TURN server: https://webrtc.github.io/samples/src/content/peerconnection/trickle-ice/
2. configure STUN and TURN server address of mediaserver in docker-compose
    - default STUN server is stun.l.google.com:19302
    - default TURN URL is kurento:kurentopw@your-global-ip-here:3478
3. configure client side STUN and TURN server address
    - client side config located in rec-survey-view/src/config/index.js
4. Follow General Setup written above from step 1

## Required ports

|Application         |Protocol/Port  |
|:------------------:|:-------------:|
|Kurento Media Server|udp: 0-65535   |
|coTurn Server       |tcp & udp: 3478|
|rec-survey-view     |tcp: 80, 443   |

## Specifications for Deployment
- Using Ubuntu 16.04 LTS is highly recommended
