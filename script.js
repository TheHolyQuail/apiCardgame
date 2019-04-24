//the ID of the games deck
var deckID;
var players = 3;

$(document).ready(function() {
    //code for searching
    $("body").on("click", "#start", function() {
        $.ajax({
            url: 'https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1',
            type: 'GET',
            crossDomain: true,
            dataType: 'json',
            success: preStart,
            error: function () {
                alert('ERROR 01: retrieval error');
            }
        });
        $("#start").hide();
        $("#playerSelect").hide();
        $("#gameControl").show();
    });
    $('#input').change(function() {
        players = $('#input').valueOf();
    });
});

function preStart (result) {
    console.log(result);
    deckID = result.deck_id;
    startGame();
    $("#start").attr("display","none");
}

function onLoad() {
    $("#gameControl").hide();
}

function startGame() {
    players = $('input:text').val();
    //console.log("deckID: " + deckID);
    $.ajax({
        url: 'https://deckofcardsapi.com/api/deck/'+ deckID +'/draw/?count=' + players.toString(),
        type: 'GET',
        crossDomain: true,
        dataType: 'json',
        success: setRes,

        //     function (result) {
        //     res = result;
        //     console.log(res/*ult*/);
        // },
        error: function () {
            alert('ERROR 01: retrieval error');
        }
    });

}

function setRes(res) {
    console.log(res);
    //creates the players and displays them
    createFields();
    distributeFields();

    //create piles for people
    var card;
    for(var i = 0; i < players; i++) {
        card = res.cards[i].code;

        if(i == 0){
            //for the players cards (they are always visible)
            $('<img/>', {
                'class': 'card',
                'id': "card" + i.toString(),
                'src': res.cards[i].image
            }).appendTo('#player' + (i + 1).toString());
        }else{
            //for the computers cards (they are not always visible)
            $('<img/>', {
                'class': 'card',
                'id': "card" + i.toString(),
                'src': res.cards[i].image
            }).appendTo('#player' + (i + 1).toString());
        }

        $.ajax({
            url: 'https://deckofcardsapi.com/api/deck/' + deckID + '/pile/'+ i.toString() +'/add/?cards=' + card,
            type: 'GET',
            crossDomain: true,
            dataType: 'json',
            success: function (result) {
                console.log(result.piles[i]);
            },
            error: function () {
                alert('ERROR 01: retrieval error');
            }
        });
    }
}

function draw(){

}

function end(){

}

function AIround(){
    
}

function createFields() {
    $('.field').remove();
    var container = $('#container');
    for(var i = 0; i < players; i++) {
        if(i != 0) {
            $('<div/>', {
                'class': 'field',
                'id': "player" + (i + 1).toString(),
                'text': "player " + (i + 1).toString()
            }).appendTo(container);
        }else {
            //the human player is player 1
            $('<div/>', {
                'class': 'field',
                'id': "player" + (i + 1).toString(),
                'text': "You"
            }).appendTo(container);
        }
        //make image div and use insert affter to insert it into code
    }
}

function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

function distributeFields() {
    var radius = 200;
    var fields = $('.field'), container = $('#container'),
        width = container.width(), height = container.height(),
        angle = 0, step = (2*Math.PI) / fields.length;
    fields.each(function() {
        var x = Math.round(width/2 + radius * Math.cos(angle) - $(this).width()/2);
        var y = Math.round(height/2 + radius * Math.sin(angle) - $(this).height()/2);
        if(window.console) {
            console.log($(this).text());
        }
        $(this).css({
            left: x + 'px',
            top: y + 'px'
        });
        angle += step;
    });
}
/*
https://deckofcardsapi.com/api/deck/new/ new deck of cards


https://deckofcardsapi.com/api/deck/<<new>>/draw/?count=6 creates new deck and draws(in this case 6)
{
    "success": true,
    "cards": [
        {
            "image": "https://deckofcardsapi.com/static/img/KH.png",
            "value": "KING",
            "suit": "HEARTS",
            "code": "KH"
        },
        {
            "image": "https://deckofcardsapi.com/static/img/8C.png",
            "value": "8",
            "suit": "CLUBS",
            "code": "8C"
        }
    ],
    "deck_id":"3p40paa87x90",
    "remaining": 50
}

Shuffle the Cards:
https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1
Add deck_count as a GET or POST parameter to define the number of Decks you want to use. Blackjack typically uses 6 decks. The default is 1.


Response:
{
    "success": true,
    "deck_id": "3p40paa87x90",
    "shuffled": true,
    "remaining": 52
}
Draw a Card:
https://deckofcardsapi.com/api/deck/<<deck_id>>/draw/?count=2
The count variable defines how many cards to draw from the deck. Be sure to replace deck_id with a valid deck_id. We use the deck_id as an identifier so we know who is playing with what deck. After two weeks, if no actions have been made on the deck then we throw it away.

TIP: replace <<deck_id>> with "new" to create a shuffled deck and draw cards from that deck in the same request.


Response:
{
    "success": true,
    "cards": [
        {
            "image": "https://deckofcardsapi.com/static/img/KH.png",
            "value": "KING",
            "suit": "HEARTS",
            "code": "KH"
        },
        {
            "image": "https://deckofcardsapi.com/static/img/8C.png",
            "value": "8",
            "suit": "CLUBS",
            "code": "8C"
        }
    ],
    "deck_id":"3p40paa87x90",
    "remaining": 50
}

A Brand New Deck:
https://deckofcardsapi.com/api/deck/new/
Open a brand new deck of cards.
A-spades, 2-spades, 3-spades... followed by diamonds, clubs, then hearts.

Response:
{
    "success": true,
    "deck_id": "3p40paa87x90",
    "shuffled": false,
    "remaining": 52
}

Adding to Piles
https://deckofcardsapi.com/api/deck/<<deck_id>>/pile/<<pile_name>>/add/?cards=AS,2S
Piles can be used for discarding, players hands, or whatever else. Piles are created on the fly, just give a pile a name and add a drawn card to the pile. If the pile didn't exist before, it does now. After a card has been drawn from the deck it can be moved from pile to pile.

Note: This will not work with multiple decks.

Response:
{
    "success": true,
    "deck_id": "3p40paa87x90",
    "remaining": 12,
    "piles": {
        "discard": {
            "remaining": 2
        }
    }
}

Listing Cards in Piles
https://deckofcardsapi.com/api/deck/<<deck_id>>/pile/<<pile_name>>/list
Note: This will not work with multiple decks.

Response:
{
    "success": true,
    "deck_id": "d5x0uw65g416",
    "remaining": "42",
    "piles": {
        "player1": {
            "remaining": "3"
        },
        "player2": {
            "cards": [
                {
                    "image": "https://deckofcardsapi.com/static/img/KH.png",
                    "value": "KING",
                    "suit": "HEARTS",
                    "code": "KH"
                },
                {
                    "image": "https://deckofcardsapi.com/static/img/8C.png",
                    "value": "8",
                    "suit": "CLUBS",
                    "code": "8C"
                }
            ],
            "remaining": "2"
        }
    },
}
Drawing from Piles
https://deckofcardsapi.com/api/deck/<<deck_id>>/pile/<<pile_name>>/draw/?cards=AS
https://deckofcardsapi.com/api/deck/<<deck_id>>/pile/<<pile_name>>/draw/?count=2
https://deckofcardsapi.com/api/deck/<<deck_id>>/draw/bottom/
Specify the cards that you want to draw from the pile. The default is to just draw off the top of the pile (it's a stack). Or add the bottom parameter to the URL to draw from the bottom.

Response:
{
    "success": true,
    "deck_id": "3p40paa87x90",
    "remaining": 12,
    "piles": {
        "discard": {
            "remaining": 1
        }
    },
    "cards": [
        {
            "image": "https://deckofcardsapi.com/static/img/AS.png",
            "value": "ACE",
            "suit": "SPADES",
            "code": "AS"
        }
    ]
}
*/