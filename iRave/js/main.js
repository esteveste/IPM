
async function init(){
  console.log("lets go");
  bootAnimation();
  lockArrow();
  updateTime();

  let lockScreen = $("#lockscreen");
  // lockScreen.css("opacity",1);
  const maxLockDrag=-225;
  const minLockDrag=0;
  lockScreen.draggable({
        axis: "y",
        scroll: false,
        position: 'unset',
        drag: function (event, ui) {
            if (ui.position.top > minLockDrag) ui.position.top = minLockDrag;
            if (ui.position.top < maxLockDrag) ui.position.top = maxLockDrag;
        },
        stop: function (event, ui) {
            if (ui.position.top < maxLockDrag/4) {
                $(this).animate({
                    'top': maxLockDrag
                });
            }else{
              $(this).animate({
                  'top': minLockDrag
              });
            }
            // $("#app-screen").addClass("disabled");
        }

    });
    let banda_lista = $("#bandas-list");
    banda_lista.draggable({
          axis: "y",
          scroll: false,
          position: 'unset',
          cancel:false,
          drag: function (event, ui) {
              if (ui.position.top > 0) ui.position.top = 0;
              // if (ui.position.top < maxLockDrag) ui.position.top = maxLockDrag;
          },
          // stop: function (event, ui) {
          //     if (ui.position.top < maxLockDrag/4) {
          //         $(this).animate({
          //             'top': maxLockDrag
          //         });
          //     }else{
          //       $(this).animate({
          //           'top': minLockDrag
          //       });
          //     }
          //     // $("#app-screen").addClass("disabled");
          // }

      });
      $("#menu-cartaz").click(()=>{
        $("#menu-cartaz").fadeTo("slow",0,()=>{
          $("#menu-cartaz").addClass("disabled")
        });
      });
      $("#bt-bandas").click(()=>{
        $("#cartaz").fadeTo("slow",0,()=>{
          $("#cartaz").addClass("disabled")
        });
      });
}

async function bootAnimation(){
  let boot_title = $("#boot-title");
  let boot_anim = $("#boot-anim");
  let lockscreen = $("#lockscreen");
  let black_screen = $("#black");

  boot_anim.fadeTo("slow",1);
  await sleep(2000);
  boot_title.fadeTo(2000,1);
  // boot_title.css("opacity",1);
  await sleep(4000);
  boot_title.fadeTo("slow",0);
  boot_anim.fadeTo("slow",0,()=>{
    boot_anim.addClass("disabled");
    lockscreen.fadeTo("slow",1,()=>black_screen.addClass("disabled"));
  });
  // lockscreen.click(lockScreenUnlock);
}
function updateTime() {
  today = new Date();
  var h = today.getHours();
  var m = today.getMinutes();
  if (m < 10) { m = "0" + m };
  let lock_Time = $("#lock-Time");
  let bar_Time = $("#bar-time");

  lock_Time.text(h + ":" + m);
  bar_Time.text(h + ":" + m);
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
async function lockScreenUnlock(){
  let lockscreen = $("#lockscreen");
      lockscreen.fadeTo("slow",0,()=>{
        lockscreen.addClass("disabled");
      });
}
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
onload = init;
