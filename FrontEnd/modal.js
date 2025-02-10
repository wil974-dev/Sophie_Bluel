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
    /*if(modal === modalPhotoGallery){
        getWorksAndShow();
    }*/
    switch(modal){
        case modalPhotoGallery:
            getWorksAndShow();
            break;
        case modalAddPhoto:
            getCategoryModal();
            AddPhoto();
            break;
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



//Gère le changement de modal quand le bouton ajouter photo est appuyé
buttonAddPhoto.addEventListener("click", () => {
    closeModal(modalPhotoGallery);
    openModal(modalAddPhoto);
});


//Gére le bouton retour sur la modal add photo.
iconBack.addEventListener("click", () => {
    createAddPhotoContainer();
    closeModal(modalAddPhoto);
    openModal(modalPhotoGallery);
    //Vide l'image si il à été ajouter.
    const fileImg = document.getElementById("imgImport");
    fileImg.value = " ";
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
                //"accept": "*/*",
                "Authorization": `Bearer ${localStorage.getItem("connectionToken")}`
                }
            });

        if(reponse.ok){
            console.log("Le travail a été supprimé.");
        }else{
            console.log("Pas authoriser");
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
    categories.forEach(cat => {
        const optionElement = document.createElement("option");
        
        optionElement.setAttribute("value", cat.id);
        optionElement.innerText = cat.name;

        selectElement.appendChild(optionElement);
    });
}

function AddPhoto(){
    const inputFile = document.getElementById("imgImport");
    const buttonAddPhoto = document.getElementById("button-add-photo-container");

    buttonAddPhoto.addEventListener("click", () => {
        inputFile.click();
    });
    
    inputFile.addEventListener("change", (e) => {
        const fileImg = inputFile.files[0];// Récupère l'image à l'indice 0.
        const addPhotoContainer = document.querySelector(".add-photo-container");
        const imgElement = document.createElement("img");

        if(!fileImg.type){
            alert("Aucun fichier sélectionner.");
        }
        else if(fileImg.type.startsWith("image/")){
            addPhotoContainer.innerHTML = "";
            const reader = new FileReader();
            reader.readAsDataURL(e.target.files[0]);

            reader.onload = (event) => {
            imgElement.src = event.target.result;
            addPhotoContainer.appendChild(imgElement);
            };}
        else{
            alert("Veuillez choisir une image au format jpeg/png.");
        }
    });
}


/**
 * Fonction pour la mise à jour de l'affichage du add-photo-container si on appuye sur la flêche retour.
 */
function createAddPhotoContainer(){
    const addPhotoContainer = document.querySelector(".add-photo-container");
    addPhotoContainer.innerHTML = `<i class="fa-regular fa-image icon-add-photo" style="color: #B9C5CC;"></i>
			<input type="file" id="imgImport" accept="image/png, image/jpeg" style="display:none">
			<input type="button" value="+ Ajouter photo" id="button-add-photo-container">
			<p>jpg, png : 4mo max</p>`;
}

function addWorks(){
    const buttonSubmitWork = document.getElementById("button-validate-add-photo");
    const fileImg = document.getElementById("imgImport");
    const title = document.getElementById("title");
    const category = document.getElementById("category");
    const formElement = document.getElementById("form-add-photo");
    

    buttonSubmitWork.addEventListener("click", async (event) => {
        event.preventDefault();
        //Vérification de la présence d'une image et d'un titre.
        if(!fileImg.files[0]){
            alert("Veuillez insérer une image");
            return;
        }
        if(!title){
            alert("Veuillez spécifier un titre");
            return;
        }
        console.log(fileImg.files[0]);
        const formData = new FormData();
        formData.append("image", fileImg.files[0]);
        formData.append("title", title.value);
        formData.append("category", category.value);
        console.log("Contenu du FormData :");
for (const [key, value] of formData.entries()) {
    console.log(`${key}:`, value);
}
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
                    formElement.reset();
                    createAddPhotoContainer();
                }

            }catch(error){
                console.log("Erreur lors de l'ajout :", error);
                alert("Une erreur est survenue lors de l'envoi");
            }

    });

   
}

addWorks();
