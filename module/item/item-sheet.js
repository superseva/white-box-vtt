export class WhiteboxItemSheet extends ItemSheet {
    /** @override */
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ["whitebox", "sheet", "item"],
            width: 520,
            height: "auto",
            resizable: true,
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
        const data = super.getData();
        return data;
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
