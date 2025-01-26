/**
 * Affiche dans la div qui à pour classe .gallery les travaux stocké sur le serveur.
 * 
 */
async function showworks(){
    const reponse = await fetch("http://localhost:5678/api/works");
    const works = await reponse.json();

    
    
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

showworks();