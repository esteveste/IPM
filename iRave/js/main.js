'use strict';

const DEBUG = true;
const BUTTON_SIZE = 64;
const BAR_SIZE = 25.8;
const SCREEN_SIZE = 178.31;
const SCREEN_WIDTH=145;
const NR_OF_MENU_EL = 4;

const MAP_WIDTH=1568;
const MAP_HEIGHT=676;

var appHistory = [];
var atualApp = undefined;
var idle = 0;
var longpress = 1000;
var start;
var currentAlert = undefined;
var spansnopedido = 8;
var spanscriados = 0;

var map_zoom = 2;
var map_zoom_last =1;
var map_left =  (MAP_WIDTH / map_zoom) - SCREEN_SIZE;
var map_top=(MAP_HEIGHT / map_zoom)-SCREEN_SIZE;



async function init() {
  console.log("lets go");
  bootAnimation(DEBUG);
  lockArrow();
  updateTime();
  mapZoomChange(2);

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


  let horario_lista = $(".horario-list");
  let max_drag_horario = -($("#horario-list > button").length * BUTTON_SIZE - 206.47) - BAR_SIZE;
  console.log(max_drag_horario);
  horario_lista.css("top", BAR_SIZE);
  horario_lista.draggable({
    // axis: "y",
    scroll: false,
    position: 'unset',
    cancel: false,
    drag: function (event, ui) {
      if($(this).attr("id")=="horario-list"){
        if (ui.position.left>0) ui.position.left = 0;
        if (ui.position.left < -145) ui.position.left = -145;
        $("#horario-list2").css("left",145 + parseFloat($(this).css("left")) + "px");
      }
      if($(this).attr("id")=="horario-list2"){
        if (ui.position.left <0) ui.position.left = 0;
        if (ui.position.left > 145) ui.position.left = 145;
        $("#horario-list").css("left",-145 + parseFloat($(this).css("left")) + "px");
      }
      if (ui.position.top > BAR_SIZE) ui.position.top = BAR_SIZE;
      if (ui.position.top < max_drag_horario) ui.position.top = max_drag_horario;
    },
    stop: function (event, ui) {
      $(event.originalEvent.target).one('click', function (e) {
        e.stopImmediatePropagation();
      });
      if($(this).attr("id")=="horario-list"){
        if (ui.position.left <= -45) {
          title_list["list-horario"]="Dia 2";
          writeToBar("Dia 2");
          $(this).animate({
            'left':-145
          });
          $("#horario-list2").animate({
            'left':0
          });
        }else{
          writeToBar("Dia 1");
          title_list["list-horario"]="Dia 1";
          $(this).animate({
            'left':0
          });
          $("#horario-list2").animate({
            'left':145
          });
        }
      }
      if($(this).attr("id")=="horario-list2"){
        if (ui.position.left <= 45) {
          title_list["list-horario"]="Dia 2";
          writeToBar("Dia 2");
          $(this).animate({
            'left':0
          });
          $("#horario-list").animate({
            'left':-145
          });
        }else{
          title_list["list-horario"]="Dia 1";
          writeToBar("Dia 1");
          $(this).animate({
            'left':145
          });
          $("#horario-list").animate({
            'left':0
          });
        }
      }
    }
    // if (ui.position.top / SCREEN_SIZE - Math.floor(ui.position.top / SCREEN_SIZE) <= 0.5) {
    //   $(this).animate({
    //     'left': (Math.floor(ui.position.top / SCREEN_SIZE)) * SCREEN_SIZE
    //   });
    // } else {
    //   $(this).animate({
    //     'top': (Math.floor(ui.position.top / SCREEN_SIZE) + 1) * SCREEN_SIZE
    //   });
    // }

  });

  // let horario_days = $("#horario-days");
  // // let max_drag_horario = -($("#horario-list > button").length * BUTTON_SIZE - 206.47) - BAR_SIZE;
  // // console.log(max_drag_horario);
  // // horario_days.css("top", BAR_SIZE);
  // horario_days.draggable({
  //   axis: "x",
  //   scroll: false,
  //   position: 'unset',
  //   cancel: false,
  //   drag: function (event, ui) {
  //     if (ui.position.top > BAR_SIZE) ui.position.top = BAR_SIZE;
  //     if (ui.position.top < max_drag_horario) ui.position.top = max_drag_horario;
  //   },
  //   stop: function (event, ui) {
  //     $(event.originalEvent.target).one('click', function (e) {
  //       e.stopImmediatePropagation();
  //     });
  //   }
  //
  // });



  let banda_lista = $("#bandas-list");
  let max_drag_banda = -($("#bandas-list > button").length * BUTTON_SIZE - 206.47) - BAR_SIZE;
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

  let options_mapa = $("#options-mapa-list");
  let max_drag_opcoesmapa = -($("#options-mapa-list > button").length * BUTTON_SIZE - 206.47) - BAR_SIZE;
  options_mapa.css("top", BAR_SIZE);
  options_mapa.draggable({
    axis: "y",
    scroll: false,
    position: 'unset',
    cancel: false,
    drag: function (event, ui) {
      if (ui.position.top > BAR_SIZE) ui.position.top = BAR_SIZE;
      if (ui.position.top < max_drag_opcoesmapa) ui.position.top = max_drag_opcoesmapa;
    },
    stop: function (event, ui) {
      $(event.originalEvent.target).one('click', function (e) {
        e.stopImmediatePropagation();
      });
    }

  });

  let mapa = $("#inner-map");
  // mapa.css("top", "-36%");
  let max_drag_top = mapa.top;
  // mapa.css("left", "-50%");
  let max_drag_left = mapa.left;

  mapa.dblclick(function() {
      (map_zoom==2)?mapZoomChange(1):mapZoomChange(2);
  });

  mapa.draggable({
    scroll: false,
    position: 'unset',
    cancel: false,
    drag: function (event, ui) {

      start = new Date().getTime();
      $("#s1").attr("style", "z-index: 0;");
      if (ui.position.top > BAR_SIZE) ui.position.top = BAR_SIZE;
      if (ui.position.top < -map_top*map_zoom_last) ui.position.top = -map_top*map_zoom_last;
      if (ui.position.left > 0) ui.position.left = 0;
      if (ui.position.left < -map_left*map_zoom_last) ui.position.left = -map_left*map_zoom_last;

    },
    stop: function (event, ui) {
      $(event.originalEvent.target).one('click', function (e) {
        e.stopImmediatePropagation();
      });
    }

  });

  let options1 = $("#options-mapa1");
  let max_drag_opcoes1 = -($("#options-mapa1 > button").length * BUTTON_SIZE - 206.47) - BAR_SIZE;
  options1.css("top", BAR_SIZE);
  options1.draggable({
    axis: "y",
    scroll: false,
    position: 'unset',
    cancel: false,
    drag: function (event, ui) {
      if (ui.position.top > BAR_SIZE) ui.position.top = BAR_SIZE;
      if (ui.position.top < max_drag_opcoes1) ui.position.top = max_drag_opcoes1;
    },
    stop: function (event, ui) {
      $(event.originalEvent.target).one('click', function (e) {
        e.stopImmediatePropagation();
      });
    }

  });

  let options3 = $("#options-mapa3");
  let max_drag_opcoes3 = -($("#options-mapa3 > button").length * BUTTON_SIZE - 206.47) - BAR_SIZE;
  options3.css("top", BAR_SIZE);
  options3.draggable({
    axis: "y",
    scroll: false,
    position: 'unset',
    cancel: false,
    drag: function (event, ui) {
      if (ui.position.top > BAR_SIZE) ui.position.top = BAR_SIZE;
      if (ui.position.top < max_drag_opcoes3) ui.position.top = max_drag_opcoes3;
    },
    stop: function (event, ui) {
      $(event.originalEvent.target).one('click', function (e) {
        e.stopImmediatePropagation();
      });
    }

  });

    let pedidos = $("#pedidos-menu");
    let max_drag_pedidos = -($("#pedidos-menu > button").length * BUTTON_SIZE - 206.47) - BAR_SIZE;
    pedidos.css("top", BAR_SIZE);
    pedidos.draggable({
        axis: "y",
        scroll: false,
        position: 'unset',
        cancel: false,
        drag: function (event, ui) {
            if (ui.position.top > BAR_SIZE) ui.position.top = BAR_SIZE;
            if (ui.position.top < max_drag_pedidos) ui.position.top = max_drag_pedidos;
        },
        stop: function (event, ui) {
            $(event.originalEvent.target).one('click', function (e) {
                e.stopImmediatePropagation();
            });
        }

    });

    let comidatcheca = $("#tcheca-drag");
    let max_drag_tcheca = -($("#tcheca-drag > button").length * 90 - 206.47*0.69);
    comidatcheca.css("top", 0);
    comidatcheca.draggable({
        axis: "y",
        scroll: false,
        position: 'unset',
        cancel: false,
        drag: function (event, ui) {
            if (ui.position.top > 0) ui.position.top = 0;
            if (ui.position.top < max_drag_tcheca) ui.position.top = max_drag_tcheca;
        },
        stop: function (event, ui) {
            $(event.originalEvent.target).one('click', function (e) {
                e.stopImmediatePropagation();
            });
        }

    });

    let comidaturca = $("#turca-drag");
    let max_drag_turca = -($("#turca-drag > button").length * 90 - 206.47*0.69);
    comidaturca.css("top", 0);
    comidaturca.draggable({
        axis: "y",
        scroll: false,
        position: 'unset',
        cancel: false,
        drag: function (event, ui) {
            if (ui.position.top > 0) ui.position.top = 0;
            if (ui.position.top < max_drag_turca) ui.position.top = max_drag_turca;
        },
        stop: function (event, ui) {
            $(event.originalEvent.target).one('click', function (e) {
                e.stopImmediatePropagation();
            });
        }

    });

    let bebidasdrag = $("#bebidas-drag");
    let max_drag_bebidasdrag = -($("#bebidas-drag > button").length * 90 - 206.47 * 0.69);
    bebidasdrag.css("top", 0);
    bebidasdrag.draggable({
        axis: "y",
        scroll: false,
        position: 'unset',
        cancel: false,
        drag: function (event, ui) {
            if (ui.position.top > 0) ui.position.top = 0;
            if (ui.position.top < max_drag_bebidasdrag) ui.position.top = max_drag_bebidasdrag;
        },
        stop: function (event, ui) {
            $(event.originalEvent.target).one('click', function (e) {
                e.stopImmediatePropagation();
            });
        }

    });

  $("#mapa").on('mousedown', function( e ) {
      start = new Date().getTime();
      var left = ((e.pageX - $("#mapa").offset().left)/145)*100 - (60/145)*50;
      var top =  ((e.pageY - $("#mapa").offset().top)/178.333)*100 - (60/178.333)*50;
      $("#s1").attr("style", `z-index: 200; -webkit-animation: sk-scaleout 1.0s ease-in-out; animation: sk-scaleout 1.0s ease-in-out; margin-left: ${left}%; margin-top: ${top}%; `);
  } );

  $("#mapa").on('mouseleave', function( e ) {
      start = 0;
      $("#s1").attr("style", "z-index: 0;");
  } );
  $("#mapa").on('mouseup', function( e ) {
      if (new Date().getTime() >= ( start + longpress )  ) {
        changeScreen($("#mapa"), $("#options-mapa"))
      }
      $("#s1").attr("style", "z-index: 0;");
  } );

  $("#menu-cartaz").click(function (event) {
    changeScreen($("#menu-overflow"), $("#cartaz"));
  });

  $("#bt-bandas").click(() => {
    changeScreen($("#cartaz"), $("#list-bandas"));
  });
  $("#bt-horario").click(() => {
    changeScreen($("#cartaz"), $("#list-horario"));
  });
  $("#menu-mapa").click(() => {
    changeScreen($("#menu-overflow"), $("#mapa"));
  });

  $("#back-bt").click(backApp);
  $("#crown-button").click(crownFunction);

  $(".bt-band").click(function () {
    createDiv($(this), 1);
  });
  $(".bt-schedule").click(function () {
    createDiv($(this), 1);
  });
  $("#palcos").click(function () {
    changeScreen($("#options-mapa"), $("#mapa-opcoes1"));
  });
  $("#wc").click(function () {
    changeScreen($("#options-mapa"), $("#mapa-opcoes2"));
  });
  $("#restaurantes").click(function () {
    changeScreen($("#options-mapa"), $("#mapa-opcoes3"));
  });
  $("#options-mapa1 > button").click(function () {
    changeScreen($("#mapa-opcoes1"), $("#mapa"));
    changeImage($(this).attr("id"));
    createMapBar($(this).attr("id"));
  });
  $("#options-mapa2 > button").click(function () {
    changeScreen($("#mapa-opcoes2"), $("#mapa"));
    changeImage($(this).attr("id"));
    createMapBar($(this).attr("id"));
  });
  $("#options-mapa3 > button").click(function () {
    changeScreen($("#mapa-opcoes3"), $("#mapa"));
    changeImage($(this).attr("id"));
    createMapBar($(this).attr("id"));
  });
  $("#menu-pedidos").click(function () {
    changeScreen($("#menu-overflow"), $("#pedidos"));
  });
  $("#comida1").click(function () {
    changeScreen($("#pedidos"), $("#turca"));
  });
  $("#comida2").click(function () {
    changeScreen($("#pedidos"), $("#tcheca"));
  });

    $("#bebidasbt").click(function () {
        changeScreen($("#pedidos"), $("#bebidas"));
    });

    $(".plusic").click(function () {
        updatePriceUnit(1, $(this).attr("id")[$(this).attr("id").length - 2], $(this).attr("id")[$(this).attr("id").length-1], $(this).parent().attr("food") );
    });
    $(".minusic").click(function () {
        updatePriceUnit(0, $(this).attr("id")[$(this).attr("id").length - 2], $(this).attr("id")[$(this).attr("id").length - 1], $(this).parent().attr("food") );
    });

    $(".bt-ped").click(function () {
        changeScreen($(this).parent().parent(), $("#check-pedido"));
    });

    $("#bt-cancel").click(function () {
        if ($("#pedido-drag > span").length > 1) {
            $("#pedido-drag").empty();
            resetShopCart();
            createPopup(6);
            notifyPopup();
        }
        else {
            createPopup(5);
            notifyPopup();
        }
    });
    $("#bt-comfirm").click(function () {
        if ($("#pedido-drag > span").length > 1) {
            changeScreen($("#check-pedido"), $("#pagar-pedido"));
            $("#pedido-drag").empty();
            resetShopCart();
        }
        else {
            createPopup(5);
            notifyPopup();
        }
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
  if (idle >= 60){
    if ($("#lockscreen").position.top != 0){
      $("#lockscreen").animate({
        "top": 0
      });
      idle = 0;
    }
  }
}

var btImg = {
  "def":"resources/map/map.png",
  "p1":"resources/map/P1.png",
  "p2":"resources/map/P2.png",
  "p3":"resources/map/P3.png",
  "p4":"resources/map/P4.png",
  "w1":"resources/map/WC1.png",
  "w2":"resources/map/Wc2.png",
  "c1":"resources/map/Comida1.png",
  "c2":"resources/map/Comida2.png"
}

function changeImage(el){
  $("#inner-map").css("background-image",`url(${ btImg[el]})`);
}

var band_list = {
  "altj": {
    day:"Dia 1",
    artist: "ALT-J",
    desc: "Descrição: É uma banda de rock alternativo formada em 2007 em Leeds, Inglaterra.",
    hour: "19:00 - 20:30",
    stage: "Palco 1",
  },
  "coldplay": {
    day:"Dia 1",
    artist: "COLDPLAY",
    desc: "Descrição: É uma banda britânica de rock alternativo fundada em 1996 na Inglaterra pelo vocalista e pianista Chris Martin e o guitarrista Jonny Buckland no University College London.",
    hour: "17:00 - 18:45",
    stage: "Palco 2",
  },
  "linkinpark": {
    day:"Dia 1",
    artist: "LINKIN PARK",
    desc: "Descrição: É uma banda de rock dos Estados Unidos formada em 1996 em Agoura Hills, Califórnia. Desde a sua formação, o grupo já vendeu pelo menos 70 milhões de álbuns pelo mundo e ganhou dois Grammy Awards.",
    hour: "00:30 - 02:00",
    stage: "Palco 3",
  },
  "pinkfloyd": {
    day:"Dia 1",
    artist: "PINK FLOYD",
    desc: "Descrição: É uma banda britânica de rock, formada em Londres em 1965, que atingiu sucesso internacional com sua música psicodélica e progressiva.",
    hour: "22:30 - 00:00",
    stage: "Palco 4",
  },
  "imaginedragons": {
    day:"Dia 2",
    artist: "IMAGINE DRAGONS",
    desc: "Descrição: É uma banda de indie rock formada em Las Vegas, Nevada, Estados Unidos.",
    hour: "19:00 - 21:00",
    stage: "Palco 1",
  },
  "postmalone": {
    day:"Dia 2",
    artist: "POST MALONE",
    desc: "Descrição: É um rapper, cantor, compositor e produtor musical norte-americano. Ganhou reconhecimento em fevereiro de 2015, quando lançou seu single de estreia, White Iverson.",
    hour: "22:45 - 00:10",
    stage: "Palco 3",
  },
  "foofighters": {
    day:"Dia 2",
    artist: "FOO FIGHTERS",
    desc: "Descrição: É uma banda de rock dos Estados Unidos formada pelos ex-Nirvana Dave Grohl e Pat Smear em 1994.",
    hour: "00:30 - 02:30",
    stage: "Palco 2",
  },
  "thexx": {
    day:"Dia 2",
    artist: "THE XX",
    desc: "Descrição: É uma banda indie britânica do sudoeste de Londres, Inglaterra.",
    hour: "17:00 - 18:45",
    stage: "Palco 4",
  },

}

var title_list = {
  "cartaz": "Cartaz",
  "list-bandas": "Bandas",
  "band": "Bandas",
  "list-horario": "Dia 1",
  "menu": "Menu",
  "menu-overflow": "Menu",
  "mapa":"Mapa",
  "options-mapa":"Navegar",
  "mapa-opcoes1":"Palcos",
  "mapa-opcoes2":"WC",
  "mapa-opcoes3": "Comida",
  "pedidos":"Pedidos",
  "tcheca": "Tcheca",
  "turca": "Turca",
  "check-pedido": "Pedido",
  "pagar-pedido": "Pagar",
  "bebidas": "Bebidas"
};

var notificationTitle = "";
var notificationInfo = "";

var popup_list = {
  1: ["Alerta adicionado", "Cancelar"],
  2: ["", "Remover"],
  3: ["Função nao implementada", ""],
  4: ["Alerta removido", ""],
  5: ["O seu pedido está vazio.", ""],
  6: ["Cancelou o seu pedido.", ""]
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

function writeToBar(title){
  $("#bar-title").empty();
  $("#bar-title").append('<b style="padding-right:3%;">&lt;</b>' + title);
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

var mapBarTexts = {
  "p1":"Palco 1 | 2mins",
  "p2":"Palco 2 | 3mins",
  "p3":"Palco 3 | 5mins",
  "p4":"Palco 4 | 7mins",
  "w1":"WC 1 | 5mins",
  "w2":"WC 2 | 3mins",
  "c1":"Comida 1 | 8mins",
  "c2":"Comida 2 | 3mins"
}

async function createMapBar(destino){
  let text = $("#map-txt");
  let bt = $("#map-bt");
  let bar = $("#mapbar");
  let h = bar.height();
  let mapBarText = mapBarTexts[destino].split("|");
  text.empty();
  text.html(`<b style="color:black;">${mapBarText[0]}</b>|${mapBarText[1]}`);
  bar.css("bottom", -h -12);
  setTimeout(function () {
    bar.animate({
      bottom:0
    }, 300);
  }, 500);

  bt.click(function () {
    setTimeout(function () {
      bar.animate({
        bottom: -h - 12
      }, 300);
    }, 200);
    changeImage("def");
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
  band_screen.attr("band",el.attr("id"));
  band_screen.empty();
  let fixbardiv = document.createElement("div");
  fixbardiv.className = "fixbar";
  band_screen.append(fixbardiv);
  if (flag) {
    var artist = band_list[el.attr("id")].artist;
    var day = band_list[el.attr("id")].day;
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

    if(el.attr("id")==currentAlert){
      bt_reminder.innerHTML = `<i class="material-icons">notifications_off</i>`;
    }else{
      bt_reminder.innerHTML = `<i class="material-icons">add_alert</i>`;
      bt_reminder.className+=" add";
    }
    if(el.hasClass("bt-past")){
      bt_reminder.className+=" bt-past";
      bt_reminder.setAttribute("disabled", "disabled");
    }

    // bt_nav.textContent = "Navegar";
    // bt_nav.append
    bt_nav.innerHTML = '<i class="material-icons">navigation</i>';
  }

  let list = [artist, day,hour, stage, description];
  let dragDiv = document.createElement("div");
  dragDiv.id = "dragDiv";
  dragDiv.className = "dragDiv";
  let dragDivIn = document.createElement("div");
  dragDivIn.className = "overflow dragDiv";
  let max_drag_bandtext = -110;

  for (let i = 0; i < 5; i++) {
    let divText = document.createElement("div");
    let spanText = document.createElement("p");
    spanText.textContent = list[i];
    divText.className = "text"+i;
    spanText.className = "pargraph";
    spanText.id = "info" + i;

    if(i==0 && el.hasClass("bt-past")){
      divText.className+=" bt-past";
    }

    divText.append(spanText);
    dragDiv.append(divText);

  }

  dragDivIn.append(dragDiv);
  band_screen.append(dragDivIn);
  band_screen.append(bt_reminder);
  band_screen.append(bt_nav);

  let changeOrigin = el.parent().parent().parent().attr("id")=="ecra"?el.parent().parent():el.parent().parent().parent();

  changeScreen(changeOrigin, band_screen);
  //let descricao_height = $("#descricao").height();
  await sleep(500);
  for (let index = 0; index < 5; index++) {
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
    if($("#bt-reminder").hasClass("add")){
      $("#bt-reminder").removeClass("add");
      currentAlert = $("#band").attr("band");
      // $("#bt-reminder").clear();
      $("#bt-reminder").html(`<i class="material-icons">notifications_off</i>`);
      createPopup(1);
      notifyPopup();
      $("#alerticon").css("opacity", "1");
      createNotification(2);
    }else{
      currentAlert=undefined;
      $("#bt-reminder").addClass("add");
      // $("#bt-reminder").clear();
      $("#bt-reminder").html(`<i class="material-icons">add_alert</i>`);
      $("#notification").remove();
      $("#alerticon").css("opacity", "0");
      createPopup(4);
    }

  });
  $("#bt-nav").click(function () {
    // createPopup(3);
    // notifyPopup();
    changeScreen($("#band"), $("#mapa"));
    changeImage("p" + band_list[el.attr("id")].stage[band_list[el.attr("id")].stage.length -1])
  });
  $(".popup-button").click(function () {
    currentAlert=undefined;
    $("#notification").remove();
    $("#alerticon").css("opacity", "0");
    createPopup(4);

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
    if(parseInt($("#lockscreen").css("top"))==0){
      $("#lockscreen").animate({
        'top': -200
      });
    }else{
      $("#lockscreen").animate({
        'top': 0
      });
    }

  }
}

function mapZoomChange(z){

  let mapa = $("#inner-map");
  mapa.css("height",MAP_HEIGHT/z);
  mapa.css("width",MAP_WIDTH/z);

  // let max_drag_top = mapa.top;
  // let max_drag_left = mapa.left;
  console.log(`${parseFloat(mapa.css("top"))/z}px`);
  mapa.css("top", `${parseFloat(mapa.css("top"))*(map_zoom/z)+(SCREEN_SIZE-SCREEN_SIZE*(map_zoom/z))/2}px`);
  mapa.css("left", `${parseFloat(mapa.css("left"))*(map_zoom/z)+(SCREEN_WIDTH-SCREEN_WIDTH*(map_zoom/z))/2}px`);
  map_zoom_last=map_zoom;
  map_zoom=z;
}

function resetShopCart() {
    for (let m = 1; m <= 3; m++) {
        for (let n = 1; n <= 4; n++) {
            let span1 = $("#t1" + n + "" + m);
            let span2 = $("#t2" + n + "" + m);

            span1.text(0);
            span2.text("");
        }
    }
}

function updatePriceUnit(flag, n, m, id) {
    let span1 = $("#t1" + n +""+m);
    let span2 = $("#t2" + n + "" + m);
    let checkdiv = $("#pedido-drag");

    let unit = parseInt(span1.text());
    let price = parseFloat(span1.attr("price"));

    if (flag == 1 && unit<9) {
        unit++;
    }
    else if(flag == 0 && unit >=1){
        unit--;
    }

    price = unit * price;

    let price2dec = price.toFixed(2);

    if (unit == 1 && flag == 1) {
        spanscriados++;
        if (spanscriados > 8) spansnopedido++;
        let spanadd = document.createElement("span");
        let spanadd1 = document.createElement("span");
        let br = document.createElement("br");
        br.id = id + "br";
        spanadd.id = id;
        spanadd.textContent = unit + "x " + id;
        spanadd.style = "position: absolute; left: 2%;"
        spanadd1.id = id + 1;
        spanadd1.textContent = price2dec + "€";
        spanadd1.style = "position: absolute; right: 2%;"
        checkdiv.append(spanadd);
        checkdiv.append(spanadd1);
        checkdiv.append(br);
    }
    else if (unit == 0 && flag == 0) {
        spanscriados--;
        if (spansnopedido > 8) spansnopedido--;
        $("#" + id).remove();
        $("#" + id + 1).remove();
        $("#" + id +"br").remove();
    }
    else {
        let spanupdate = $("#" + id);
        let spanupdate1 = $("#" + id + 1);
        spanupdate.text(unit + "x " + id);
        spanupdate1.text(price2dec + "€");
    }

    span1.text(unit);
    span2.text(price2dec + "€");

    let pedidocheck = $("#pedido-drag");
    let max_drag_pedidocheck = -(spansnopedido * 25 - 206.47 * 0.69);
    pedidocheck.css("top", 0);
    pedidocheck.draggable({
        axis: "y",
        scroll: false,
        position: 'unset',
        cancel: false,
        drag: function (event, ui) {
            if (ui.position.top > 0) ui.position.top = 0;
            if (ui.position.top < max_drag_pedidocheck) ui.position.top = max_drag_pedidocheck;
        },
        stop: function (event, ui) {
            $(event.originalEvent.target).one('click', function (e) {
                e.stopImmediatePropagation();
            });
        }

    });

}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
onload = init;
