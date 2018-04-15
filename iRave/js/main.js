const DEBUG = true;
const BUTTON_SIZE = 62;
const BAR_SIZE = 27.16;

var appHistory = [];
var atualApp = undefined;

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


    let horario_lista = $("#horario-list");
    let max_drag_horario = -($("#horario-list > button").length * BUTTON_SIZE - 206.47);
    console.log(max_drag_horario);
    horario_lista.css("top",BAR_SIZE);
    horario_lista.draggable({
          axis: "y",
          scroll: false,
          position: 'unset',
          cancel:false,
          drag: function (event, ui) {
              if (ui.position.top > BAR_SIZE) ui.position.top = BAR_SIZE;
              if (ui.position.top < max_drag_horario) ui.position.top = max_drag_horario;
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

    let banda_lista = $("#bandas-list");
    let max_drag_banda = -($("#bandas-list > button").length * BUTTON_SIZE - 206.47);
    console.log(max_drag_banda);
    banda_lista.css("top",BAR_SIZE);
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
        changeScreen($("#cartaz"),$("#list-bandas"));
      });
      $("#bt-horario").click(()=>{
        changeScreen($("#cartaz"),$("#list-horario"));
      });
      $("#back-bt").click(backApp);
      $(".bt-band").click(function(){
        createDiv($(this), 1)}
      );
      $(".bt-schedule").click(function(){
        createDiv($(this), 0)}
      );
}

var band_list = {
  "altj":{
    artist:"Altj",
    desc:"Description:",
    hour:"10:00 - 11:00",
    stage:"Palco 1",
  },
  "coldplay":{
    artist:"Coldplay",
    desc:"Description:",
    hour:"11:00 - 12:00",
    stage:"Palco 2",
  },
  "direstraits":{
    artist:"Direstraits",
    desc:"Description:",
    hour:"12:00 - 13:00",
    stage:"Palco 3",
  },
  "pinkfloyd":{
    artist:"Pink Floyd",
    desc:"Description:",
    hour:"13:00 - 14:00",
    stage:"Palco 4",
  }
}

var schedule_list = {
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
var title_list = {
  "cartaz":"Cartaz",
  "list-bandas":"Bandas",
  "band":"Bandas",
  "list-horario":"Horário",
  "":"Mapa",
  "":""
};

var popup_list = {
  1:["Alerta adicionado.", "Cancelar"]
}

async function createBar(screen){
  $("#bar-title").text(title_list[screen]);
}


async function createPopup(alert){
  let text = $("#txt-popup");
  let bt = $("#bt-popup");
  text.empty();
  bt.empty();
  text.text(popup_list[alert][0]);
  bt.text(popup_list[alert][1]);
  notifyPopup();
}

async function notifyPopup(){
  let popup = $(".popup");
  let h = popup.height();
  popup.css("top", -h);
  setTimeout(function(){$(".popup").animate({top:0}, 300);}, 2000);
}

async function createDiv(el,flag){
  console.log(el.attr("id"));
  let band_screen = $("#band");
  band_screen.empty();
  let fixbardiv = document.createElement("div");
  fixbardiv.className="fixbar";
  band_screen.append(fixbardiv);
  if (flag){
    var artist = band_list[el.attr("id")].artist;
    var description = band_list[el.attr("id")].desc;
    var hour = band_list[el.attr("id")].hour;
    var stage = band_list[el.attr("id")].stage;

    var bt_nav = document.createElement("button");
    var bt_reminder = document.createElement("button");
  
    bt_nav.id="bt-nav";
    bt_reminder.id="bt-reminder";

    bt_nav.className="no-hover mdl-button mdl-js-button mdl-js-ripple-effect";
    bt_reminder.className="mdl-button--raised no-hover mdl-button mdl-js-button mdl-js-ripple-effect";

    bt_nav.textContent="Navegar";
    bt_reminder.textContent="Alerta";

  }
  else{
    var artist = schedule_list[el.attr("id")];
    var description = schedule_list[el.attr("id")].desc;
    var hour = schedule_list[el.attr("id")].hour;
    var stage = schedule_list[el.attr("id")].stage;
  }

  let list = [artist, hour, stage, description];
  let table = document.createElement('TABLE');

  for(i = 0; i < 4 ; i++) {
    let tr = document.createElement("TR");
    let td = document.createElement("TD");
    td.appendChild(document.createTextNode(list[i]));
    tr.appendChild(td);
    table.appendChild(tr);
  }

  //criar funcionalidade do botao

  console.log(table);
  band_screen.append(table);
  band_screen.append(bt_reminder);
  band_screen.append(bt_nav);

  changeScreen($("#bandas-list"), band_screen);
  $("#bt-reminder").click(function(){
    createPopup(1)}
  );
}


function addToAppHistory(appName){
  appHistory.push(appName);
}
function getLastAppHistory(){
  return appHistory.pop();
}
function clearAppHistory(){
  appHistory = [];
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

function changeScreen(atual,to,addHistory=true){

  // if the to is equal to from we break
  if(atual.is(to) || (addHistory && appHistory[appHistory.length -1]!=undefined
  && appHistory[appHistory.length -1].is(to))){
    return;
  }

  console.log("change" + to.text());
  atual.css("z-index",20);
  to.removeClass("disabled");
  to.css("opacity",1);
  to.css("z-index",10);
    atual.fadeTo("slow",0,()=>{
      atual.addClass("disabled");
    });
  if(addHistory){
    appHistory.push(to);
  }
  createBar(to.attr("id"));
}

function backApp(){
  console.log("wtf");
  if(appHistory.length==0){
    return;
  }
  console.log("berfore" + appHistory);
  let atual = appHistory.pop(); //take out last app
  let to = appHistory[appHistory.length - 1];
  console.log(appHistory);
  if(to!=undefined){

    changeScreen(atual,to,false);
  }else{
    changeScreen(atual,$("#menu-cartaz"),false);
  }
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
