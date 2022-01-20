export class WhiteboxMonsterSheet extends ActorSheet {
    /** @override */
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ["whitebox", "sheet", "actor"],
            template: "systems/white-box-vtt/templates/actor/monster-sheet.html",
            width: 570,
            height: 640,
            tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-tabs-content", initial: "empty" }],
        });
    }

    /* -------------------------------------------- */

    /** @override */
    getData() {
        const context = super.getData();
        context.data = context.actor.data.data;
        context.flags = context.actor.data.flags;
        this._prepareCharacterItems(context);
        return context;
    }

    /**
     * Organize and classify Items for Character sheets.
     *
     * @param {Object} actorData The actor to prepare.
     *
     * @return {undefined}
     */
    _prepareCharacterItems(sheetData) {
        const actorData = sheetData.actor;

        const attacks = [];
        for (let i of sheetData.items) {
            let item = i.data;
            i.img = i.img || DEFAULT_TOKEN;
            if (i.type === "monster_attack") {
                attacks.push(i);
            }
        }
        actorData.attacks = attacks;
    }

    /*
     * --------------------------------------------
     */

    /** @override */
    activateListeners(html) {
        super.activateListeners(html);

        // Everything below here is only needed if the sheet is editable
        if (!this.options.editable) return;

        // Add Inventory Item
        html.find(".item-create").click(this._onItemCreate.bind(this));

        // Update Inventory Item
        html.find(".item-edit").click((ev) => {
            const li = $(ev.currentTarget).parents(".item");
            this._editOwnedItemById(li.data("itemId"));           
        });

        // Delete Inventory Item
        html.find(".item-delete").click(async (ev) => {
            const li = $(ev.currentTarget).parents(".item");            
            await this._deleteOwnedItemById(li.data("itemId"))
            li.slideUp(200, () => this.render(false));
        });

        // * Roll Saving Throw
        html.find(".roll-saving-throw").click((ev) => {
            const el = $(ev.currentTarget);
            let st_value = this.actor.data.data.saving_throw.value;
            //console.warn(st_value);
            game.whitebox.RollDialog.prepareRolld20({
                title: `Saving Throw`,
                label: `Saving Throw`,
                mod_show: true,
                mod_label: "Custom Modifier: ",
                tn: st_value,
                tn_label: `Saving Throw: `,
                tn_show: true,
                calc: true,
            });
        });

        // * Roll To Hit
        html.find(".roll-to-hit").click((ev) => {
            const btn = $(ev.currentTarget);
            const li = $(ev.currentTarget).parents(".item");
            //const item = this.actor.getOwnedItem(li.data("itemId"));
            const item = this.actor.items.get(li.data("itemId"));
            let bonus = parseInt(this.actor.data.data.thb.value);
            game.whitebox.RollDialog.prepareToHitDialog({ tn: null, thb: bonus, mod: 0, label: `Attack with the ${item.name}` });
        });

        // * Roll Weapon Damage
        html.find(".rollable.roll-weapon-damage").click((ev) => {
            const li = $(ev.currentTarget).parents(".item");
            //const item = this.actor.getOwnedItem(li.data("itemId"));
            const item = this.actor.items.get(li.data("itemId"));
            item.rollWeaponDamage();
        });

        // * Roll Morale
        html.find(".roll-morale").click((ev) => {
            const _morale = this.actor.data.data.morale;
            game.whitebox.RollDialog.prepareDialog({ num: 2, tn: _morale, label: "Morale Roll", title: "Morale Roll", visible: false });
        });

        // * Post titem to chat
        html.find(".chaty").click(this._onItemSendToChat.bind(this));

        // * -------------------------------------------
        // * ADD LEFT CLICK CONTENT MENU
        // * --------------------------------------------
        const editLabel = game.i18n.localize("WB.EDIT");
        const postLabel = game.i18n.localize("WB.POST");
        const deleteLabel = game.i18n.localize("WB.DELETE");

        // let menu_items = [
        //     {
        //         icon: '<i class="fas fa-edit"></i>',
        //         name: "",
        //         callback: (t) => {
        //             console.log(t);
        //             this._editOwnedItemById(t.data("item-id"));
        //         },
        //     },
        //     {
        //         icon: '<i class="fas fa-comment"></i>',
        //         name: "",
        //         callback: (t) => {
        //             console.log(t);
        //             this._postOwnedItemById(t.data("item-id"));
        //         },
        //     },
        //     {
        //         icon: '<i class="fas fa-trash"></i>',
        //         name: "",
        //         callback: (t) => {
        //             console.log(t);
        //             this._deleteOwnedItemById(t.data("item-id"));
        //         },
        //     },
        // ];
        // new ContextMenu(html.find(".editable-item"), null, menu_items);

        // Drag events for macros.
        if (this.actor.owner) {
            let handler = (ev) => this._onDragItemStart(ev);
            html.find("li.item").each((i, li) => {
                if (li.classList.contains("inventory-header")) return;
                li.setAttribute("draggable", true);
                li.addEventListener("dragstart", handler, false);
            });
        }
    }

    _editOwnedItemById(_itemId) {
        const item = this.actor.items.get(_itemId);
        item.sheet.render(true);
    }
    async _deleteOwnedItemById(_itemId) {
        const item = this.actor.items.get(_itemId);
        await item.delete();
    }

    _onToggleOverlay(evt) {
        evt.preventDefault();
        const el = evt.currentTarget;
        const overlay = el.dataset.overlay;
        this._tabs[0].activate(overlay);
    }

    /**
     * Handle creating a new Owned Item for the actor using initial data defined in the HTML dataset
     * @param {Event} event   The originating click event
     * @private
     */
    async _onItemCreate(event) {
        event.preventDefault();
        const header = event.currentTarget;
        const type = header.dataset.type;
        const data = duplicate(header.dataset);
        const name = `New ${type.capitalize()}`;
        const itemData = {
            name: name,
            type: type,
            data: data,
        };
        delete itemData.data["type"];
        return await Item.create(itemData, { parent: this.actor });
    }

    _onItemSendToChat(evt) {
        evt.preventDefault();
        const itemId = $(evt.currentTarget).data("item-id");
        this._postOwnedItemById(itemId);
    }
    _postOwnedItemById(_item_id) {
        const item = this.actor.items.get(_item_id);
        item.sendToChat();
    }

    //Toggle Equipment
    _toggleEquipped(id, item) {
        return {
            _id: id,
            data: {
                equipped: !item.data.data.equipped,
            },
        };
    }

    /**
     * Handle clickable rolls.
     * @param {Event} event   The originating click event
     * @private
     */
    /*_onRoll(event) {
        event.preventDefault();
        const element = event.currentTarget;
        const dataset = element.dataset;

        if (dataset.roll) {
            let roll = new Roll(dataset.roll, this.actor.data.data);
            let label = dataset.label ? `Rolling ${dataset.label}` : "";
            roll.roll().toMessage({
                speaker: ChatMessage.getSpeaker({ actor: this.actor }),
                flavor: label,
            });
        }
    }*/
}
