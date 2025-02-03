document.addEventListener("DOMContentLoaded", function() {
    // parcourir tous les elements avec la classe player-item
    document.querySelectorAll(".player-item").forEach(item => {
        // ajouter un evenement au survol de l'element
        item.addEventListener("mouseover", function() {
            // creer un element div pour afficher les informations
            let tooltip = document.createElement("div");
            tooltip.classList.add("tooltip-box");
            tooltip.innerHTML = `
                <img src="${this.dataset.photo}" alt="Photo" class="tooltip-img">
                <p><strong>${this.dataset.name}</strong></p>
                <p>${this.dataset.number}</p>
                <p>${this.dataset.team}</p>
                <p>${this.dataset.position}</p>
                <p>${this.dataset.stat}</p>
            `;
            // ajouter l'element tooltip dans la page
            document.body.appendChild(tooltip);
            // positionner la boite d'information a droite de l'element survole
            tooltip.style.left = `${this.getBoundingClientRect().right + 10}px`;
            tooltip.style.top = `${this.getBoundingClientRect().top}px`;

            // supprimer la boite d'information quand la souris sort de l'element
            this.addEventListener("mouseout", () => {
                tooltip.remove();
            });
        });
    });
});
