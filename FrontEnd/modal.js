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
    if(modal === modalPhotoGallery){
        getWorksAndShow();
    }
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

/********************Fonction affichage************************/
/**
 * Récupére les travaux et les affiches.
 * @returns Retourne une promesse
 */
async function getWorksAndShow(){
    try {
        const reponse = await fetch("http://localhost:5678/api/works");
        
        if(!reponse.ok){
            throw new Error(`Erreur HTTP : ${reponse.status}`);
        }

        const works = await reponse.json();
        showWorksDelete(works);
        return works;// Retourne une promesse.
    }
    catch(error){
        console.error("Erreur : ", error.message);
    }
}

/**
 * 
 * @param {array} works Affiche les travaux avec une icone de suppression.
 */
function showWorksDelete(works){
    const galleryModalElement = document.querySelector(".gallery-modal");
    const trashCanCode = '<i class="fa-solid fa-trash-can"></i>';

    galleryModalElement.innerHTML = "";
    
    for(let i = 0; i < works.length; i++){
        const figureElement = document.createElement("figure");
        const imgElement = document.createElement("img");
        const trashCanElement = document.createElement("div");

        imgElement.src = works[i].imageUrl;
        imgElement.alt = works[i].title;
        trashCanElement.setAttribute("class", "delete-icon");
        trashCanElement.innerHTML = trashCanCode;

        figureElement.appendChild(imgElement);
        figureElement.appendChild(trashCanElement);
        galleryModalElement.appendChild(figureElement);

        trashCanElement.addEventListener("click", () => {
            deleteWork(works[i].id);//Supprime
            showWorksDelete(works);//Affichage des travaux restant
        });
    }
}

/**
 * Supprime le travail avec l'id correspondant à celui passer en paramètres.
 * @param {number} id l'id de l'élément travail à supprimer.
 */
async function deleteWork(id){
    try{
        const reponse = await fetch(`http://localhost:5678/api/works/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("connectionToken")}`,
                "Accept": "*/*"
                }
            });

        if(reponse.ok){
            console.log("Le travail à été supprimer.");
        }

        }catch(error){  
        console.log("erreur: ", error.message);
    }
}

console.log(localStorage.getItem("connectionToken"));



