export class WhiteboxItem extends Item {
    prepareData() {
        super.prepareData();

        // Get the Item's data
        const itemData = this.data;
        const actorData = this.actor ? this.actor.data : {};
        const data = itemData.data;
    }

    rollWeaponDamage() {
        console.warn(this.data.data.damage);
        let formula = `${this.data.data.damage.value} + ${this.data.data.bonus_damage}`;
        let actorOptions = null;
        if (this.actor) {
            actorOptions = this.actor.getRollShortcuts();
            //const damage_mod = this.actor.data.data.damage_modifier[this.data.data.damage.type].value;
            //formula = `${formula} + ${damage_mod}`;
        }
        let r = new Roll(formula, actorOptions);
        let _flavor = `<h2>Damage delt with the ${this.data.name}</h2>`;
        r.roll().toMessage({ flavor: _flavor });
    }

    /**
     * Send To Chat
     */
    async sendToChat() {
        const itemData = duplicate(this.data);
        if (itemData.img.includes("/mystery-man")) {
            itemData.img = null;
        }
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
