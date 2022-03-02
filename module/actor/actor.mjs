/**
 * Extend the base Actor entity by defining a custom roll data structure which is ideal for the Simple system.
 * @extends {Actor}
 */
export class WhiteboxActor extends Actor {
    /**
     * Augment the basic actor data with additional dynamic data.
     */
    prepareData() {
        super.prepareData();
        const actorData = this.data;       
        const data = actorData.data;
        const flags = actorData.flags;
        if (actorData.type === "character") this._prepareCharacterData(actorData);
      
    }

    /**
     * Prepare Character type specific data
     */
    _prepareCharacterData(actorData) {
        const data = actorData.data;
        // Loop through ability scores, and add their modifiers to our sheet output.
        // $$ AUTO CALC ATTRIBUTE MODIFIER
        /* const lowerVal = 6;
        const uperVal = 15;
        for (let [key, attribute] of Object.entries(data.attributes)) {
            if (attribute.value <= lowerVal) attribute.bonus = -1;
            else if (attribute.value >= uperVal) attribute.bonus = 1;
            else attribute.bonus = 0;
        }*/

        // * CALC AC
        let equippedArmor = Array.from(actorData.items).find((i) => i.type == "armor" && i.data.data.armor_type == "armor" && i.data.data.equipped);
        let equippedShield = Array.from(actorData.items).find((i) => i.type == "armor" && i.data.data.armor_type == "shield" && i.data.data.equipped);
        let wornArmorAC = 10;
        if (equippedArmor) wornArmorAC += parseInt(equippedArmor.data.data.ac.value);
        if (equippedShield) wornArmorAC += parseInt(equippedShield.data.data.ac.value);
        if (game.settings.get("white-box-vtt", "addDexToAC")) wornArmorAC += parseInt(data.attributes.dex.bonus);
        data.ac.value = wornArmorAC;

        // Movement is under armor weight value now
        data.movement.value = equippedArmor?.data?.data?.weight!=undefined?equippedArmor?.data?.data?.weight : 12;

        // ! override if overburdened
        if(actorData.data.overburdened)
            data.movement.value = 3;

        // * CALC LOAD & MOVEMENT    

        /*let load = 0;
        //const maxLoad = data.attributes.con.value;
        const maxLoad = 10
        Array.from(actorData.items).forEach(i => {
            console.warn(i.data.type, i.data.type!='armor')
           if(i.data.data.weight)
                load += i.data.type=="armor" ? 0 : parseFloat(i.data.data.weight);
        });
        let overload = Math.min(0, Math.floor(maxLoad-load)*3);      
        let movement = 12;
        movement += overload;
        data.movement.value = Math.max(0,movement);*/

        // HIDE LOYALTY
        data.loyalty.visible = false;
    }

    getRollShortcuts() {
        let out = {};
        // Attributes
        const attr = this.data.data.attributes;
        for (const name of ["str", "dex", "con", "int", "wis", "cha"]) {
            out[name.substring(0, 3)] = attr[name].bonus;
        }
        //console.warn(out);
        return out;
    }
}
