const navItems = document.querySelectorAll('.nav-item');

navItems.forEach(item => {
    item.addEventListener('click', () => {
        // Hapus kelas 'active' dari semua nav-item
        navItems.forEach(nav => nav.classList.remove('active'));
        
        // Tambahkan kelas 'active' ke item yang diklik
        item.classList.add('active');
    });
});
