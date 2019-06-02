'use strict';

const {Docker} = require('node-docker-api');

const docker = new Docker({
    socketPath: proces.env.DOCKER_SOCKET_PATH || '/var/run/docker.sock',
});


// List
docker.container.list()
    .then(containers => containers[0].status())
    .then(container => container.top())
    .then(processes => console.log(processes))
    .catch(error => console.log(error));
