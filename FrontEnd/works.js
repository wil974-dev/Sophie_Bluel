
/**
 * Récupère les travaux sur le serveur et les affiches avec
 * la fonction showWorks().
 */
async function getWorks(){
    try {
        const reponse = await fetch("http://localhost:5678/api/works");

        if(!reponse.ok){
            throw new Error('Erreur HTTP : ${reponse.status}');
        }

        const works = await reponse.json();

        showWorks(works);
    }
    catch(error){
        console.error("Erreur pour la réception des travaux : ", error.message);
    }
    

}



getWorks();

// fonctions

/**
 * Affiche tous les travaux dans la class gallery.
 * @param {Array} works - Représente les travaux récupérer sur le serveur.
 */
function showWorks(works){
    for(let i = 0; i < works.length; i++){
        const galleryElement = document.querySelector(".gallery");
        const figureElement = document.createElement("figure");
        const imgElement = document.createElement("img");
        const figcaptionElement = document.createElement("figcaption");

        imgElement.src = works[i].imageUrl;
        figcaptionElement.innerText = works[i].title;

        figureElement.appendChild(imgElement);
        figureElement.appendChild(figcaptionElement);
        galleryElement.appendChild(figureElement);
    }
}

