import { DiceRoller } from "./dice-roller.js";
export class RollDialog {
    static async prepareDialog({
        actor = null,
        num = 1,
        type = 6,
        base = null,
        base_label = null,
        mod = null,
        tn = null,
        visible = true,
        label = "Custom Roll",
    } = {}) {
        let htmlData = {
            num: num,
            type: type,
            base: base,
            base_label: base_label,
            mod: mod,
            tn: tn,
            visible: visible,
            label: label,
        };
        let htmlContent = await renderTemplate("systems/white-box-vtt/templates/components/roll-dialog.html", htmlData);
        return new Promise((resolve) => {
            let d = new Dialog({
                title: "D6 ROLL",
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
                            game.whitebox.DiceRoller.roll({ num: 1, type: 6, base: _base, mod: _mod, visible: _visible, tn: _tn, label: _label });
                        },
                    },
                },
                default: "roll",
                close: () => {},
            });
            d.render(true);
        });
    }

    static async prepareToHitDialog({ actor = null, num = 1, type = 20, thb = 0, mod = 0, tn = null, label = "To Hit AC" } = {}) {
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
}
