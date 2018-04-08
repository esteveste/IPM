
async function init(){
  console.log("lets go");
  bootAnimation();
  lockArrow();
  updateTime();

}

async function bootAnimation(){
  await sleep(2000);
  let boot_title = $("#boot-title");
  let boot_anim = $("#boot-anim");
  let lockscreen = $("#lockscreen");
  boot_title.fadeTo(2000,1);
  // boot_title.css("opacity",1);
  await sleep(4000);
  boot_title.fadeTo("slow",0);
  boot_anim.fadeTo("slow",0,()=>{
    boot_anim.addClass("disabled");
    lockscreen.fadeTo("slow",1);
  });
}
function updateTime() {
  today = new Date();
  var h = today.getHours();
  var m = today.getMinutes();
  if (m < 10) { m = "0" + m };
  let lock_Time = $("#lock-Time");
  lock_Time.text(h + ":" + m);

  setTimeout(updateTime, 30000);
}
async function lockArrow(){
  let arrow = $("#lock-arrow");
  if (arrow.css("opacity")=="1") {
    await sleep(2000);
    arrow.fadeTo("slow",0);
  }else{
    arrow.fadeTo("slow",1);
  }
  setTimeout(lockArrow,2000);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
onload = init;
