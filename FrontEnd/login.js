//Gestionnaire de connexion.
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

        if(response.status === 401 || response.status === 404 ){
            alert("Combinaison utilisateur/mot de passe incorrecte");
            return;
        }

        if (!response.ok) {
            throw new Error("Echec de la requête");
        }

        const infoConnection = await response.json();
        
        localStorage.setItem("connectionToken", infoConnection.token); // Stocker le token.
        window.location.href = "edition.html"; // Redirection vers la page d'édition.
    } catch (error) {
            console.error("Erreur : ", error.message);
            alert("Une erreur est survenue veuiller réessayer");
        }
       
    });

