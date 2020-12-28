/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
export class WhiteboxActorSheet extends ActorSheet {
    /** @override */
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ["whitebox", "sheet", "actor"],
            template: "systems/white-box-vtt/templates/actor/actor-sheet.html",
            width: 640,
            height: 640,
            tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-tabs-content", initial: "empty" }],
        });
    }

    /* -------------------------------------------- */

    /** @override */
    getData() {
        const data = super.getData();
        data.dtypes = ["String", "Number", "Boolean"];
        // for (let attr of Object.values(data.data.attributes)) {
        //     attr.isCheckbox = attr.dtype === "Boolean";
        // }

        // Prepare items.
        if (this.actor.data.type == "character") {
            this._prepareCharacterItems(data);
        }

        return data;
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

        // Initialize containers.
        const weapons = [];
        const weapons_equipped = [];
        const armor = [];
        const armor_equipped = [];
        const gear = [];
        const abilities = [];
        const spells = {
            0: [],
            1: [],
            2: [],
            3: [],
            4: [],
            5: [],
        };

        // Iterate through items, allocating to containers
        // let totalWeight = 0;
        for (let i of sheetData.items) {
            let item = i.data;
            i.img = i.img || DEFAULT_TOKEN;
            if (i.type === "weapon") {
                weapons.push(i);
                if (i.data.equipped) weapons_equipped.push(i);
            } else if (i.type === "armor") {
                armor.push(i);
                if (i.data.equipped) armor_equipped.push(i);
            } else if (i.type === "gear") {
                gear.push(i);
            } else if (i.type === "ability") {
                abilities.push(i);
            }
            // Append to spells.
            else if (i.type === "spell") {
                if (i.data.level != undefined) {
                    spells[i.data.level].push(i);
                }
            }
        }

        actorData.weapons = weapons;
        actorData.weapons_equipped = weapons_equipped;
        actorData.armor = armor;
        actorData.armor_equipped = armor_equipped;
        actorData.gear = gear;
        actorData.abilities = abilities;
        actorData.spells = spells;

        let actorSpells = { 1: { memorized: 0 }, 2: { memorized: 0 }, 3: { memorized: 0 }, 4: { memorized: 0 }, 5: { memorized: 0 } };
        // * CALULATING MEMORIZATION
        for (let l = 1; l <= 5; l++) {
            for (let i = 0; i < spells[l].length; i++) {
                actorSpells[l]["memorized"] += spells[l][i].data.memorized;
            }
        }
        actorData.actorSpells = actorSpells;
    }

    /*
     * --------------------------------------------
     */

    /** @override */
    activateListeners(html) {
        super.activateListeners(html);

        // Everything below here is only needed if the sheet is editable
        if (!this.options.editable) return;

        //Open Overlays (Inventory, Spellbook, Notes)
        html.find(".toggle-overlay").click(this._onToggleOverlay.bind(this));

        // Add Inventory Item
        html.find(".item-create").click(this._onItemCreate.bind(this));

        // Update Inventory Item
        html.find(".item-edit").click((ev) => {
            const li = $(ev.currentTarget).parents(".item");
            const item = this.actor.getOwnedItem(li.data("itemId"));
            item.sheet.render(true);
        });

        // Delete Inventory Item
        html.find(".item-delete").click((ev) => {
            const li = $(ev.currentTarget).parents(".item");
            this.actor.deleteOwnedItem(li.data("itemId"));
            li.slideUp(200, () => this.render(false));
        });

        //Toggle Equip Inventory Item
        html.find(".item-equip").click(async (ev) => {
            const li = $(ev.currentTarget).parents(".item");
            const item = this.actor.getOwnedItem(li.data("itemId"));
            await this.actor.updateOwnedItem(this._toggleEquipped(li.data("itemId"), item));
        });

        html.find(".memo-button").click(async (ev) => {
            const btn = $(ev.currentTarget);
            const li = $(ev.currentTarget).parents(".item");
            const item = this.actor.getOwnedItem(li.data("itemId"));
            let _memo = item.data.data.memorized;
            if (btn.data("operation") == "minus" && _memo > 0) _memo--;
            else if (btn.data("operation") == "plus") _memo++;
            else return;
            let obj = {
                _id: item._id,
                data: {
                    memorized: _memo,
                },
            };
            await this.actor.updateOwnedItem(obj);
        });

        /*
         * ---------------------------------------
         * Rollable Buttons
         * Die d6 & d20
         * Weapons
         * Abilities
         * ---------------------------------------
         */
        // html.find(".rollable").click(this._onRoll.bind(this));
        // * Custom D6
        html.find(".roll-die-d6").click(function () {
            game.whitebox.RollDialog.prepareDialog({ mod: 0, tn: 1, label: "Customn d6 Roll" });
        });
        // * Roll Ability
        html.find(".roll-ability").click((ev) => {
            const btn = $(ev.currentTarget);
            const li = $(ev.currentTarget).parents(".item");
            const item = this.actor.getOwnedItem(li.data("itemId"));
            const bonus = parseInt(item.data.data.bonus);
            //console.log(bonus);
            game.whitebox.RollDialog.prepareDialog({ mod: bonus, tn: 1, label: item.data.name });
        });

        // * -------------------------------------------
        // * ADD LEFT CLICK CONTENT MENU
        // * --------------------------------------------
        const editLabel = game.i18n.localize("WB.EDIT");
        const postLabel = game.i18n.localize("WB.POST");
        const deleteLabel = game.i18n.localize("WB.DELETE");

        let menu_items = [
            {
                icon: '<i class="fas fa-edit"></i>',
                name: "",
                callback: (t) => {
                    console.log(t);
                    //this._editOwnedItemById(t.data("item-id"));
                },
            },
            {
                icon: '<i class="fas fa-comment"></i>',
                name: "",
                callback: (t) => {
                    console.log(t);
                    //this._postOwnedItemById(t.data("item-id"));
                },
            },
            {
                icon: '<i class="fas fa-trash"></i>',
                name: "",
                callback: (t) => {
                    console.log(t);
                    //this._deleteOwnedItemById(t.data("item-id"));
                },
            },
        ];
        new ContextMenu(html.find(".editable-item"), null, menu_items);

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
    _onItemCreate(event) {
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
        return this.actor.createOwnedItem(itemData);
    }

    _onSpellMemo(evt) {
        evt.preventDefault();
        const element = event.currentTarget;
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
