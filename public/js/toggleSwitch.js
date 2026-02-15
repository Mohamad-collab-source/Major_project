 let Taxswitch = document.getElementById('switchCheckDefault');
  Taxswitch.addEventListener('click',()=>{
    let showgst = document.getElementsByClassName('show-gst');
    for(gst of showgst){
      if(gst.style.display!="inline"){
        gst.style.display="inline";
      }
      else {
        gst.style.display="none";
      }
    }
  })


