const socket = io()

/* const welcome = document.getElementById('welcome') */
const chatMessage = document.getElementById('chatMessage')
const usernameSaid = document.querySelector('.usernameSaid')


let user

socket.on('user', data => {
    console.log(data)
    user = data
    usernameSaid.innerHTML = `${user.username} dice:`
    /* welcome.innerHTML = `<h3> Username: ${user.username} </h3>` */
})

socket.on("log", data => {
    let log = document.getElementById("log")
    console.log(data)
    let messages = ""
    data.forEach(message => {
        messages = messages+ `<strong>${message.user.username} dice: </strong>${message.message} <br>`
        log.innerHTML = messages;
    });
})

chatMessage.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        if (chatMessage.value.trim().length > 0 ) {
            socket.emit("message", { message:chatMessage.value.trim()})
            chatMessage.value = ""
        }
    }
})

