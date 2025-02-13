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
    
    //Je déplace le focus sur la modale pour que ne pas avoir d'erreur accessibilitée
    modal.setAttribute("tabindex", "-1");
    modal.focus();

    switch(modal){
        case modalPhotoGallery:
            getWorksAndShow();
            break;
        case modalAddPhoto:
            getCategoryModal();
            break;
    }
}

function closeModal(modal){
    modal.style.display = "none";
    modal.setAttribute("aria-hidden", "true");
    modal.setAttribute("aria-modal", "false");

    //Je remet le focus sur un élément visible
    document.getElementById("open-modal").focus();
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
        switchPhotoDisplay(false);
    }
    })
});


//Fermeture de la modale quand on clique à l'extérieur
modalContainer.addEventListener("click", (event) => {
    if(!modalPhotoGallery.contains(event.target) && !modalAddPhoto.contains(event.target)){
        modalContainer.style.display = "none";
        switchPhotoDisplay(false);
        if(modalPhotoGallery.style.display === "flex"){
            closeModal(modalPhotoGallery);
        }
        else if(modalAddPhoto.style.display === "flex"){
            closeModal(modalAddPhoto);
        }
    }
});



//Gère le changement de modal quand le bouton ajouter photo est appuyé
buttonAddPhoto.addEventListener("click", () => {
    closeModal(modalPhotoGallery);
    openModal(modalAddPhoto);
});


//Gére le bouton retour sur la modal add photo.
iconBack.addEventListener("click", () => {
    switchPhotoDisplay(false);
    closeModal(modalAddPhoto);
    openModal(modalPhotoGallery);
    //Vide l'image si il à été ajouter.
    //const formFileImg = document.querySelector(".form-add-photo");
    //formFileImg.reset();
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
        showWorks(works);
        return works;// Retourne une promesse.
    }
    catch(error){
        console.error("Erreur : ", error.message);
    }
}

/**
 * Affiche les travaux avec une icone de suppression.
 * @param {array} works
 */
async function showWorksDelete(works){
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

        trashCanElement.addEventListener("click", async (event) => {
            event.stopPropagation();//Empêche la fermeture de la modale.
            deleteWork(works[i].id);//Supprime
            const updateWorks = await getWorksAndShow();
            showWorksDelete(updateWorks);//Affichage des travaux restant
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
                "Authorization": `Bearer ${localStorage.getItem("connectionToken")}`
                }
            });

        if(reponse.ok){
            console.log("Le travail a été supprimé.");
        }else{
            console.log("Pas autorisé");
        }

        }catch(error){  
        console.log("erreur: ", error.message);
    }
}


/**
 * Récupère les catégories sur le serveur.
 */
async function getCategoryModal(){
    try{
        const reponse = await fetch("http://localhost:5678/api/categories");
        if(!reponse.ok){
            throw new Error("Erreur lors de la récupération des categories.");
        }

        const categories = await reponse.json();
        showCategoriesModal(categories);

    }catch(error){
        console.log("Erreur: ", error.message);
    }
  
}

/**
 * Affiche les catégories dans la liste déroulante de la modale.
 * @param {array} categories 
 */
function showCategoriesModal(categories){
    const selectElement = document.getElementById("category");
    selectElement.innerHTML = "";
    //Ajoute une premiére option vide.
    const emptyOption = document.createElement("option");
    emptyOption.value = "";
    emptyOption.disabled = true;
    emptyOption.selected = true;
    selectElement.appendChild(emptyOption);

    categories.forEach(cat => {
        const optionElement = document.createElement("option");
        
        optionElement.setAttribute("value", cat.id);
        optionElement.innerText = cat.name;

        selectElement.appendChild(optionElement);
    });
}

/**
 * 
 */
function addPhoto(){
    const inputFile = document.getElementById("imgImport");
    const buttonAddPhoto = document.getElementById("button-form-add-photo");
    
    function openFileImgImport(){
        inputFile.click();
    }

    buttonAddPhoto.addEventListener("click", openFileImgImport);

    /**
     * Fonction qui affiche la photo sélectionner avec gestions d'erreur.
     * @param {*} e 
     */
    function printPhoto(e){
        const fileImg = inputFile.files[0];// Récupère l'image à l'indice 0.
        const imgPreview = document.getElementById("imgPreview");
        
        console.log(e);

        if(!fileImg.type){
            alert("Aucun fichier sélectionner.");
        }
        
        if(fileImg.type.startsWith("image/")){
            const reader = new FileReader();
            reader.readAsDataURL(e.target.files[0]);

            reader.onload = (event) => {
            imgPreview.src = event.target.result;
            switchPhotoDisplay(true);
            
            };}
        else{
            alert("Veuillez choisir une image au format jpeg/png.");
        }
    }

    inputFile.addEventListener("change", printPhoto);

}

/**
 * 
 * @param {boolean} showImage - True pour afficher l'image et false pour afficher le boutton ajout de photo
 */
function switchPhotoDisplay(showImage){
    const viewPhoto = document.querySelector(".view-photo");
    const formAddPhoto = document.querySelector(".form-add-photo");

    if(showImage){
        viewPhoto.style.display = "flex";
        formAddPhoto.style.display = "none";
    }else{
        viewPhoto.style.display = "none";
        formAddPhoto.style.display = "flex";
    }
}

/**
 * 
 */
function addWorks(){
    const buttonSubmitWork = document.getElementById("button-validate-add-photo");
    const fileImg = document.getElementById("imgImport");
    const title = document.getElementById("title");
    const category = document.getElementById("category");
    const formElement = document.getElementById("form-info-photo");

    buttonSubmitWork.addEventListener("click", async (event) => {
        event.preventDefault();
        
        //Vérification de la présence d'une image, d'un titre et d'une catégorie.
        if(!fileImg.files[0]){
            alert("Veuillez insérer une image");
            return;
        }
        if(!title.value){
            
            alert("Veuillez spécifier un titre");
            return;
        }
        if(!category.value)
        {
            alert("Veuillez choisir une catégorie");
            return;
        }
        console.log(fileImg.files[0]);
        const formData = new FormData();
        formData.append("image", fileImg.files[0]);
        formData.append("title", title.value);
        formData.append("category", category.value);
        
       

        try{
            const response = await fetch("http://localhost:5678/api/works", {
                method: "POST",
                headers:{
                        "Authorization": `Bearer ${localStorage.getItem("connectionToken")}`
                    },
                    body: formData
                });
                if(response.ok){
                    alert("L'image été ajoutée avec succès !");
                    getWorksAndShow();
                    buttonSubmitWork.style.backgroundColor = "#A7A7A7";
                    formElement.reset();
                    category.value = ""; // Remet la catégorie sur la sélection par défaut.
                    switchPhotoDisplay(false);
                    
                }
            }catch(error){
                console.log("Erreur lors de l'ajout :", error);
                alert("Une erreur est survenue lors de l'envoi");
            }
    });
}

function validateColorButton(){
    const fileImg = document.getElementById("imgImport");
    const title = document.getElementById("title");
    const category = document.getElementById("category");
    const buttonSubmitWork = document.getElementById("button-validate-add-photo");

    function verifyChamps(){
        if(!fileImg.files[0] || !title.value || (category.value === "")){
        console.log("Un des champs est vide");
        buttonSubmitWork.style.backgroundColor = "#A7A7A7";
        }
        else{
        console.log("Les trois champs sont remplies");
        buttonSubmitWork.style.backgroundColor = "#1D6154";
        }  
    }

    fileImg.addEventListener("change", verifyChamps);
    title.addEventListener("input", verifyChamps);
    category.addEventListener("change", verifyChamps);
}


/****************************************** */
/**
 * Efface les éléments et affiche tous les travaux dans la class gallery.
 * @param {Array} works - Représente les travaux.
 */
function showWorks(works){
    const galleryElement = document.querySelector(".gallery");
    galleryElement.innerHTML = "";

    console.log("Passage dans la fonction");

    for(let i = 0; i < works.length; i++){
        const figureElement = document.createElement("figure");
        const imgElement = document.createElement("img");
        const figcaptionElement = document.createElement("figcaption");

        imgElement.src = works[i].imageUrl;
        imgElement.alt = works[i].title;
        figcaptionElement.innerText = works[i].title;

        figureElement.appendChild(imgElement);
        figureElement.appendChild(figcaptionElement);
        galleryElement.appendChild(figureElement);
    }
}


validateColorButton();
addWorks();
addPhoto();