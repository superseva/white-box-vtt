import { DiceRoller } from "./components/dice-roller.js";
import { RollDialog } from "./components/roll-dialog.js";
import { WhiteboxActor } from "./actor/actor.js";
import { WhiteboxActorSheet } from "./actor/actor-sheet.js";
import { WhiteboxMonsterSheet } from "./actor/monster-sheet.js";
import { WhiteboxItem } from "./item/item.js";
import { WhiteboxItemSheet } from "./item/item-sheet.js";
import { registerSettings } from "./settings.js";

Hooks.once("init", function () {
    game.whitebox = {
        WhiteBoxHelper,
        DiceRoller,
        RollDialog,
        WhiteboxActor,
        WhiteboxActorSheet,
    };
    // Define custom Entity classes
    CONFIG.Actor.entityClass = WhiteboxActor;
    CONFIG.Item.entityClass = WhiteboxItem;

    registerSettings();
    // Register sheet application classes
    Actors.unregisterSheet("core", ActorSheet);
    Actors.registerSheet("whitebox", WhiteboxActorSheet, { makeDefault: true, types: ["character"] });
    Actors.registerSheet("whitebox", WhiteboxMonsterSheet, { makeDefault: true, types: ["monster"] });
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

    _preloadHandlebarsTemplates();

    Handlebars.registerHelper("concat", function () {
        var outStr = "";
        for (var arg in arguments) {
            if (typeof arguments[arg] != "object") {
                outStr += arguments[arg];
            }
        }
        return outStr;
    });

    Handlebars.registerHelper("toLowerCase", function (str) {
        return str.toLowerCase();
    });

    Handlebars.registerHelper("toUpperCase", function (str) {
        return str.toUpperCase();
    });

    Handlebars.registerHelper("times", function (n, block) {
        var accum = "";
        for (var i = 0; i < n; ++i) accum += block.fn(i);
        return accum;
    });

    Handlebars.registerHelper("ifCond", function (v1, operator, v2, options) {
        switch (operator) {
            case "==":
                return v1 == v2 ? options.fn(this) : options.inverse(this);
            case "===":
                return v1 === v2 ? options.fn(this) : options.inverse(this);
            case "!=":
                return v1 != v2 ? options.fn(this) : options.inverse(this);
            case "!==":
                return v1 !== v2 ? options.fn(this) : options.inverse(this);
            case "<":
                return v1 < v2 ? options.fn(this) : options.inverse(this);
            case "<=":
                return v1 <= v2 ? options.fn(this) : options.inverse(this);
            case ">":
                return v1 > v2 ? options.fn(this) : options.inverse(this);
            case ">=":
                return v1 >= v2 ? options.fn(this) : options.inverse(this);
            case "&&":
                return v1 && v2 ? options.fn(this) : options.inverse(this);
            case "||":
                return v1 || v2 ? options.fn(this) : options.inverse(this);
            default:
                return options.inverse(this);
        }
    });

    Handlebars.registerHelper("math", function (lvalue, operator, rvalue, options) {
        lvalue = parseFloat(lvalue);
        rvalue = parseFloat(rvalue);

        return {
            "+": lvalue + rvalue,
            "-": lvalue - rvalue,
            "*": lvalue * rvalue,
            "/": lvalue / rvalue,
            "%": lvalue % rvalue,
        }[operator];
    });

    Handlebars.registerHelper("packed", function (weight, quantity, options) {
        return Math.ceil(parseInt(weight) / 2) * parseInt(quantity);
    });
});

/* -------------------------------------------- */
/** LOAD PARTIALS
/* -------------------------------------------- */

function _preloadHandlebarsTemplates() {
    const templatePaths = ["systems/white-box-vtt/templates/actor/parts/spell-group.html"];
    return loadTemplates(templatePaths);
}

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
