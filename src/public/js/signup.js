const signupForm = document.getElementById('signupForm')
const username = document.getElementById('username')
const email = document.getElementById('email')
const password = document.getElementById('password')
const phone = document.getElementById('phone')
const check_password = document.getElementById('check_password')
const errors = document.getElementById('errors')


signupForm.addEventListener('submit', (e) => {
    let messages = []
    if (username.value == '' || username.value.length < 4) {
        messages.push('Full name require more than 4 characters')
    }
    if (phone.value == '' || phone.value.length < 4) {
        messages.push('Phone require more than 4 characters')
    }
    if (email.value == '' || email.value.length < 4) {
        messages.push('Email require more than 4 characters')
    }
    if (password.value == '' || password.value.length < 4) {
        messages.push('Password require more than 4 characters')
    }
    // verify password
    if (password.value != check_password.value) {
        messages.push('Passwords do not match')
    }
    
    if(messages.length > 0) {
        e.preventDefault()
        errors.style.color = 'red'
        errors.innerText = messages.join(', ')
    }
})