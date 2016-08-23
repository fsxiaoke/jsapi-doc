/**
 * FS mobile debug server
 * 
 * @author chenp(chep@fxiaoke.com)
 */
let path    = require('path');
let logger  = require('morgan');
let express = require('express');

let app    = express();
let server = require('http').createServer(app);
let io     = require('socket.io')(server);
let nsp    = io.of('/fs-jsapi');

const CMD_JOIN_ROOM  = 'fs:join';
const CMD_LEAVE_ROOM = 'fs:leave';
const CMD_MESSAGE    = 'fs:msg';

// log requests
app.use(logger('dev'));
// set static dir
app.use(express.static(__dirname));

let port = process.env.PORT || 8888;
server.listen(port, function() {
    console.log('Server listening on port %d', port);
});

// 所有房间的客户端列表
let rooms = {};
nsp.on('connection', function(socket) {

    // 请求加入房间
    socket.on(CMD_JOIN_ROOM, function(data) {
        if (!data || !data.roomId) {
            socket.emit(CMD_JOIN_ROOM, {
                code: 404,
                message: 'RoomId does not exist',
            });
            return;
        }

        console.log('Client %s join room %s', socket.id, data.roomId);
        socket.join(data.roomId, function(err) {
            if (err) {
                console.error(err);
                socket.emit(CMD_JOIN_ROOM, {
                    code: 500,
                    message: 'Join room ' + data.roomId + ' fail',
                });
                return;
            }

            console.log('Client %s join room %s success', socket.id, data.roomId);
            if (!rooms.hasOwnProperty(data.roomId)) {
                rooms[data.roomId] = 1;
            } else {
                rooms[data.roomId] += 1;
            }

            // http://stackoverflow.com/questions/10058226/send-response-to-all-clients-except-sender-socket-io
            // 这种方式才会广播到自己
            socket.roomId = data.roomId;
            nsp.in(data.roomId).emit(CMD_JOIN_ROOM, {
                code: 200,
                roomId: socket.roomId,
                clientId: socket.id,
                clientCount: rooms[data.roomId],
            });
        });

    });

    // 发送接收消息
    socket.on(CMD_MESSAGE, function(data) {
        if (!data || !data.roomId) {
            socket.emit(CMD_MESSAGE, {
                code: 404,
                message: 'RoomId does not exist',
            });
            return;
        }
        console.log('Client %s post message "%s" to room %s', socket.id, JSON.stringify(data.msg), data.roomId);
        // 这种方式不会广播到自己
        socket.broadcast.to(data.roomId).emit(CMD_MESSAGE, data);
    });

    // 断开连接
    socket.on('disconnect', function() {
        console.log('Client %s leave', socket.id);

        // 通知所在的房间说明下自己要离开了
        if (socket.roomId) {
            var roomId = socket.roomId;
            // 这种方式不会广播到自己
            socket.broadcast.to(roomId).emit(CMD_LEAVE_ROOM, {
                code: 200,
                roomId: roomId,
                clientId: socket.id,
                clientCount: --rooms[roomId],
            });
            // 更新房间的客户端列表
            if (rooms[roomId] <= 0) {
                delete rooms[roomId];
            }
            console.log('Room %s has %d clients', roomId, rooms[roomId]);
        }

        // 应该是不需要的，默认会离开所有房间
        socket.leaveAll();
    });

});



