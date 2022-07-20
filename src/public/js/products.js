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
        messages.push('Name is required')
    } 
    if (price.value == '' || price.length < 2) {
        messages.push('Price is required')
    } 
    if (stock.value == '' || stock.length > 3) {
        messages.push('Stock: only 3 numbers are allowed')
    }
    if (messages.length > 0) {
        e.preventDefault()
        errors.innerText = ''
        messages.forEach(message => {
            const li = document.createElement('li')
            li.innerText = message
            errors.appendChild(li)
        })
    } else {
        e.preventDefault()
        errors.innerText = ''
        fetch('http://localhost:8080/api/products', {
            method: 'POST', // or 'PUT'
            body: JSON.stringify(obj), // data can be `string` or {object}!
            headers:{
              'Content-Type': 'application/json'
            }
          }).then(res => res.json())
          .then(response => {
            getUserAsync()
            setTimeout(() => {
                listProducts()
            }, 1000);
            console.log('Success:', response)
          }) 
          .catch(error => console.error('Error:', error))
    }
    
    productsForm.reset()

})



let products;
async function getUserAsync() 
{
  let response = await fetch(`http://localhost:8080/api/products`);
  let data = await response.json()
  products = data.products.payload
  return data;
}
getUserAsync()

function listProducts() {

    /* fetch('http://localhost:8080/api/products')
    .then(response => response.json())
    .then(data => products = data.products.payload)
    .catch(err => console.error(err)) */
    if (products.length > 0) {
        productsBox.innerHTML = ''
        products.forEach( prod => {
            const div = document.createElement('div')
            div.className = 'card text-center my-3 hvr-glow'
            div.style.width = '350px'
            productsBox.prepend(div)
            div.innerHTML =
            `
            <img src="${prod.thumbnail}" class="card-img-top" alt="...">
            <div class="card-body">
                <h5 class="card-title">${prod.name}</h5>
                <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
            </div>
            <ul class="list-group list-group-flush">
                <li class="list-group-item">Precio: ${prod.price},00$</li>
                <li class="list-group-item">Stock: ${prod.stock} unidades</li>
            </ul>
            <div class="card-body">
                <a href="#" class="btn btn-primary">Add cart</a>
            </div>
            `
        })
    }
}
















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
