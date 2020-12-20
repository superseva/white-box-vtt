import { DiceRoller } from "./components/dice-roller.js";
import { WhiteboxActor } from "./actor/actor.js";
import { WhiteboxActorSheet } from "./actor/actor-sheet.js";
//import { WhiteboxEnemySheet } from "./actor/enemy-sheet.js";
//import { WhiteboxItem } from "./item/item.js";
//import { WhiteboxItemSheet } from "./item/item-sheet.js";

Hooks.once("init", function () {
    game.whitebox = {
        DiceRoller,
        WhiteboxActor,
        WhiteboxActorSheet,
    };
    // Define custom Entity classes
    CONFIG.Actor.entityClass = WhiteboxActor;
    //CONFIG.Item.entityClass = WhiteboxItem;
    // Register sheet application classes
    Actors.unregisterSheet("core", ActorSheet);
    Actors.registerSheet("whitebox", WhiteboxActorSheet, { makeDefault: true, types: ["character"] });
    //Actors.registerSheet("whitebox", WhiteboxEnemySheet, { makeDefault: true, types: ["enemy"] });
    //Items.unregisterSheet("core", ItemSheet);
    //Items.registerSheet("whitebox", WhiteboxItemSheet, { makeDefault: true });

    Handlebars.registerHelper("concat", function () {
        var outStr = "";
        for (var arg in arguments) {
            if (typeof arguments[arg] != "object") {
                outStr += arguments[arg];
            }
        }
        return outStr;
    });
});
