export class DiceRoller {
    static roll({ num = 1, type = 6, mod = 0, base = 0, base_label = "", tn = 1, visible = true, label = "Custom Roll" } = {}) {
        // * evaluate success
        //console.warn(base, mod, tn);
        let formula = `${num}d${type}`;
        let r = new Roll(formula);
        r.evaluate();
        let _success = "";
        //console.warn(`X in 6 success. Roll: ${r._total} TN:${parseInt(tn) + parseInt(mod)}`);
        if (r._total <= parseInt(tn) + parseInt(mod)) _success = "Success";
        else _success = "Failure";

        let _flavor = `<h2>${label}</h2>
        <p style='font-size:22px'>${_success}</p>
        <p style='font-size:18px'>Chance: ${parseInt(tn) + parseInt(mod)} in 6</p>
        `;
        //<p><span style='font-size:16px'>${r._total} <= ${parseInt(tn) + parseInt(mod)}</span> (TN:${parseInt(tn)} + MOD:${parseInt(mod)})</p>
        let _rollMode = visible ? CONST.DICE_ROLL_MODES.PUBLIC : CONST.DICE_ROLL_MODES.SELF;
        r.toMessage({ flavor: _flavor }, { rollMode: _rollMode });
        //console.log(r.results[0]);
        //console.log(r.terms[0].results[0].result);
        //return r.results[0];
        return r;
    }

    static rollToHit({ num = 1, type = 20, tn = null, thb = 0, mod = 0, label = "To Hit Roll" } = {}) {
        let formula = `${num}d${type} + ${thb} + ${mod}`;
        let r = new Roll(formula);
        r.evaluate();
        r.toMessage();
    }
}
