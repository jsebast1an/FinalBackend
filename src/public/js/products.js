const socket = io()

const productsBox = document.getElementById('productsBox')
const errors = document.getElementById('errors')
let namee = document.getElementById('name')
let category = document.getElementById('category')
let stock = document.getElementById('stock')
let price = document.getElementById('price')
let img = document.getElementById('img')
let productsForm = document.getElementById('productsForm')

let selectCategory = document.getElementById('selectCategory')

/* HEADER NAME con websocket */

let user

const nav_username = document.getElementById('nav_username')
socket.on('user', data => {
    console.log(data)
    user = data
    nav_username.innerText = `${user.username}`
    nav_username.style.textTransform = 'capitalize'
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

/* CREATE PRODUCT */
productsForm.addEventListener('submit', (e) => {
    e.preventDefault()
    let formData = new FormData(productsForm)
    let obj = {}
    let messages = []
    const myFiles = document.getElementById('file').files
    
    formData.forEach((val, key) => obj[key] = val)
    
    if (namee.value == '' || namee.value == null) {
        messages.push('Name is required')
        namee.style.backgroundColor = '#ffcccb'
    } 
    if (category.value == '' || category.value == null) {
        messages.push('Category is required')
        username.style.backgroundColor = '#ffcccb'
    } 
    if (price.value == '' || price.length < 2) {
        messages.push('Price is required')
        username.style.backgroundColor = '#ffcccb'
    } 
    if (stock.value == '' || stock.length > 3) {
        messages.push('Stock: only 3 numbers are allowed')
        username.style.backgroundColor = '#ffcccb'
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
    let response = await fetch( productionURL)
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
                        <button class="btn btn-warning" onclick="openEditModal(${prod.id})">Edit <i class="fa-solid fa-pen-to-square"></i></button>
                        <button class="btn btn-success">Add cart <i class="fa-solid fa-cart-shopping"></i></button>
                    </div>
    
                </div>
                `

                const div2 = document.createElement('div')
                div2.className = 'modalEditContainer'
                div2.id = `editForm${prod.id}`
                document.body.appendChild(div2)
                div2.innerHTML = 
                `
                <div class="modalEdit card" style="margin:1rem">
                    <div class="card-header text-center">
                        <h3>Edit product</h3>
                    </div>
                    <div class="card-body">
                        <form id="editForm2${prod.id}" class="productsForm2 animate__animated animate__flipInY">
                            <ul id="errors2"></ul>
                            <div class="inputContainer">
                            <div class="two-sides">
                                <div class="left-side">
                                    <div class="input_group margin">
                                        <label for="name2">
                                            Name
                                        </label>
                                        <input id="name2" name="name" value="${prod.name}" type="text">
                                        <span class="right">No longer than 15 characters</span>
                                    </div>
                                    <div class="input_group margin">
                                        <label for="category2">
                                            Category
                                        </label>
                                        <select name="category" class="form-select selectCategory2">
                                            <option value="all" ${prod.category === 'all' ? 'selected' : ''} >All products</option>
                                            <option value="shoes" ${prod.category === 'shoes' ? 'selected' : ''}>Shoes</option>
                                            <option value="clothing" ${prod.category === 'clothing' ? 'selected' : ''}>Clothing</option>
                                        </select>

                                    </div>
                                </div>
                                <div class="right-side">
                                    <div class="input_group margin">
                                        <label for="price2">
                                            Price
                                        </label>
                                        <input id="price2" name="price" value="${prod.price}" type="number">
                                        <span class="right">Enter a price in format: 999</span>
                                    </div >
                                    <div class="input_group margin">
                                        <label for="stock2">Stock</label>
                                        <input id="stock2" name="stock" value="${prod.stock}" type="number">
                                        <span class="right">Please only number characters</span>
                                    </div>
                                </div>
                            </div>
                                
                                
                                
                            </div>
                            <div class="button_group mb-3">
                                <button id="btnPut${prod.id}" onclick="editForm(event, ${prod.id})" class="button_group_button">Save</button>
                            </div>
                        </form>
                    </div>

                    <div class="card-footer">
                        <div class="button_group">
                            <button onclick="closeEditModal(${prod.id})" class="btn btn-danger">Close</button>
                        </div>
                    </div>
                </div>
                `
            })
        }, 200);
    }
}

/* UPDATE PRODUCT */
function openEditModal(formId) {
    document.getElementById(`editForm${formId}`).classList.toggle('showEditModal')
}
function closeEditModal(formId) {
    document.getElementById(`editForm${formId}`).classList.toggle('showEditModal')
}

function editForm(event, id) {
    event.preventDefault()
    let form = document.getElementById(`editForm2${id}`)
    let formData = new FormData(form)
    let obj = {}
    formData.forEach((val, key) => obj[key] = val)
    console.log(formData);
    const btnPut = document.getElementById(`btnPut${id}`)
    btnPut.innerHTML = 
    `
        <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
        </div>
    `
    const testURL = 'http://localhost:8080/api/products'
    const productionURL = 'https://lopez18335.herokuapp.com/api/products'
    const prodFound = products.find(product => product.id == id)


    fetch( productionURL + '/' + prodFound._id, {
        method: 'PUT', // or 'PUT'
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
            btnPut.innerHTML = 'Editado <i class="fa-solid fa-check"></i>'
            btnPut.style.backgroundColor = 'green'
        }, 500);
        console.log('Success:', response)
    }) 
    .catch(error => console.error('Error:', error))
}

/* DELETE PRODUC T*/

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
                    <button class="btn btn-warning" onclick="openEditModal(${prod.id})">Edit <i class="fa-solid fa-pen-to-square"></i></button>
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
                    <button class="btn btn-warning" onclick="openEditModal(${prod.id})">Edit <i class="fa-solid fa-pen-to-square"></i></button>
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
                    <button class="btn btn-warning" onclick="openEditModal(${prod.id})">Edit <i class="fa-solid fa-pen-to-square"></i></button>
                    <button class="btn btn-success">Add cart <i class="fa-solid fa-cart-shopping"></i></button>
                </div>

            </div>
            `
        })
    }
})




const file = document.getElementById('file')



/* file inputt */
function readURL(input) {
    const myFiles = file.files


    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#file_upload')
                .attr('src', e.target.result);
        };
        reader.readAsDataURL(input.files[0]);
    }
}
