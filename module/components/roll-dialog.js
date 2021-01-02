import { DiceRoller } from "./dice-roller.js";
export class RollDialog {
    static async prepareDialog({
        actor = null,
        num = 1,
        type = 6,
        base = null,
        base_label = null,
        mod = null,
        mod_label = null,
        tn = null,
        visible = true,
        label = "Custom Roll",
        with_mod = false,
    } = {}) {
        let htmlData = {
            num: num,
            type: type,
            base: base,
            base_label: base_label,
            mod: mod,
            mod_label: mod_label,
            tn: tn,
            visible: visible,
            label: label,
            with_mod: with_mod,
        };
        let htmlContent = await renderTemplate("systems/white-box-vtt/templates/components/roll-dialog.html", htmlData);
        return new Promise((resolve) => {
            let d = new Dialog({
                title: "X in 6",
                content: htmlContent,
                buttons: {
                    roll: {
                        icon: "",
                        label: "Roll D6",
                        callback: (html) => {
                            let _base = html.find(".base").val();
                            let _mod = html.find(".mod").val();
                            let _visible = html.find(".visible").prop("checked");
                            let _tn = html.find(".tn").val();
                            let _label = html.find(".label").val();
                            game.whitebox.DiceRoller.roll({ num: htmlData.num, type: 6, base: _base, mod: _mod, visible: _visible, tn: _tn, label: _label });
                        },
                    },
                },
                default: "roll",
                close: () => {},
            });
            d.render(true);
        });
    }

    static async prepareToHitDialog({ actor = null, num = 1, type = 20, thb = 0, mod = 0, tn = null, label = "Roll To Hit" } = {}) {
        let htmlData = {
            num: num,
            type: type,
            mod: mod,
            thb: thb,
            tn: tn,
            label: label,
        };
        let htmlContent = await renderTemplate("systems/white-box-vtt/templates/components/roll-tohit-dialog.html", htmlData);
        return new Promise((resolve) => {
            let d = new Dialog({
                title: "TO HIT ROLL",
                content: htmlContent,
                buttons: {
                    roll: {
                        icon: "",
                        label: "Roll D20",
                        callback: (html) => {
                            let _tn = html.find(".tn").val();
                            let _thb = html.find(".thb").val();
                            let _mod = html.find(".mod").val();
                            let _label = html.find(".label").val();
                            game.whitebox.DiceRoller.rollToHit({ thb: _thb, mod: _mod, tn: _tn, label: _label });
                        },
                    },
                },
                default: "roll",
                close: () => {},
            });
            d.render(true);
        });
    }

    static async prepareRolld20({
        num = 1,
        type = 20,
        tn = null,
        tn_label = null,
        tn_show = false,
        bonus = null,
        bonus_label = null,
        bonus_show = false,
        mod = null,
        mod_label = null,
        mod_show = false,
        roll_above_show = false,
        roll_above = true,
        title = null,
        label = null,
        calc = false,
    } = {}) {
        let htmlData = {
            num: num,
            type: type,
            tn: tn,
            tn_label: tn_label,
            tn_show: tn_show,
            bonus: bonus,
            bonus_label: bonus_label,
            bonus_show: bonus_show,
            mod: mod,
            mod_label: mod_label,
            mod_show: mod_show,
            roll_above: roll_above,
            roll_above_show: roll_above_show,
            title: title,
            label: label,
            calc: calc,
        };
        let _htmlContent = await renderTemplate("systems/white-box-vtt/templates/components/roll-20-dialog.html", htmlData);
        return new Promise((resolve) => {
            let d = new Dialog({
                title: title,
                content: _htmlContent,
                buttons: {
                    roll: {
                        icon: "",
                        label: label,
                        callback: (html) => {
                            let _tn = html.find(".tn").val();
                            let _bonus = html.find(".bonus").val();
                            let _mod = html.find(".mod").val();
                            //let _label = html.find(".label").val();
                            game.whitebox.DiceRoller.rollD20({ tn: _tn, bonus: _bonus, mod: _mod, label: label, calc });
                        },
                    },
                },
                default: "roll",
                close: () => {},
            });
            d.render(true);
        });
    }
}
