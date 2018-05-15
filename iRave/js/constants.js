'use strict';
const DEBUG = true;
const BUTTON_SIZE = 64;
const BAR_SIZE = 25.8;
const SCREEN_SIZE = 178.31;
const SCREEN_WIDTH=145;
const NR_OF_MENU_EL = 3;

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
var precototal = 0;

var map_zoom = 2;
var map_zoom_last =1;
var map_left =  (MAP_WIDTH / map_zoom) - SCREEN_SIZE;
var map_top=(MAP_HEIGHT / map_zoom)-SCREEN_SIZE;
var pay_list = [];

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
  "mapa-opcoes3": "Comer",
  "pedidos":"Pedidos",
  "tcheca": "Tcheca",
  "turca": "Turca",
  "check-pedido": "Pedido",
  "pagar-pedido": "Pagar",
  "bebidas": "Bebidas",
  "pedidos-list": "Lista"
};

var notificationTitle = "";
var notificationInfo = "";

var popup_list = {
  1: ["Alerta adicionado", "Cancelar"],
  2: ["", "Remover"],
  3: ["Função nao implementada", ""],
  4: ["Alerta removido", ""],
  5: ["O seu pedido está vazio.", ""],
  6: ["Cancelou o seu pedido.", ""],
  7: ["O seu pedido foi efetuado com sucesso.", ""],
  8: ["", ""]
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
