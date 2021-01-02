export function registerSettings() {
    game.settings.register("white-box-vtt", "addStrToHit", {
        name: "STR bonus to hit",
        hint: "Add STR bonus to hit with melee attacks",
        default: true,
        scope: "world",
        type: Boolean,
        config: true,
    });
    game.settings.register("white-box-vtt", "addDexToHit", {
        name: "DEX bonus to hit",
        hint: "Add DEX bonus to hit with ranged attacks",
        default: true,
        scope: "world",
        type: Boolean,
        config: true,
    });
    game.settings.register("white-box-vtt", "addStrToDamage", {
        name: "STR bonus to damage",
        hint:
            "If this option is ON STR bonus is added to any damage with the melee attacks. Optionaly, if this option is OFF, you can use @str to add STR bonus to specific melle damage. (example: 1d6 + @str)",
        default: false,
        scope: "world",
        type: Boolean,
        config: true,
    });
}
