const express = require('express')
const cors = require('cors')
const path = require('path')
const http = require('http')
const socketio = require('socket.io')
const formatMessage = require('./engines/messages')
const {userJoin, getCurrentUser, userLeave, getRoomUsers} = require('./engines/users')
const app = express()
const server = http.createServer(app)
const io = socketio().listen(server)
app.use(cors())
app.use(express.static(path.join(__dirname, 'public')))
io.on('connection', socket => {
    socket.on('joinRoom',({username,room})=>{
        const user = userJoin(socket.id, username, room)
        socket.join(user.room)
        console.log(`${user.username} connected`)
        socket.emit('message', formatMessage('chatatata Bot',`welcome ${user.username}`))
        socket.broadcast
            .to(user.room)
            .emit('message', formatMessage('chatatata Bot', `${user.username} has joined the room`))
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        })
    }) 
    socket.on('chat-message', (msg) =>{
        const user = getCurrentUser(socket.id)
        io.to(user.room)
        .emit('message',formatMessage(user.username,msg))
    })
    socket.on('disconnect', ()=>{
        const user = userLeave(socket.id)
        if(user){
            io.to(user.room).emit('message',formatMessage('chatatata Bot',`${user.username} has lift the room`))
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            })
        }
    })
})
server.listen(3000, () => console.log('server started'))
