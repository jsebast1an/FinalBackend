const socket = io()

const productsBox = document.getElementById('productsBox')
const errors = document.getElementById('errors')
let namee = document.getElementById('name')
let stock = document.getElementById('stock')
let price = document.getElementById('price')
let img = document.getElementById('img')
let productsForm = document.getElementById('productsForm')

productsForm.addEventListener('submit', (e) => {
    e.preventDefault()
    let formData = new FormData(productsForm)
    let obj = {}
    let messages = []
    formData.forEach((val, key) => obj[key] = val)
    console.log(obj);
    
    if (namee.value == '' || namee.value == null) {
        if (price.value == '' || price.length < 2) {
            if (stock.value == '' || stock.length > 3) {
                messages.push('Name is required')
                messages.push('Prince is required')
                messages.push('Stock: only 3 numbers are allowed')
            }
        }
    } else {
        e.preventDefault()
        socket.emit('sendProd', obj)
        fetch('http://localhost:8080/api/products', {
            method: 'POST', // or 'PUT'
            body: JSON.stringify(obj), // data can be `string` or {object}!
            headers:{
              'Content-Type': 'application/json'
            }
          }).then(res => res.json())
          .then(response => console.log('Success:', response))
          .catch(error => console.error('Error:', error))
    }

    if (messages.length > 0) {
        messages.forEach(message => {
            const li = document.createElement('li')
            li.innerText = message
            errors.appendChild(li)
        })
    }

    

    productsForm.reset()

})






/* file inputt */
function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#file_upload')
                .attr('src', e.target.result);
        };
        reader.readAsDataURL(input.files[0]);
    }
}
