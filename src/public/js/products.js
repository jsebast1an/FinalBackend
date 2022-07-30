const productsBox = document.getElementById('productsBox')
const errors = document.getElementById('errors')
let namee = document.getElementById('name')
let category = document.getElementById('category')
let stock = document.getElementById('stock')
let price = document.getElementById('price')
let img = document.getElementById('img')
let productsForm = document.getElementById('productsForm')

let selectCategory = document.getElementById('selectCategory')

/* CREATE PRODUCT */
productsForm.addEventListener('submit', (e) => {
    e.preventDefault()
    let formData = new FormData(productsForm)
    let obj = {}
    let messages = []
    formData.forEach((val, key) => obj[key] = val)
    
    if (namee.value == '' || namee.value == null) {
        messages.push('Name is required')
    } 
    if (namee.value == '' || namee.value == null) {
        messages.push('Category is required')
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
        const btnPost = document.getElementById('btnPost')
        btnPost.innerHTML = 
        `
            <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
            </div>
        `
        const testURL = 'http://localhost:8080/api/products'
        const productionURL = 'https://lopez18335.herokuapp.com/api/products'
        fetch( productionURL, {
            method: 'POST', // or 'PUT'
            body: JSON.stringify(obj), // data can be `string` or {object}!
            headers:{
              'Content-Type': 'application/json'
            }
        })
        .then(res => res.json())
        .then(response => {
            getProductsAsync()
            setTimeout(() => {
                listProducts()
                btnPost.innerText = 'Post product'
            }, 500);
            console.log('Success:', response)
        }) 
        .catch(error => console.error('Error:', error))
    }
    
    productsForm.reset()

})


/* READ PRODUCT */
let products;
async function getProductsAsync() 
{   
    const testURL = 'http://localhost:8080/api/products'
    const productionURL = 'https://lopez18335.herokuapp.com/api/products'
    let response = await fetch( productionURL);
    let data = await response.json()
    products = data.products.payload
    return data;
}
getProductsAsync()

function listProducts() {
    document.querySelector('.selectCategoryContainer').style.display = 'block'
    document.querySelector('.selectCategoryContainer').classList = 'selectCategoryContainer animate__animated animate__flipInX'

    if (products.length > 0) {
        const btnListProducts = document.getElementById('btnListProducts')
        if (btnListProducts) {
            btnListProducts.innerHTML = 
            `
                <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
                </div>
            `
        }
        setTimeout(() => {
            productsBox.innerHTML = ''
            products.forEach( prod => {
                const div = document.createElement('div')
                div.className = 'card text-center my-3 hvr-glow'
                div.style.width = '350px'
                div.style.margin = '8px'
                productsBox.prepend(div)
                div.innerHTML =
                `
                <img src="https://media.beritagar.id/2018-10/710510154b7c8b4bea7adc10b279e90e4ed2d1c5.jpg" class="card-img-top" alt="...">
                <div class="card-body">
                    <h5 class="card-title">${prod.name}</h5>
                    <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                </div>
                <ul class="list-group list-group-flush">
                    <li class="list-group-item">Precio: ${prod.price},00$</li>
                    <li class="list-group-item">Category: ${prod.category}</li>
                    <li class="list-group-item">Stock: ${prod.stock} unidades</li>
                </ul>
                <div class="card-body">
                    <div class="buttonsContainer">
                        <button id="btnDelete${prod.id}" class="btn btn-danger" onclick="deleteProduct(${prod.id})">Delete <i class="fa-solid fa-trash-can"></i></button>
                        <button class="btn btn-warning">Edit <i class="fa-solid fa-pen-to-square"></i></button>
                        <button class="btn btn-success">Add cart <i class="fa-solid fa-cart-shopping"></i></button>
                    </div>
    
                </div>
                `
            })
        }, 200);
    }
}

/* DELETE PRODUCT*/

function deleteProduct(prodId) {
    const prodFound = products.find(product => product.id == prodId)
    if (prodFound) {
        console.log(prodFound);
        console.log(prodId);
        const btnDelete = document.getElementById(`btnDelete${prodId}`)
        btnDelete.innerHTML = 
        `
            <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
            </div>
        `
        const testURL = 'http://localhost:8080/api/products'
        const productionURL = 'https://lopez18335.herokuapp.com/api/products'
        fetch( productionURL + '/' + prodFound._id, {
            method: 'DELETE',
        })
        .then(res => res.json())
        .then(response => {
            getProductsAsync()
            setTimeout(() => {
                listProducts()
            }, 500);
            console.log('Success:', response)
        }) 
        .catch(error => console.error('Error:', error))
    }
}


selectCategory.addEventListener('change', () => {
    if(selectCategory.value === 'shoes') {
        productsBox.innerHTML = ''
        let productsFiltered = products.filter(prod => prod.category === selectCategory.value)
        console.log(productsFiltered);
        productsFiltered.forEach( prod => {
            const div = document.createElement('div')
            div.className = 'card text-center my-3 hvr-glow'
            div.style.width = '350px'
            div.style.margin = '8px'
            productsBox.prepend(div)
            div.innerHTML =
            `
            <img src="https://media.beritagar.id/2018-10/710510154b7c8b4bea7adc10b279e90e4ed2d1c5.jpg" class="card-img-top" alt="...">
            <div class="card-body">
                <h5 class="card-title">${prod.name}</h5>
                <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
            </div>
            <ul class="list-group list-group-flush">
                <li class="list-group-item">Precio: ${prod.price},00$</li>
                <li class="list-group-item">Category: ${prod.category}</li>
                <li class="list-group-item">Stock: ${prod.stock} unidades</li>
            </ul>
            <div class="card-body">
                <div class="buttonsContainer">
                    <button id="btnDelete${prod.id}" class="btn btn-danger" onclick="deleteProduct(${prod.id})">Delete <i class="fa-solid fa-trash-can"></i></button>
                    <button class="btn btn-warning">Edit <i class="fa-solid fa-pen-to-square"></i></button>
                    <button class="btn btn-success">Add cart <i class="fa-solid fa-cart-shopping"></i></button>
                </div>

            </div>
            `
        })
    }

    if(selectCategory.value === 'clothing') {
        productsBox.innerHTML = ''
        let productsFiltered = products.filter(prod => prod.category === selectCategory.value)
        productsFiltered.forEach( prod => {
            const div = document.createElement('div')
            div.className = 'card text-center my-3 hvr-glow'
            div.style.width = '350px'
            div.style.margin = '8px'
            productsBox.prepend(div)
            div.innerHTML =
            `
            <img src="https://media.beritagar.id/2018-10/710510154b7c8b4bea7adc10b279e90e4ed2d1c5.jpg" class="card-img-top" alt="...">
            <div class="card-body">
                <h5 class="card-title">${prod.name}</h5>
                <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
            </div>
            <ul class="list-group list-group-flush">
                <li class="list-group-item">Precio: ${prod.price},00$</li>
                <li class="list-group-item">Category: ${prod.category}</li>
                <li class="list-group-item">Stock: ${prod.stock} unidades</li>
            </ul>
            <div class="card-body">
                <div class="buttonsContainer">
                    <button id="btnDelete${prod.id}" class="btn btn-danger" onclick="deleteProduct(${prod.id})">Delete <i class="fa-solid fa-trash-can"></i></button>
                    <button class="btn btn-warning">Edit <i class="fa-solid fa-pen-to-square"></i></button>
                    <button class="btn btn-success">Add cart <i class="fa-solid fa-cart-shopping"></i></button>
                </div>

            </div>
            `
        })
    }

    if (selectCategory.value === 'all' ) {
        productsBox.innerHTML = ''
        products.forEach( prod => {
            const div = document.createElement('div')
            div.className = 'card text-center my-3 hvr-glow'
            div.style.width = '350px'
            div.style.margin = '8px'
            productsBox.prepend(div)
            div.innerHTML =
            `
            <img src="https://media.beritagar.id/2018-10/710510154b7c8b4bea7adc10b279e90e4ed2d1c5.jpg" class="card-img-top" alt="...">
            <div class="card-body">
                <h5 class="card-title">${prod.name}</h5>
                <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
            </div>
            <ul class="list-group list-group-flush">
                <li class="list-group-item">Precio: ${prod.price},00$</li>
                <li class="list-group-item">Category: ${prod.category}</li>
                <li class="list-group-item">Stock: ${prod.stock} unidades</li>
            </ul>
            <div class="card-body">
                <div class="buttonsContainer">
                    <button id="btnDelete${prod.id}" class="btn btn-danger" onclick="deleteProduct(${prod.id})">Delete <i class="fa-solid fa-trash-can"></i></button>
                    <button class="btn btn-warning">Edit <i class="fa-solid fa-pen-to-square"></i></button>
                    <button class="btn btn-success">Add cart <i class="fa-solid fa-cart-shopping"></i></button>
                </div>

            </div>
            `
        })
    }
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
