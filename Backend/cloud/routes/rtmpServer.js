const NodeMediaServer = require('node-media-server');

const config = {
    rtmp: {
        port: 7898, // RTMP port
        chunk_size: 60000,
        gop_cache: true,
        ping: 30,
        ping_timeout: 60,
    },
    http: {
        port: 8000, // HTTP port for serving the stream
        allow_origin: '*',
    },
    hls: {
        port: 8080, // HLS port
        allow_origin: '*',
    },
};

const nms = new NodeMediaServer(config);
nms.run();
