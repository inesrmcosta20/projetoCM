document.addEventListener("DOMContentLoaded", function () {
  const aviao = document.getElementById("aviao");

  aviao.addEventListener("animationend", function () {
      aviao.src = "imagens/aviao_sombra.png";
  });
});
