const socket = io.connect();

//-------------------------

function validateEmail(email) {
  const mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
  if(email.match(mailformat)) {
    return true
  } else {
    alert("You have entered an invalid email address!");
    return false
  }
}



//----------------------
//--- TABLA DE PRODUCTOS

const formulario = document.getElementById('formulario')
formulario.addEventListener('submit', e => {
    e.preventDefault()
    const producto = {
        title: formulario[0].value,
        price: formulario[1].value,
        thumbnail: formulario[2].value
    }
    socket.emit('update', producto)
    formulario.reset()
})


socket.on('productos', data => {
  let productos = data
 
  let htmlToRender = `
  <table class="table container">
    <thead>
      <tr>
        <th scope="col">#</th>
        <th scope="col">Nombre</th>
        <th scope="col">Precio</th>
        <th scope="col">Foto</th>
      </tr>
    </thead>
    </tbody>`
  
  productos.forEach(( element, index) => {
    htmlToRender = htmlToRender + `
    <tr>
      <th scope="row">${index + 1}</th>
      <td>${element.title}</td>
      <td>${element.price}</td>
      <td><img src=${element.thumbnail} style="max-width: 50px; height: auto;"</td>
    </tr>` 
  })
  
  htmlToRender = htmlToRender + '</tbody></table>'
  document.querySelector('#tabla').innerHTML = htmlToRender
})


//----------------------
//--- CHAT

const userEmail = document.getElementById("userEmail")
const userMensaje = document.getElementById("userMsj")

document.getElementById("sendBtn").addEventListener("click", ev => {
  if ( validateEmail(userEmail.value) ) {
    if ( userMensaje.value ){

      socket.emit('newMsj', {
        user: userEmail.value,
        mensaje: userMensaje.value
       })

       userMensaje.value = ''

    } else {
      alert("Ingrese un mensaje!")
    }
  }
})



socket.on('mensajes', data => {
  let mensajes = data
  let htmlChatToRender = ``
  
  mensajes.forEach(( element ) => {
    htmlChatToRender = htmlChatToRender + `
    <div>
      <div class="user">User: ${element.user} </div>
      <div class="date">${element.date} </div>
      <div class="mensaje">${element.mensaje}</div>
    </div>
    `
  })
  document.querySelector('#chat').innerHTML = htmlChatToRender
})