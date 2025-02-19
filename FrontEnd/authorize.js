/**
 * Vérification que l'utilisateur est bien identifié pour rester sur la page d'édition.
 */
function verifyAuthorize(){
    const token = localStorage.getItem("connectionToken");
    if(!token){
        alert("Déconnexion");
        window.location.href = "index.html";
    }
}

/**
 * Déconnecte l'utilisateur et le renvoie à la page d'accueil.
 */
function logOut(){
    const linkLogOut = document.getElementById("logout");
    linkLogOut.addEventListener("click", () => {
        localStorage.removeItem("connectionToken");
        alert("Déconnexion");
        window.location.href = "index.html";
    });
}

window.addEventListener("popstate", verifyAuthorize);//Navigation via l'historique
window.addEventListener("hashchange", verifyAuthorize);//Changement de l'URL
window.addEventListener("load", verifyAuthorize);//Rechargement de la page

logOut();