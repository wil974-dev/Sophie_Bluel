//Gestionnaire de connection.
document.querySelector("form").addEventListener("submit", async (event) => {
    event.preventDefault(); // Empêche le rechargement de la page.

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            throw new Error("Combinaison utilisateur/mot de passe incorrecte");
        }

        const infoConnection = await response.json();
        
        localStorage.setItem("connectionToken", infoConnection.token); // Stocker le token.
        window.location.href = "edition.html"; // Redirection vers la page d'édition.
    } catch (error) {
        if(error.message === "Failed to fetch"){
            alert("Echec de la connexion");
        }
        else{
            alert(error.message);
        }
       
    }
});

