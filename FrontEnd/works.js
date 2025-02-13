/**
 * Récupère les travaux sur le serveur et les affiches avec
 * la fonction showWorks().
 */
async function getWorks(){
    try {
        const reponse = await fetch("http://localhost:5678/api/works");
        
        if(!reponse.ok){
            throw new Error(`Erreur HTTP : ${reponse.status}`);
        }

        const works = await reponse.json();
        showWorks(works);
        return works;
    }
    catch(error){
        console.error("Erreur : ", error.message);
    }

}

/**
 * Récupère les categories des travaux et crée les boutons
 * avec la fonction createButtonFilter().
 */
async function getCategory(){
    try {
        const reponse = await fetch("http://localhost:5678/api/categories");

        if(!reponse.ok){
            throw new Error(`Erreur HTTP : ${reponse.status}`);
        }

        let categories = await reponse.json();
        const allCategory = {name:"Tous"};
        
        categories = [allCategory, ...categories];

        createButtonFilter(categories);
    }
    catch(error){
        console.error("Erreur : ", error.message);
    }
    
}

/**
 * Efface les éléments et affiche tous les travaux dans la class gallery.
 * @param {Array} works - Représente les travaux.
 */
function showWorks(works){
    const galleryElement = document.querySelector(".gallery");
    galleryElement.innerHTML = "";

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

/**
 * Créer un bouton filtre avec un évènement contenant une fonction de tri filterWorks.
 * @param {array} category - Correspond aux categories.
 */
function createButtonFilter(category){
    
    const filterElement = document.querySelector(".filter");
    
    category.forEach(category => {
        const inputElement = document.createElement("input");

        inputElement.type = "button";
        inputElement.value = category.name;
        
        inputElement.addEventListener("click", () => {
            if(category.name === "Tous") {
                getWorks();
            }
            else{
                filterWorks(category.name);
            }
        });

        filterElement.appendChild(inputElement);

    });

}

/**
 * Récupère les travaux et affichent ceux qui corresponde à la catégorie.
 * @param {string} categoryName - la catégorie.
 */
async function filterWorks(categoryName){
    const works = await getWorks();
    const listeWorks = works.filter(work => work.category.name === categoryName);

    const galleryElement = document.querySelector(".gallery");
        
    showWorks(listeWorks);

}


getWorks();
getCategory();

