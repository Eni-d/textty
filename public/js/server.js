//Socket
const socket = io('https://textty.herokuapp.com/')

//DOM
const message = document.getElementById('messageInput')
const room = document.getElementById('room')
const send = document.getElementById('send')
const username = document.getElementById('username')
const createRoom = document.getElementById('createRoom')
const messageBody = document.getElementById('messageBody')
const messageBodyCard = document.getElementById('messageBodyCard')
const success = document.getElementById('success')

//Array to sore user information such as username, socket id and message
const userData = []

//Variables to store the room name value and the username value respectively
var roomName, user

//When a user sends a message to other users
send.addEventListener('click', (e) => {
    e.preventDefault()

    //Get the chat message
    msg = message.value

    //Send data message, room name and username to the server
    socket.emit('message', msg, roomName, user)

    //Display message
    messageBodyContent = `<p class="card px-3 py-3 ml-auto w-50">${msg}</p><br>`
    messageBody.innerHTML += messageBodyContent

    //Scroll down to the current message
    messageBodyCard.scrollTop = messageBodyCard.scrollHeight

    //Clear the message input
    message.value = ''
})

//When a user creates a room
createRoom.addEventListener('click', (e) => {
    e.preventDefault()

    //Get the room name and username
    roomName = room.value
    user = username.value

    //Send room name to the server
    socket.emit('create-room', roomName)

    //Clear the room and username inputs
    room.value = ''
    username.value = ''

    //Display a success message and clear it
    success.innerHTML = 'Room successfully created!'
    setTimeout(() => {
        success.innerHTML = ''
    }, 3000)
    
})

//When a user receives a message from another user
socket.on('receive-message', (data) => {
    //Display message
    if (data.username == null) {
        messageBodyContent = `
            <div class="card d-block mr-auto w-50 h-50" style="background-color: #F1F2F9;">
                <div class="card-body">
                    <p>${data.message}</p>
                </div>
            </div>
            <br>
            `
    } else {
        messageBodyContent = `
            <div class="card d-block mr-auto w-50 h-50" style="background-color: #F1F2F9;">
                <div class="card-header text-primary">
                    ${data.username}
                </div>
                <div class="card-body">
                    <p>${data.message}</p>
                </div>
            </div>
            <br>
            `
    }
    messageBody.innerHTML += messageBodyContent

    //Add the data to the userData object
    userData.push(data)

    //Scroll down to the current message
    messageBodyCard.scrollTop = messageBodyCard.scrollHeight
})