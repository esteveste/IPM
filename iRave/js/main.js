const DEBUG = true;
const BUTTON_SIZE = 61.94;
const BAR_SIZE = 27.16;

async function init(){
  console.log("lets go");
  bootAnimation(DEBUG);
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
    let max_drag_banda = -($("#bandas-list > button").length * BUTTON_SIZE - 206.47);
    console.log(max_drag_banda);
    banda_lista.draggable({
          axis: "y",
          scroll: false,
          position: 'unset',
          cancel:false,
          drag: function (event, ui) {
              if (ui.position.top > BAR_SIZE) ui.position.top = BAR_SIZE;
              if (ui.position.top < max_drag_banda) ui.position.top = max_drag_banda;
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
        changeScreen($("#menu-cartaz"),$("#cartaz"));
      });
      $("#bt-bandas").click(()=>{
        changeScreen($("#cartaz"),$("#bandas-list"));
      });
      $("#altj").click(createDiv);
}

//$(".band-button").click(createDiv());

var band_list = {
  "altj":{
    desc:"Description:",
    hour:"10:00 - 11:00",
    stage:"Palco 1",
  },
  "coldplay":{
    desc:"Description:",
    hour:"11:00 - 12:00",
    stage:"Palco 2",
  },
  "direstraits":{
    desc:"Description:",
    hour:"12:00 - 13:00",
    stage:"Palco 3",
  },
  "pinkfloyd":{
    desc:"Description:",
    hour:"13:00 - 14:00",
    stage:"Palco 4",
  }
}

async function createDiv(){
  console.log($(this).attr("id"));
  let band_screen = $("#band");
  let artist = band_list[$(this).attr("id")];
  let description = band_list[$(this).attr("id")].desc;
  let hour = band_list[$(this).attr("id")].hour;
  let stage = band_list[$(this).attr("id")].stage;

  let list = [artist, hour, stage, description];
  let table = document.createElement('TABLE');

  for(i = 0; i < 4 ; i++) {
    let tr = document.createElement("TR");
    let td = document.createElement("TD");
    td.appendChild(document.createTextNode(list[i]));
    tr.appendChild(td);
    table.appendChild(tr);
  }
  console.log(table);
  band_screen.append(table);

  changeScreen($("#bandas-list"), band_screen);

}


async function bootAnimation(debug){
  let boot_title = $("#boot-title");
  let boot_anim = $("#boot-anim");
  let lockscreen = $("#lockscreen");
  let black_screen = $("#black");

    if(debug){
      boot_anim.addClass("disabled");
      lockscreen.fadeTo("slow",1,()=>black_screen.addClass("disabled"));
      return;
    }


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

function changeScreen(atual,to){
  atual.css("z-index",20);
  to.css("z-index",10);
    atual.fadeTo("slow",0,()=>{
      atual.addClass("disabled")
    });
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
