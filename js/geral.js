
function myPopUp() {
    const popup = document.getElementById("popup");
    popup.classList.toggle("show");
    
    // Fechar o popup após 10 segundos
    setTimeout(function() {
        popup.classList.remove("show");
    }, 10000);
}

// Fechar o popup ao clicar em qualquer lugar
document.addEventListener('click', function(event) {
    const popup = document.getElementById("popup");
    const helpIcon = document.querySelector('.ajuda img');
    
    if (!popup.contains(event.target) && event.target !== helpIcon) {
        popup.classList.remove("show");
    }
});