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
                title: label,
                content: htmlContent,
                buttons: {
                    roll: {
                        icon: '<i class="fas fa-check"></i>',
                        label: "Roll D6",
                        callback: (html) => {
                            //game.whitebox.DiceRoller.roll({num:1, type:6, base:base, mod:mod, tn:1, visible:visible, label:label});
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
}
