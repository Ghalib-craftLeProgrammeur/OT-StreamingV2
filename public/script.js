

// Category Popup
const categoryLink = document.getElementById('category-link');
const categoryPopup = document.getElementById('category-popup');
const closePopup = document.getElementById('close-popup');

categoryLink.addEventListener('click', openCategoryPopup);

function openCategoryPopup() {
   document.getElementById("category-popup").style.display = "block";
}

closePopup.addEventListener('click', closeCategoryPopup);

function closeCategoryPopup() {
    categoryPopup.style.display = 'none';
}

// Modal
const modal = document.querySelector('.modal');
const modalBtn = document.querySelector('.show-modal');
const closeBtn = document.querySelector('.close-btn');

modalBtn.addEventListener('click', openModal);
closeBtn.addEventListener('click', closeModal);
window.addEventListener('click', outsideClick);

function openModal() {
    modal.style.display = 'block';
}

function closeModal() {
    modal.style.display = 'none';
}

function outsideClick(e) {
    if (e.target === modal) {
        closeModal();
    }
}
