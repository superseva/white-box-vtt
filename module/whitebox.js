import { DiceRoller } from "./components/dice-roller.js";
import { WhiteboxActor } from "./actor/actor.js";
import { WhiteboxActorSheet } from "./actor/actor-sheet.js";
//import { WhiteboxEnemySheet } from "./actor/enemy-sheet.js";
import { WhiteboxItem } from "./item/item.js";
import { WhiteboxItemSheet } from "./item/item-sheet.js";

Hooks.once("init", function () {
    game.whitebox = {
        DiceRoller,
        WhiteboxActor,
        WhiteboxActorSheet,
    };
    // Define custom Entity classes
    CONFIG.Actor.entityClass = WhiteboxActor;
    CONFIG.Item.entityClass = WhiteboxItem;
    // Register sheet application classes
    Actors.unregisterSheet("core", ActorSheet);
    Actors.registerSheet("whitebox", WhiteboxActorSheet, { makeDefault: true, types: ["character"] });
    //Actors.registerSheet("whitebox", WhiteboxEnemySheet, { makeDefault: true, types: ["enemy"] });
    Items.unregisterSheet("core", ItemSheet);
    Items.registerSheet("whitebox", WhiteboxItemSheet, { makeDefault: true });

    Hooks.on("preCreateItem", function (entity, options, userId) {
        console.log(entity);
        if (!entity.type) return;

        switch (entity.type) {
            case "weapon":
                entity.img = "systems/white-box-vtt/assets/axe-sword.svg";
                break;
            case "armor":
                entity.img = "systems/white-box-vtt/assets/breastplate.svg";
                break;
            case "gear":
                entity.img = "systems/white-box-vtt/assets/swap-bag.svg";
                break;
            case "ability":
                entity.img = "systems/white-box-vtt/assets/skills.svg";
                break;
            case "spell":
                entity.img = "systems/white-box-vtt/assets/magic-swirl.svg";
                break;
            case "monster_attack":
                entity.img = "systems/white-box-vtt/assets/ent-mouth.svg";
                break;
        }
        //entity.img = 'systems/white-box-vtt/assets/icons/' + entity.type + '.jpg'
    });

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
