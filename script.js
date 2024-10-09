const navItems = document.querySelectorAll('.nav-item');

navItems.forEach(item => {
    item.addEventListener('click', () => {
        // Hapus kelas 'active' dari semua nav-item
        navItems.forEach(nav => nav.classList.remove('active'));
        
        // Tambahkan kelas 'active' ke item yang diklik
        item.classList.add('active');
    });
});
const modal = document.getElementById("myModal");
const openModalBtn = document.getElementById("openModalBtn");
const closeModalBtn = document.getElementById("closeModalBtn");
window.onload = function() {
  modal.style.display = 'none';
}

openModalBtn.onclick = function() {
  modal.style.display = "flex";
};

closeModalBtn.onclick = function() {
  modal.style.display = "none";
};

window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};
