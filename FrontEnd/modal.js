/***************Variables****************/

const modalContainer = document.querySelector(".modal-container");
const modalPhotoGallery = document.getElementById("modal-photo-gallery");
const iconCloseModal = document.querySelectorAll(".icon-close");
const modalAddPhoto = document.getElementById("modal-add-photo");
const buttonAddPhoto = document.getElementById("button-add-photo");
const LinkOpenModal = document.getElementById("open-modal");
const iconBack = document.querySelector(".icon-back");
 /****************Fonction***************/

function openModal(modal){
    modal.style.display = "flex";
    modal.setAttribute("aria-hidden", "false");
    modal.setAttribute("aria-modal", "true");
}

function closeModal(modal){
    modal.style.display = "none";
    modal.setAttribute("aria-hidden", "true");
    modal.setAttribute("aria-modal", "false");
}

function switchModal(){

}

/***************Evénements****************/

LinkOpenModal.addEventListener("click", () => {
    modalContainer.style.display = "flex";
    openModal(modalPhotoGallery);
});

iconCloseModal.forEach((icon) => {
    icon.addEventListener("click", () => {
        modalContainer.style.display = "none";
        if(modalPhotoGallery.style.display === "flex"){
        closeModal(modalPhotoGallery);
    }
    else if(modalAddPhoto.style.display === "flex"){
        closeModal(modalAddPhoto);
    }
    })
});


//Fermeture de la modale quand on clique à l'extérieur

modalContainer.addEventListener("click", (event) => {
    if(!modalPhotoGallery.contains(event.target) && !modalAddPhoto.contains(event.target)){
        modalContainer.style.display = "none";
        if(modalPhotoGallery.style.display === "flex"){
            closeModal(modalPhotoGallery);
        }
        else if(modalAddPhoto.style.display === "flex"){
            closeModal(modalAddPhoto);
        }
    }
});

buttonAddPhoto.addEventListener("click", () => {
    closeModal(modalPhotoGallery);
    openModal(modalAddPhoto);
});

iconBack.addEventListener("click", () => {
    closeModal(modalAddPhoto);
    openModal(modalPhotoGallery);
})


