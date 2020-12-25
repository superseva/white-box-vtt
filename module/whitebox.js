import { DiceRoller } from "./components/dice-roller.js";
import { WhiteboxActor } from "./actor/actor.js";
import { WhiteboxActorSheet } from "./actor/actor-sheet.js";
//import { WhiteboxEnemySheet } from "./actor/enemy-sheet.js";
import { WhiteboxItem } from "./item/item.js";
import { WhiteboxItemSheet } from "./item/item-sheet.js";
//import { WhiteBoxHelper } from "./whitebox.js";

Hooks.once("init", function () {
    game.whitebox = {
        WhiteBoxHelper,
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
        if (!entity.type) return;
        entity.img = WhiteBoxHelper.GetCreatedImage(entity.type);
    });
    Hooks.on("preCreateOwnedItem", function (actor, entity, options, userId) {
        if (!entity.type) return;
        entity.img = WhiteBoxHelper.GetCreatedImage(entity.type);
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

export class WhiteBoxHelper {
    static GetCreatedImage(item_type) {
        let img = "";
        switch (item_type) {
            case "weapon":
                img = "systems/white-box-vtt/assets/axe-sword.svg";
                break;
            case "armor":
                img = "systems/white-box-vtt/assets/breastplate.svg";
                break;
            case "gear":
                img = "systems/white-box-vtt/assets/swap-bag.svg";
                break;
            case "ability":
                img = "systems/white-box-vtt/assets/skills.svg";
                break;
            case "spell":
                img = "systems/white-box-vtt/assets/magic-swirl.svg";
                break;
            case "monster_attack":
                img = "systems/white-box-vtt/assets/ent-mouth.svg";
                break;
        }
        return img;
    }
}
