'use strict';

// Todo
// Horario Navegar
// Nav pedidos
// notificar pedido Pronto
// Fazer mais Restaurantes
// Mapa photoshop
// Autoupdate
//
//

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


function changeImage(el){
  $("#inner-map").css("background-image",`url(${ btImg[el]})`);
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

function createPedidoDetails(el,ready){
    console.log(el);
    let i = parseInt(el);
    console.log(i);
    // console.log(el.attr("id"));
    console.log(pay_list);
    let pay_el = pay_list[i];
    // console.warn(pay_el);
    let pedidos_descricao = $("#pedidos-description");
    pedidos_descricao.empty();
    let buttonLevantar=`<button id="bt-pedidoslist" class="mdl-button--raised no-hover3 bt-pedlist mdl-button mdl-js-button mdl-js-ripple-effect" data-upgraded=",MaterialButton,MaterialRipple">
                        <i class="material-icons">list</i>
                    <span class="mdl-button__ripple-container"><span class="mdl-ripple is-animating" style="width: 284.206px; height: 284.206px; transform: translate(-50%, -50%) translate(85px, 23px);"></span></span></button>`
    pedidos_descricao.append(pay_el[1]+buttonLevantar);
    let pedidocheck2 = pedidos_descricao.children();
    pedidocheck2.attr("id","pedido-drag2");


    let max_drag_pedidocheck = -(spansnopedido * 25 - 206.47 * 0.69);
    pedidocheck2.css("top", BAR_SIZE);
    pedidocheck2.draggable({
        axis: "y",
        scroll: false,
        position: 'unset',
        cancel: false,
        drag: function (event, ui) {
            if (ui.position.top > 0) ui.position.top = BAR_SIZE;
            if (ui.position.top < max_drag_pedidocheck) ui.position.top = max_drag_pedidocheck;
        },
        stop: function (event, ui) {
            $(event.originalEvent.target).one('click', function (e) {
                e.stopImmediatePropagation();
            });
        }
    });

    if(ready){
      $("#bt-pedidos-desc").css("opacity","1");
      $("#bt-pedidos-desc").removeClass("no-touch");
    }else{
      $("#bt-pedidos-desc").css("opacity","0.5");
      $("#bt-pedidos-desc").addClass("no-touch");
    }


    $("#bt-pedidos-desc").attr("pedidos",i);
    changeScreen($("#pedidos-list"),$("#ped-description"));

}

function creatPayList(){
  let pedido_list = $("#pedido-list-menu");
  pedido_list.empty();
  let i = 0;
  for (i = 0; i < pay_list.length; i++) {
    let el = pay_list[i];
    if(el[3]==undefined){
      el.push(Math.ceil(Math.random() * 5));
    }
    let time;
    if(el[3]!=0){
      time=`Tempo: <span class="wait_time">${el[3]}</span> mins`;
    } else {
        popup_list[2][0] = "O pedido " + el[0] + " está pronto.";
        createPopup(2);
        notifyPopup();
        createNotification(2);
        $("#alerticon").css("opacity", "1");
      time="Pedido Pronto";
    }
    console.log("sup" + el[0]);
      let button = document.createElement("button");
      button.id=`${i}pedido`;
      button.className = "mdl-button--raised no-hover bt-schedule button-style mdl-button mdl-js-button mdl-js-ripple-effect";
      button.innerHTML = `<div class="mdl-button__ripple-container">
                              <div class="bt-title">
                                  ${"Pedido nr: "+el[0]}
                              </div>
                              <div class="bt-text">
                                  <br>
                                  <span>${time}</span><br><br>
                                  <span>${"Preço: " +el[2] + "€"}</span>
                              </div>
                          </div>`
      pedido_list.append(button);

      max_pedido = -($("#pedido-list-menu > button").length * BUTTON_SIZE - 206.47) - BAR_SIZE;
      max_pedido = (max_pedido < 175) ? 175 :  max_pedido;

      $("#pedido-list-menu > button").click(function(){
        let ready = true ? pay_list[parseInt($(this).attr("id"))][3]<=0 : false;
        createPedidoDetails($(this).attr("id"),ready);
      });
  }
  if(i==0){
    $("#pedido-list-menu").css("background-image","url(./resources/checkedpedido2.png)");
    $("#pedido-list-menu").css("opacity","0.5");
    max_pedido=0;
  }else{
    $("#pedido-list-menu").css("background-image","none");
    $("#pedido-list-menu").css("opacity","1");
  }

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
  await sleep(1000);
  boot_title.fadeTo(2000, 1);
  // boot_title.css("opacity",1);
  await sleep(2000);
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

  if(atual==undefined){
    // $("#back-bt").addClass("no-touch");
    // $("#crown-button").addClass("no-touch");
    // $("#menu-overflow").removeClass("disabled");
    // $("#menu-overflow").css("height", "76%");
    // $("#menu-overflow").css("width", "72%");
    // $("#menu-overflow").css("opacity", 1);
    // $("#menu-overflow").css("z-index", 20);
    return;
  }
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

  $("#bar-title").addClass("no-touch");
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
    $("#bar-title").removeClass("no-touch");
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
            span2.text("0.00€");
        }
    }
}

function calculateTotal() {
    let span2;
    $("#totalapagar").remove();
    $("#brtotal").remove();
    let spantotal = document.createElement("span");
    let brtotal = document.createElement("br");
    brtotal.id = "brtotal";
    spantotal.id = "totalapagar";
    spantotal.style = "position: absolute; right: 2%;"
    spantotal.textContent = "Total: " + precototal.toFixed(2) + "€";
    let checkdiv = $("#pedido-drag");
    checkdiv.append(spantotal)
    checkdiv.append(brtotal);
}

function updatePriceUnit(flag, n, m, id) {
    let span1 = $("#t1" + n +""+m);
    let span2 = $("#t2" + n + "" + m);
    let checkdiv = $("#pedido-drag");

    let unit = parseInt(span1.text());
    let price = parseFloat(span1.attr("price"));

    if (flag == 1 && unit<9) {
        unit++;
        precototal += price;
    }
    else if(flag == 0 && unit >=1){
        unit--;
        precototal -= price;
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

onload = init;
