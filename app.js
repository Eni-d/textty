const express = require('express')
const path = require('path')
const http = require('http')
const socketio = require('socket.io')
const app = express()
const server = http.createServer(app)
const io = socketio(server)


//Static folder
app.use(express.static(path.join(__dirname, 'public')))

//Socket connection
io.on('connection', socket => {
    console.log('A user has connected...')

    //When a user sends a message
    socket.on('message', (message, room, user) => {
        console.log(room)
        if (room == null) {
            //When the server sends the message to the rest of the connected users
            data = {
                username: user,
                id: socket.id,
                message
            }
            socket.broadcast.emit('receive-message', data)
        } else {
            //When the server sends the message to the rest of the connected users in a room
            data = {
                username: user,
                id: socket.id,
                message
            }
            socket.to(room).emit('receive-message', data)
        }
        
    })

    //When a user creates a room
    socket.on('create-room', (room) => {
        socket.join(room)
    })

    //When a user disconnects
    socket.on('disconnect', socket => {
        console.log('A user has disconnected...')
    })
})

const PORT = 5000 || process.env.PORT

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})


