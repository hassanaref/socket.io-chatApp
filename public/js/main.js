const chatForm = document.getElementById('chat-form')   
const chatMessages = document.querySelector('.chat-messages')
const roomName = document.getElementById('room-name')
const userList   = document.getElementById('users')

const {username, room} = Qs.parse(location.search,{
    ignoreQueryPrefix: true
})
const socket = io()
socket.emit('joinRoom', {username,room})
socket.on('roomUsers', ({room, users}) => {
    outPutRoomName(room)
    outPutUsers(users)
})
socket.on('message', message=>{
    outPutMessage(message)
    chatMessages.scrollTop = chatMessages.scrollHeight;
})

chatForm.addEventListener('submit', (ev)=>{
    ev.preventDefault();
    const msg = ev.target.elements.msg.value;
    socket.emit('chat-message', msg);
    ev.target.elements.msg.value = ''
    ev.target.elements.msg.focus()
})

function outPutMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML= `<p class="meta">${message.user} <span>${message.time}</span></p>
        <p class="text">${message.text}</p>`;
    document.querySelector('.chat-messages').appendChild(div)
}

function outPutRoomName(room){
    roomName.innerText = room
}

function outPutUsers(users){
    userList.innerHTML = `
        ${users.map(user => `<li>${user.username}</li>`).join('')}
    `
}