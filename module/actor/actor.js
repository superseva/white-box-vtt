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
        for (let [key, attribute] of Object.entries(data.attributes)) {
            attribute.mod = Math.floor((attribute.value - 10) / 2);
        }
    }
}
