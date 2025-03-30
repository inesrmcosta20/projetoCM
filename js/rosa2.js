// Rosa game interactions
document.addEventListener('DOMContentLoaded', () => {
  const regador = document.getElementById('regador');
  const guardaChuva = document.getElementById('guarda-chuva');
  const cupula = document.getElementById('cupula');
  const sol = document.getElementById('sol');

  // Initial positions
  regador.style.left = '20%';
  regador.style.top = '60%';
  
  guardaChuva.style.left = '50%';
  guardaChuva.style.top = '70%';
  
  cupula.style.left = '80%';
  cupula.style.top = '60%';

  // Make objects draggable
  [regador, guardaChuva, cupula].forEach(item => {
    item.addEventListener('mousedown', startDragging);
  });

  function startDragging(e) {
    const item = e.target;
    let offsetX = e.clientX - item.getBoundingClientRect().left;
    let offsetY = e.clientY - item.getBoundingClientRect().top;

    function drag(e) {
      item.style.left = `${e.clientX - offsetX}px`;
      item.style.top = `${e.clientY - offsetY}px`;
    }

    function stopDragging() {
      document.removeEventListener('mousemove', drag);
      document.removeEventListener('mouseup', stopDragging);
    }

    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', stopDragging);
  }
})