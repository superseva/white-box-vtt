export class WhiteboxItemSheet extends ItemSheet {
    /** @override */
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ["whitebox", "sheet", "item"],
            width: 520,
            height: "auto",
            resizable: false,
            tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".item-body", initial: "attributes" }],
        });
    }

    /** @override */
    get template() {
        const path = "systems/white-box-vtt/templates/item";
        return `${path}/item-${this.item.data.type}-sheet.html`;
    }

    /* -------------------------------------------- */

    /** @override */
    getData() {
        const context = super.getData();
        const itemData = context.item.data;        
        context.data = itemData.data;
        context.flags = itemData.flags;
        return context;
    }

    /* -------------------------------------------- */

    /** @override */
    setPosition(options = {}) {
        const position = super.setPosition(options);
        const sheetBody = this.element.find(".item-body");
        const bodyHeight = position.height - 192;
        //sheetBody.css("height", bodyHeight);
        //sheetBody.css("overflow-y", "scroll");
        return position;
    }

    /* -------------------------------------------- */

    /** @override */
    activateListeners(html) {
        super.activateListeners(html);
    }
}
