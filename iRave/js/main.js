
async function init(){
  console.log("lets go");

  let boot_title = $("#boot-title");
  let boot_anim = $("#boot-anim");
  boot_title.fadeTo("slow",1);
  // boot_title.css("opacity",1);
  await sleep(3000);
  boot_anim.fadeTo("slow",0,()=>boot_anim.addClass("disabled"));

  //
  // console.log("awake");
  // ir = document.getElementById("iravet");
  // let i = 0;
  // while(i<1){
  //   i+=0.01;
  //   ir.style.opacity = i;
  //   // console.log(i);
  //   await sleep(50);
  // }
  // await sleep(2000);
  // fadeout("testbg");
  // document.getElementById("lock").style.visibility="visible";
  // ecra.style.width="100%";
  // ecra.style.height="100%";
  //   ecra.style.padding="15%";
}

// async function fadeout(el_id){
//   el = document.getElementById(el_id);
//   let i = 1;
//   while(i>0){
//     i-=0.01;
//     el.style.opacity = i;
//     // console.log(i);
//     await sleep(5);
//   }
//   // el.style.backgroundImage = 'url("../st.jpg")';
//     el.style.backgroundImage = "None";
//   // el.style.backgroundSize = "contain";
//   // el.style.visibility="hidden";
//   ir = document.getElementById("iravet");
//   ir.innerHTML = "10:24";
//   while(i<1){
//     i+=0.01;
//     el.style.opacity = i;
//     // console.log(i);
//     await sleep(20);
//   }
// }


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
onload = init;
