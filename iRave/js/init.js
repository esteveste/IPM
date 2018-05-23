'use strict';

async function init() {
  console.log("lets go");
  bootAnimation(DEBUG);
  lockArrow();
  updateTime();
  mapZoomChange(2);
  mapZoomChange(1);
  mapZoomChange(2);

  $("#inner-map").css("left","-269px");
  $("#inner-map").css("top","-29px");
  var idletimer = setInterval(detectIdleTime, 2000);

  $(document).mousemove(function (e) {
    idle = 0;
  });
  $(document).keypress(function (e) {
    idle = 0;
  });

  let lockScreen = $("#lockscreen");
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
    }

  });


  let menu = $("#menu");
  const maxMenuDrag = -SCREEN_SIZE * (NR_OF_MENU_EL - 1);
  menu.draggable({
    axis: "y",
    scroll: false,
    position: 'unset',
    drag: function (event, ui) {
      if (ui.position.top > 0) ui.position.top = 0;
      if (ui.position.top < maxMenuDrag) ui.position.top = maxMenuDrag;
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
  });

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
  let max_drag_top = mapa.top;
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

  let pedido_lista = $("#pedido-list-menu");
  max_pedido = -($("#pedido-list-menu > button").length * 90 - 206.47) - BAR_SIZE;
  max_pedido = (max_pedido < 175) ? 175 :  max_pedido;
  pedido_lista.css("top", BAR_SIZE);
  pedido_lista.draggable({
    axis: "y",
    scroll: false,
    position: 'unset',
    cancel: false,
    drag: function (event, ui) {
      if (ui.position.top > BAR_SIZE) ui.position.top = BAR_SIZE;
      if (ui.position.top < -max_pedido) ui.position.top = -max_pedido;
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

    let pedidos = $("#pedidos-drag");
    let max_drag_pedidos = -($("#pedidos-drag > button").length * 90 - 206.47*0.69);
    pedidos.css("top", 0);
    pedidos.draggable({
        axis: "y",
        scroll: false,
        position: 'unset',
        cancel: false,
        drag: function (event, ui) {
            if (ui.position.top > BAR_SIZE) ui.position.top = 0;
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
      var top =  ((e.pageY - $("#mapa").offset().top)/178.333)*100 - (60/178.333)*50/2;
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
    $("#inner-map").css("left",`-${269*map_zoom_last}px`);
    $("#inner-map").css("top",`-${29*map_zoom_last}px`);
    // remove Map options back posibility
    appHistory.splice(-3);
  });
  $("#options-mapa2 > button").click(function () {
    changeScreen($("#mapa-opcoes2"), $("#mapa"));
    changeImage($(this).attr("id"));
    createMapBar($(this).attr("id"));
    $("#inner-map").css("left",`-${269*map_zoom_last}px`);
    $("#inner-map").css("top",`-${29*map_zoom_last}px`);
    appHistory.splice(-3);
  });
  $("#options-mapa3 > button").click(function () {
    changeScreen($("#mapa-opcoes3"), $("#mapa"));
    changeImage($(this).attr("id"));
    createMapBar($(this).attr("id"));
    $("#inner-map").css("left",`-${269*map_zoom_last}px`);
    $("#inner-map").css("top",`-${29*map_zoom_last}px`);
    appHistory.splice(-3);
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
        updatePriceUnit(1, $(this).attr("id")[$(this).attr("id").length - 2], $(this).attr("id")[$(this).attr("id").length - 1], $(this).parent().attr("food"));
        calculateTotal();
    });
    $(".minusic").click(function () {
        updatePriceUnit(0, $(this).attr("id")[$(this).attr("id").length - 2], $(this).attr("id")[$(this).attr("id").length - 1], $(this).parent().attr("food"));
        calculateTotal();
    });

    $(".bt-ped").click(function () {
        changeScreen($(this).parent().parent(), $("#check-pedido"));
    });

    $(".bt-pedlist").click(function () {
        creatPayList();
        changeScreen($("#pedidos"), $("#pedidos-list"));
    });

    $("#bt-cancel").click(function () {
        if ($("#pedido-drag > span").length > 1) {
            $("#pedido-drag").empty();
            resetShopCart();
            precototal = 0;
            createPopup(6);
            notifyPopup();
            changeScreen($("#check-pedido"), $("#pedidos"));
        }
        else {
            createPopup(5);
            notifyPopup();
            changeScreen($("#check-pedido"), $("#pedidos"));
        }
    });
    $("#bt-comfirm").click(function () {
        if ($("#pedido-drag > span").length > 1) {
            changeScreen($("#check-pedido"), $("#pagar-pedido"));
        }
        else {
            createPopup(5);
            notifyPopup();
        }
    });

    $("#imgpagar").click(clickOnQRCode);
    async function clickOnQRCode() {

      $("#back-bt").addClass("no-touch");
      $("#crown-button").addClass("no-touch");
      $("#bar-title").addClass("no-touch");
      $("#imgpagar").addClass("no-touch");
      let pedido_nr =Math.floor((Math.random() * 100) + 1);
      let pedido_list = document.getElementById("pedido-overflow").innerHTML;
      let preco_total = precototal.toFixed(2);
      pay_list.push([pedido_nr,pedido_list,preco_total]);
      resetShopCart();
      precototal = 0.00;
      $("#pedido-drag").empty();

      var idtime;
      $("#imgpagar").attr("src", "resources/load.gif");
      await sleep(1000);
      createPopup(7);
      notifyPopup();
      setTimeout(function () {
          popup_list[8][0] = "O numero do seu pedido e o " + pedido_nr.toString();
          createPopup(8);
          notifyPopup();
          creatPayList();
      }, 4100);
      $("#imgpagar").attr("src", "resources/checked.png");
      $("#imgpagar").attr("id", "imgpagar1");
      $("#pedido-pagar3").text("Pagamento Efetuado");
      idtime = setTimeout( async function () {
        changeScreen($("#pagar-pedido"), $("#pedidos"));
        appHistory.splice(-4);
        await sleep(1000);

        $("#pedido-pagar3").text("Faça scan para pagar");
        $("#imgpagar1").attr("src", "resources/qrfake.png");
        $("#imgpagar1").removeClass("no-touch");
        $("#imgpagar1").attr("id", "imgpagar");
      }, 3000);
    }

      $("#imglift").click(clickOnPickUpFood);

      async function clickOnPickUpFood() {

        $("#back-bt").addClass("no-touch");
        $("#crown-button").addClass("no-touch");
        $("#bar-title").addClass("no-touch");
        $("#imglift").addClass("no-touch");

        let index = atual_Pedido_Lift;
        if (index > -1) {
          pay_list.splice(index, 1);
        }
        atual_Pedido_Lift=-1;

        let idtime;
        $("#imglift").attr("src", "resources/load.gif");
        await sleep(1000);
        // createPopup(9);
        // notifyPopup();
        $("#imglift").attr("src", "resources/checked.png");
        $("#imglift").attr("id", "imglift1");
        $("#pedido-pagar3-d").text("Pedido Confirmado");
        idtime = setTimeout( async function () {
          creatPayList()
          changeScreen($("#pagar-pedido-d"),$("#pedidos-list"));
          appHistory.splice(-4);
          await sleep(1000);

          $("#pedido-pagar3-d").text("Aproxime o terminal");
          $("#imglift1").attr("src", "resources/terminal.png");
          $("#imglift1").removeClass("no-touch");
          $("#imglift1").attr("id", "imglift");
          $("#imglift1").click(clickOnQRCode);
        }, 3000);
      // $("#imgpagar1").click(function () {
      //   clearTimeout(idtime);
      //   changeScreen($("#pagar-pedido"), $("#pedidos"), );
      //   $("#pedido-pagar3").text("Faça scan para pagar");
      //   $("#imgpagar1").attr("src", "resources/qrfake.png");
      //   $("#imgpagar1").attr("id", "imgpagar");
      //   $("#imgpagar").click(clickOnQRCode);
      // });
    }
  // $("#lockscreen").click(function () {
  //   if ($("#lockscreen").position.top != 0){
  //     $("#lockscreen").animate({
  //       'top': -225
  //     });
  //   }
  // });
  $("#bar-title").click(backApp);

  $("#bar-title").text("Menu");

  $("#bt-pedidos-desc").click(function(){
    atual_Pedido_Lift = parseInt($(this).attr("pedidos"));
    console.log(atual_Pedido_Lift);
    changeScreen($("#ped-description"),$("#pagar-pedido-d"));
  });

    $("#bt-pedidos-nav").click(function () {
        changeScreen($("#ped-description"), $("#mapa"));
    });


  setInterval(function(){
    $(".wait_time").each(function(){
      let nr = parseInt($(this).html());
      $(this).html(--nr);
      let i_list =parseInt($(this).parent().parent().parent().parent().attr("id"));
      pay_list[i_list][3]=nr;
      if(nr<=0){
        popup_list[10][0] = "O pedido " + pay_list[i_list][0] + " está pronto.";
        createPopup(10);
        notifyPopup();
        createNotification(10);
        $("#alerticon").css("opacity", "1");
        $(this).parent().html("Pedido Pronto");
        $(this).removeClass("wait_time");
      }
    })
  },10000);




}
