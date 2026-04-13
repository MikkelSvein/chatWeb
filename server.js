const socket = io("http://localhost:3000")
const form = document.getElementById('form')
const input = document.getElementById('input')
const nameInput = document.getElementById('nameInput')
const messages = document.getElementById('messages')
const imageInput = document.getElementById('imageInput')
const imgButton = document.getElementById('imgButton')

// Navegar con Enter entre campos
nameInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault()
    input.focus()
  }
})

// Abre el selector de archivos al hacer clic en el botón
imgButton.addEventListener('click', () => imageInput.click())

// Convierte la imagen a base64 y la envía
imageInput.addEventListener('change', () => {
  const name = nameInput.value.trim()

  if (!name) {
    nameInput.focus()
    return
  }

  const file = imageInput.files[0]
  if (!file) return

  // Limita el tamaño a 4 MB antes de enviar
  if (file.size > 4 * 1024 * 1024) {
    alert('La imagen es demasiado grande. Máximo 4 MB.')
    imageInput.value = ''
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    socket.emit('message', { name, image: e.target.result })
    imageInput.value = ''
  }
  reader.readAsDataURL(file)
})

// Envío de mensaje de texto
form.addEventListener('submit', (e) => {
  e.preventDefault()

  const name = nameInput.value.trim()
  const message = input.value.trim()

  if (!name) {
    nameInput.focus()
    return
  }

  if (message) {
    socket.emit('message', { name, message })
    input.value = ''
    input.focus()
  }
})

// Renderiza mensajes entrantes (texto e imágenes)
socket.on('messages', (data) => {
  const p = document.createElement('p')

  if (data.image) {
    p.innerHTML = `
      <strong>${data.name}:</strong><br>
      <img src="${data.image}" style="max-width:200px; border-radius:8px; margin-top:6px; display:block;" />
    `
  } else {
    p.innerHTML = `<strong>${data.name}:</strong> ${data.message}`
  }

  messages.appendChild(p)
  messages.scrollTop = messages.scrollHeight
})