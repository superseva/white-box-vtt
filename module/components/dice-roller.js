export class DiceRoller {
    static roll({ num = 1, type = 6, mod = 0, base = 0, base_label = "", tn = 1, visible = true, label = "Custom Roll" } = {}) {
        // * evaluate success
        //console.warn(base, mod, tn);
        let formula = `${num}d${type}`;
        let r = new Roll(formula);
        r.evaluate({async:false});
        let _success = "";
        //console.warn(`X in 6 success. Roll: ${r._total} TN:${parseInt(tn) + parseInt(mod)}`);
        if (r._total <= parseInt(tn) + parseInt(mod)) _success = "Success";
        else _success = "Failure";

        let _flavor = `<h2>${label}</h2>
        <p style='font-size:22px'>${_success}</p>`;
        if (num == 1) _flavor += `<p style='font-size:18px'>Chance: ${parseInt(tn) + parseInt(mod)} in 6</p>`;
        else _flavor += `<p style='font-size:18px'>${parseInt(r._total)} vs ${parseInt(tn)}</p>`;
        //<p><span style='font-size:16px'>${r._total} <= ${parseInt(tn) + parseInt(mod)}</span> (TN:${parseInt(tn)} + MOD:${parseInt(mod)})</p>
        let _rollMode = visible ? CONST.DICE_ROLL_MODES.PUBLIC : CONST.DICE_ROLL_MODES.BLIND;
        r.toMessage({ flavor: _flavor }, { rollMode: _rollMode });
        //console.log(r.results[0]);
        //console.log(r.terms[0].results[0].result);
        //return r.results[0];
        return r;
    }

    static rollToHit({ num = 1, type = 20, tn = null, thb = 0, mod = 0, label = "To Hit Roll" } = {}) {
        let formula = `${num}d${type} + ${thb} + ${mod}`;
        let r = new Roll(formula);
        r.evaluate({async:false});
        let _flavor = `<h2>${label}</h2>`;

        r.toMessage({ flavor: _flavor });
    }

    static rollD20({
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
        roll_above = true,
        roll_above_show = false,
        title = null,
        label = null,
        calc = false,
    } = {}) {
        let formula = `${num}d${type}`;
        // * if roll_above add bonus and mod to the roll
        if (roll_above && bonus) formula += `+ ${bonus}`;
        if (roll_above && mod) formula += `+ ${mod}`;
        let r = new Roll(formula);
        r.evaluate({async:false});
        let _flavor = ``;

        if (calc) {
            if (roll_above && tn) {
                let _success = "";
                if (r.total >= tn) _success = "Success";
                else _success = "Failure";
                _flavor += `<h2>${label}</h2><p style='font-size:22px'>${_success}</p><p style='font-size:18px'>${parseInt(r.total)} vs ${parseInt(tn)}</p>`;
            }
        }
        r.toMessage({ flavor: _flavor });
    }
}
