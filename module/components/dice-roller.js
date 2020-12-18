export class DiceRoller {
    static rollXin6({ num = 1, type = 6, chance = 1, visible = true } = {}) {
        let r = new Roll(`${num}d${type}cs<=${chance}`);
        r.evaluate();
        //console.log(r.results[0]);
        //console.log(r.terms[0].results[0].result);
        return r.results[0];
    }
}
