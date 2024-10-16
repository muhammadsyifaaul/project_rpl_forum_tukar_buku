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
const navItems = document.querySelectorAll('.nav-item');
console.log(navItems)
navItems.forEach(item => {
    item.addEventListener('click', () => {
        // Hapus kelas 'active' dari semua nav-item
        navItems.forEach(nav => nav.classList.remove('active'));
        item.classList.add('active');
    });
});




