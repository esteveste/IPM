'use strict';

const DEBUG = true;
const BUTTON_SIZE = 64;
const BAR_SIZE = 25.8;
const SCREEN_SIZE = 178.31;
const NR_OF_MENU_EL = 4;

var appHistory = [];
var atualApp = undefined;
var idle = 0;

async function init() {
  console.log("lets go");
  bootAnimation(DEBUG);
  lockArrow();
  updateTime();

  var idletimer = setInterval(detectIdleTime, 2000);

  $(document).mousemove(function (e) {
    idle = 0;
  });
  $(document).keypress(function (e) {
    idle = 0;
  });

  let lockScreen = $("#lockscreen");
  // lockScreen.css("opacity",1);
  const maxLockDrag = -225;
  const minLockDrag = 0;
  lockScreen.draggable({
    axis: "y",
    scroll: false,
    position: 'unset',
    drag: function (event, ui) {
      if (ui.position.top > minLockDrag) ui.position.top = minLockDrag;
      if (ui.position.top < maxLockDrag) ui.position.top = maxLockDrag;

    },
    stop: function (event, ui) {
      if (ui.position.top < maxLockDrag / 4) {
        $(this).animate({
          'top': maxLockDrag
        });
      } else {
        $(this).animate({
          'top': minLockDrag
        });
      }
      // $("#app-screen").addClass("disabled");
    }

  });


  let menu = $("#menu");
  // lockScreen.css("opacity",1);
  const maxMenuDrag = -SCREEN_SIZE * (NR_OF_MENU_EL - 1);
  // const minLockDrag=0;
  menu.draggable({
    axis: "y",
    scroll: false,
    position: 'unset',
    drag: function (event, ui) {
      if (ui.position.top > 0) ui.position.top = 0;
      if (ui.position.top < maxMenuDrag) ui.position.top = maxMenuDrag;
      // if(!$(`#menu-status li:nth-child(${(Math.floor(ui.position.top/SCREEN_SIZE)+1)})`).hasClass("current")){
      //   $(`#menu-status li:nth-child(${(Math.floor(ui.position.top/SCREEN_SIZE))})`).removeClass("current");
      //   $(`#menu-status li:nth-child(${(Math.floor(ui.position.top/SCREEN_SIZE)+1)})`).addClass("current");
      // }
      // console.log(!$(`#menu-status li:nth-child(${(Math.floor(ui.position.top/SCREEN_SIZE)+1)})`).hasClass("current"));
      // console.log("csajlsajcsa" + Math.floor(ui.position.top/SCREEN_SIZE));
      if (ui.position.top / SCREEN_SIZE - Math.floor(ui.position.top / SCREEN_SIZE) < 0.5 && ui.position.top % SCREEN_SIZE != 0) {
        $(`#menu-status li:nth-child(${(Math.floor(-ui.position.top/SCREEN_SIZE)+1)})`).removeClass("current");
        $(`#menu-status li:nth-child(${(Math.floor(-ui.position.top/SCREEN_SIZE)+2)})`).addClass("current");
      } else {
        $(`#menu-status li:nth-child(${(Math.floor(-ui.position.top/SCREEN_SIZE)+2)})`).removeClass("current");
        $(`#menu-status li:nth-child(${(Math.floor(-ui.position.top/SCREEN_SIZE)+1)})`).addClass("current");
      }
    },
    stop: function (event, ui) {
      $(event.originalEvent.target).one('click', function (e) {
        e.stopImmediatePropagation();
      });
      console.log("if " + (ui.position.top / SCREEN_SIZE - Math.floor(ui.position.top / SCREEN_SIZE)));
      console.log("tr " + (Math.floor(ui.position.top / SCREEN_SIZE) + 1) * SCREEN_SIZE);
      if (ui.position.top / SCREEN_SIZE - Math.floor(ui.position.top / SCREEN_SIZE) <= 0.5) {
        $(this).animate({
          'top': (Math.floor(ui.position.top / SCREEN_SIZE)) * SCREEN_SIZE
        });
      } else {
        $(this).animate({
          'top': (Math.floor(ui.position.top / SCREEN_SIZE) + 1) * SCREEN_SIZE
        });
      }
    }
    // stop: function (event, ui) {

    // }
  });


  let horario_lista = $("#horario-list");
  let max_drag_horario = -($("#horario-list > button").length * BUTTON_SIZE - 206.47) - BAR_SIZE;
  console.log(max_drag_horario);
  horario_lista.css("top", BAR_SIZE);
  horario_lista.draggable({
    // axis: "y",
    scroll: false,
    position: 'unset',
    cancel: false,
    drag: function (event, ui) {
      if (ui.position.top > BAR_SIZE) ui.position.top = BAR_SIZE;
      if (ui.position.top < max_drag_horario) ui.position.top = max_drag_horario;
    },
    stop: function (event, ui) {
      $(event.originalEvent.target).one('click', function (e) {
        e.stopImmediatePropagation();
      });
    }

  });

  let banda_lista = $("#bandas-list");
  let max_drag_banda = -($("#bandas-list > button").length * BUTTON_SIZE - 206.47) - BAR_SIZE;
  console.log(max_drag_banda);
  banda_lista.css("top", BAR_SIZE);
  banda_lista.draggable({
    axis: "y",
    scroll: false,
    position: 'unset',
    cancel: false,
    drag: function (event, ui) {
      if (ui.position.top > BAR_SIZE) ui.position.top = BAR_SIZE;
      if (ui.position.top < max_drag_banda) ui.position.top = max_drag_banda;
    },
    stop: function (event, ui) {
      $(event.originalEvent.target).one('click', function (e) {
        e.stopImmediatePropagation();
      });
    }

  });

  $("#menu-cartaz").click(function (event) {
    changeScreen($("#menu-overflow"), $("#cartaz"));
  });

  $("#bt-bandas").click(() => {
    changeScreen($("#cartaz"), $("#list-bandas"));
  });
  $("#bt-horario").click(() => {
    changeScreen($("#cartaz"), $("#list-horario"));
  });

  $("#back-bt").click(backApp);
  $("#crown-button").click(crownFunction);

  $(".bt-band").click(function () {
    createDiv($(this), 1);
  });
  $(".bt-schedule").click(function () {
    createDiv($(this), 1);
  });
  // $("#lockscreen").click(function () {
  //   if ($("#lockscreen").position.top != 0){
  //     $("#lockscreen").animate({
  //       'top': -225
  //     });
  //   }
  // });
  $("#bar-title").click(backApp);

  $("#bar-title").text("Menu");

}

async function detectIdleTime(){
  idle += 2;
  if (idle >= 30){
    if ($("#lockscreen").position.top != 0){
      $("#lockscreen").animate({
        "top": 0
      });
      idle = 0;
    }
  }
}

var band_list = {
  "altj": {
    artist: "ALT-J",
    desc: "Descrição: É uma banda de rock alternativo formada em 2007 em Leeds, Inglaterra.",
    hour: "19:00 - 20:30",
    stage: "Palco 1",
  },
  "coldplay": {
    artist: "COLDPLAY",
    desc: "Descrição: É uma banda britânica de rock alternativo fundada em 1996 na Inglaterra pelo vocalista e pianista Chris Martin e o guitarrista Jonny Buckland no University College London.",
    hour: "17:00 - 18:45",
    stage: "Palco 2",
  },
  "linkinpark": {
    artist: "LINKIN PARK",
    desc: "Descrição: É uma banda de rock dos Estados Unidos formada em 1996 em Agoura Hills, Califórnia. Desde a sua formação, o grupo já vendeu pelo menos 70 milhões de álbuns pelo mundo e ganhou dois Grammy Awards.",
    hour: "00:30 - 02:00",
    stage: "Palco 3",
  },
  "pinkfloyd": {
    artist: "PINK FLOYD",
    desc: "Descrição: É uma banda britânica de rock, formada em Londres em 1965, que atingiu sucesso internacional com sua música psicodélica e progressiva.",
    hour: "22:30 - 00:00",
    stage: "Palco 4",
  }
}

var title_list = {
  "cartaz": "Cartaz",
  "list-bandas": "Bandas",
  "band": "Bandas",
  "list-horario": "Horário",
  "menu": "Menu",
  "menu-cartaz": "Menu",
  "menu-overflow": "Menu"
};

var notificationTitle = "";
var notificationInfo = "";

var popup_list = {
  1: ["Alerta adicionado.", "Cancelar"],
  2: ["", "Remover"],
  3: ["Função nao implementada", ""]
}

async function createBar(screen) {
  $("#bar-title").empty();
  if (title_list[screen]!="Menu"){
    $("#bar-title").css("cursor", "pointer");
    $("#bar-title").append('<b style="padding-right:3%;">&lt;</b>' + title_list[screen]);
  }
  else{
    $("#bar-title").css("cursor", "default");
    $("#bar-title").append(title_list[screen]);
  }
}

async function createNotification(alert) {
  let lockscreen = $("#lockscreen");

  $("#notification").remove();

  var notificationDiv = document.createElement("div");
  let notificationButton = document.createElement("button");
  let notificationText = document.createElement("span");

  notificationDiv.id = "notification";
  notificationDiv.className = "notification";

  notificationText.className = "notification-text";
  notificationButton.className = "notification-bt";

  notificationButton.textContent = popup_list[alert][1];
  notificationText.textContent = popup_list[alert][0];

  notificationDiv.appendChild(notificationText);
  notificationDiv.appendChild(notificationButton);

  lockscreen.append(notificationDiv);
  $(".notification-bt").click(function () {
    $("#notification").remove();
    $("#alerticon").css("opacity", "0");
  });
}

async function createPopup(alert) {
  let text = $("#txt-popup");
  let bt = $("#bt-popup");
  text.empty();
  bt.empty();
  text.text(popup_list[alert][0]);
  bt.text(popup_list[alert][1]);
}

async function notifyPopup() {
  let popup = $(".popup");
  let h = popup.height();
  popup.css("top", -h - 2);
  setTimeout(function () {
    $(".popup").animate({
      top: 0
    }, 300);
  }, 500);
  setTimeout(function () {
    $(".popup").animate({
      top: -h - 2
    }, 300);
  }, 4000);
}

async function createDiv(el, flag) {
  let band_screen = $("#band");
  band_screen.empty();
  let fixbardiv = document.createElement("div");
  fixbardiv.className = "fixbar";
  band_screen.append(fixbardiv);
  if (flag) {
    var artist = band_list[el.attr("id")].artist;
    var description = band_list[el.attr("id")].desc;
    var hour = band_list[el.attr("id")].hour;
    var stage = band_list[el.attr("id")].stage;

    popup_list[2][0] = artist + ", " + hour + ", " + stage;

    var bt_nav = document.createElement("button");
    var bt_reminder = document.createElement("button");

    bt_nav.id = "bt-nav";
    bt_reminder.id = "bt-reminder";

    bt_nav.className = "mdl-button--raised no-hover mdl-button mdl-js-button mdl-js-ripple-effect";
    bt_reminder.className = "mdl-button--raised no-hover mdl-button mdl-js-button mdl-js-ripple-effect";

    bt_nav.textContent = "Navegar";
    bt_reminder.textContent = "Alerta";
  }

  let list = [artist, hour, stage, description];
  let dragDiv = document.createElement("div");
  dragDiv.id = "dragDiv";
  dragDiv.className = "dragDiv";
  let dragDivIn = document.createElement("div");
  dragDivIn.className = "overflow dragDiv";
  let max_drag_bandtext = -110;

  for (let i = 0; i < 4; i++) {
    let divText = document.createElement("div");
    let spanText = document.createElement("p");
    spanText.textContent = list[i];
    divText.className = "text"+i;
    spanText.className = "pargraph";
    spanText.id = "info" + i;


    divText.append(spanText);
    dragDiv.append(divText);

  }

  dragDivIn.append(dragDiv);
  band_screen.append(dragDivIn);
  band_screen.append(bt_reminder);
  band_screen.append(bt_nav);

  changeScreen(el.parent().parent(), band_screen);
  //let descricao_height = $("#descricao").height();
  await sleep(500);
  for (let index = 0; index < 4; index++) {
    max_drag_bandtext += $("#info"+index).height();
  }
  console.log(max_drag_bandtext);
  $("#dragDiv").draggable({
    axis: "y",
    scroll: false,
    position: 'unset',
    cancel: false,
    drag: function (event, ui) {
      if (ui.position.top > 0) ui.position.top = 0;
      if (ui.position.top < -max_drag_bandtext) ui.position.top = -max_drag_bandtext;
    },
    stop: function (event, ui) {
      $(event.originalEvent.target).one('click', function (e) {
        e.stopImmediatePropagation();
      });
    }
  });

  $("#bt-reminder").click(function () {
    createPopup(1);
    notifyPopup();
    $("#alerticon").css("opacity", "1");
    createNotification(2);
  });
  $("#bt-nav").click(function () {
    createPopup(3);
    notifyPopup();
  });
  $(".popup-button").click(function () {
    $("#notification").remove();
    $("#alerticon").css("opacity", "0");
  });
}


function addToAppHistory(appName) {
  appHistory.push(appName);
}

function getLastAppHistory() {
  return appHistory.pop();
}

function clearAppHistory() {
  appHistory = [];
}



async function bootAnimation(debug) {
  let boot_title = $("#boot-title");
  let boot_anim = $("#boot-anim");
  let lockscreen = $("#lockscreen");
  let black_screen = $("#black");

  if (debug) {
    boot_anim.addClass("disabled");
    lockscreen.fadeTo("slow", 1, () => black_screen.css("z-index", "5"));
    return;
  }


  boot_anim.fadeTo("slow", 1);
  await sleep(2000);
  boot_title.fadeTo(2000, 1);
  // boot_title.css("opacity",1);
  await sleep(4000);
  boot_title.fadeTo("slow", 0);
  boot_anim.fadeTo("slow", 0, () => {
    boot_anim.addClass("disabled");
    lockscreen.fadeTo("slow", 1, () => black_screen.css("z-index", "5"));
  });

}

function updateTime() {
  let today = new Date();
  var h = today.getHours();
  var m = today.getMinutes();
  if (m < 10) {
    m = "0" + m
  };
  let lock_Time = $("#lock-Time");
  let bar_Time = $("#bar-time");

  lock_Time.text(h + ":" + m);
  bar_Time.text(h + ":" + m);
  setTimeout(updateTime, 30000);
}
async function lockArrow() {
  let arrow = $("#lock-arrow");
  if (arrow.css("opacity") == "1") {
    await sleep(1000);
    arrow.fadeTo("slow", 0);
  } else {
    arrow.fadeTo("slow", 1);
  }
  setTimeout(lockArrow, 2000);
}

async function changeScreen(atual, to, addHistory = true) {

  // if the to is equal to from we break
  if (atual.is(to) || (addHistory && appHistory[appHistory.length - 1] != undefined &&
      appHistory[appHistory.length - 1].is(to))) {
    return;
  }
  console.log("change to " + to.attr("id"));
  //prevent clicks during change screen
  if (addHistory) {
    to.css("opacity", 0);
    to.css("height", "50%");
    to.css("width", "50%");
  }
  atual.addClass("transition");
  to.addClass("transition");

  $("#back-bt").addClass("no-touch");
  $("#crown-button").addClass("no-touch");
  atual.addClass("no-touch");
  to.addClass("no-touch");

  atual.css("z-index", 10);
  to.removeClass("disabled");
  to.css("height", "76%");
  to.css("width", "72%");
  to.css("opacity", 1);
  to.css("z-index", 20);
  // atual.fadeTo("slow",0,()=>{
  atual.css("opacity", 0);

  if (addHistory) {
    atual.css("height", "50%");
    atual.css("width", "50%");
  } else {
    // atual.css("height","0%");

  }
  setTimeout(() => {
    $("#back-bt").removeClass("no-touch");
    $("#crown-button").removeClass("no-touch");
    atual.addClass("disabled");
    atual.removeClass("no-touch");
    to.removeClass("no-touch");
    atual.removeClass("transition");
    to.removeClass("transition");
    to.removeClass("app-anim");
    atual.css("height", "76%");
    atual.css("width", "72%");
    // atual.css("opacity",1);
  }, 300);

  // });
  if (addHistory) {
    appHistory.push(to);
  }
  createBar(to.attr("id"));
}

function backApp() {
  //if lockscreen is oppened
  if ($("#lockscreen").position().top < -100) {
    if (appHistory.length == 0) {
      return;
    }
    console.log("before" + appHistory);
    let atual = appHistory.pop(); //take out last app
    let to = appHistory[appHistory.length - 1];
    console.log(appHistory);
    if (to != undefined) {
      if (to.attr("id") == "menu-overflow") {
        appHistory = [];
      }
      changeScreen(atual, to, false);
    } else {
      changeScreen(atual, $("#menu-overflow"), false);
    }
  }
}

async function lockScreenUnlock() {
  let lockscreen = $("#lockscreen");
  lockscreen.fadeTo("slow", 0, () => {
    lockscreen.addClass("disabled");
  });
}

function crownFunction() {
  console.log("crown Tap");
  if ($("#menu-overflow").hasClass("disabled")) {
    let atual = appHistory[appHistory.length - 1];
    changeScreen(atual, $("#menu-overflow"));
  } else {
    $("#lockscreen").animate({
      'top': 0
    });
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
onload = init;
