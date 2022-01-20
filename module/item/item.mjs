import { WhiteBoxHelper } from "../whitebox.mjs";
export class WhiteboxItem extends Item {
    prepareData() {        
        super.prepareData();       
    }

    async _preCreate(data, options, user) {        
        await super._preCreate(data, options, user);
        let ico = WhiteBoxHelper.GetCreatedImage(data.type);
        this.data.update({ 'img': ico });
    }

    rollWeaponDamage() {        
        let formula = "";
        let actorOptions = null;
        if (this.actor.data.type == "character") {
            actorOptions = this.actor.getRollShortcuts();
            formula = `${this.data.data.damage.value} + ${this.data.data.bonus_damage}`;
            if (this.data.data.weapon_type == "melee" && game.settings.get("white-box-vtt", "addStrToDamage"))
                formula += `+ ${this.actor.data.data.attributes.str.bonus}`;
        } else {
            formula = `${this.data.data.damage.value}`;
        }
        let r = new Roll(formula, actorOptions);
        r.evaluate({async:false});
        let _flavor = `<h2>${r._total} damage dealt with ${this.data.name}</h2>`;
        r.toMessage({ flavor: _flavor });
    }

    /**
     * Send To Chat
     */
    async sendToChat() {
        //console.warn("SEND TO CHAT")
        const itemData = duplicate(this.data);
        // if (itemData.img.includes("/mystery-man")) {
        //     itemData.img = null;
        // }
        itemData.isWeapon = itemData.type === "weapon";
        itemData.isArmor = itemData.type === "armor";
        itemData.isGear = itemData.type === "gear";
        itemData.isAbility = itemData.type === "ability";
        itemData.isSpell = itemData.type === "spell";
        itemData.isMonsterAttack = itemData.type === "monster_attack";

        const html = await renderTemplate("systems/white-box-vtt/templates/components/chat-item.html", itemData);
        const chatData = {
            user: game.user._id,
            rollMode: game.settings.get("core", "rollMode"),
            content: html,
        };
        if (["gmroll", "blindroll"].includes(chatData.rollMode)) {
            chatData.whisper = ChatMessage.getWhisperIDs("GM");
        } else if (chatData.rollMode === "selfroll") {
            chatData.whisper = [game.user];
        }
        ChatMessage.create(chatData);
    }
}
