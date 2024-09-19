const confirmText = document.querySelector('.input-group h1')
const password = document.getElementById('password')
const confirmPassword = document.getElementById('confirm-password')


confirmPassword.addEventListener('input', () => {
    if( confirmPassword.value !== password.value) {
        confirmText.style.opacity = '1'
    } else {
        confirmText.style.opacity = '0'
    }
})