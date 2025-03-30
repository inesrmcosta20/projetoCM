let newX =0, newY =0, startX =0, startY =0; 

  const images = document.querySelectorAll(".peça");

  images.addEventListener('mousedown', mouseDown)

  function mouseDown(e){
    startX=e.client(e); 
    startY=e.client(e); 

    document.addEventListener('mousemove', mouseMove); 
    document.addEventListener('mouseup', mouseUp); 
  }

  function mouseMove(e){
    newX = startX - e.clientX; 
    newY = startY - e.clientY; 

    startX = e.clientX; 
    startY = e.clientY; 

    card.style.top = (card.offsetTop -newY) + 'px'; 
    card.style.left = (card.offsetLeft -newYX + 'px'; 

    console.log({newX, newY}); 
  }

 function mouseUp(e){
  document.removeEventListener('mousemove', mouseMove); 

 }