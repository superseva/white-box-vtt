import { DiceRoller } from "./components/dice-roller.js";
import { RollDialog } from "./components/roll-dialog.js";
import { WhiteboxActor } from "./actor/actor.mjs";
import { WhiteboxActorSheet } from "./actor/actor-sheet.mjs";
import { WhiteboxMonsterSheet } from "./actor/monster-sheet.mjs";
import { WhiteboxItem } from "./item/item.mjs";
import { WhiteboxItemSheet } from "./item/item-sheet.mjs";
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
    CONFIG.Combat.initiative = {
        formula: "1d6",
    };

    CONFIG.Actor.documentClass = WhiteboxActor;
    CONFIG.Item.documentClass = WhiteboxItem;

    registerSettings();
    // Register sheet application classes
    Actors.unregisterSheet("core", ActorSheet);
    Actors.registerSheet("whitebox", WhiteboxActorSheet, { makeDefault: true, types: ["character"] });
    Actors.registerSheet("whitebox", WhiteboxMonsterSheet, { makeDefault: true, types: ["monster"] });
    Items.unregisterSheet("core", ItemSheet);
    Items.registerSheet("whitebox", WhiteboxItemSheet, { makeDefault: true });

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

Hooks.on("preUpdateCombat", function (combat, data, diff, id) {
    if (!data.round) {
        return;
    }
    if (data.round !== 1) {
        combat.resetAll();
    }
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
