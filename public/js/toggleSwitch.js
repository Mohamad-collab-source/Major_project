document.addEventListener("DOMContentLoaded", () => {

  let Taxswitch = document.getElementById("switchCheckDefault");

  Taxswitch.addEventListener("click", () => {
    let showgst = document.getElementsByClassName("show-gst");

    for (let gst of showgst) {
      gst.style.display = gst.style.display === "inline" ? "none" : "inline";
    }
  });

});
