import { moduleId, localizationID } from './const.js';

// dnd5e v4+ ApplicationV2 character sheet — html is a plain HTMLElement
export function addTogglePartyButtonV2(html, actor)
{
    const enableTitle = game.i18n.localize(`${localizationID}.enable-item-title`);
    const disableTitle = game.i18n.localize(`${localizationID}.disable-item-title`);

    // Selector covers the primary dnd5e v4/v5 sheet item-control edit button patterns
    html.querySelectorAll('[data-item-id]').forEach(itemEl =>
    {
        const currentItemId = itemEl.dataset.itemId;
        const currentItem = actor.items.get(currentItemId);
        if (!currentItem) return;

        const isInPartyInventory = currentItem.getFlag(moduleId, 'inPartyInventory');
        const title = isInPartyInventory ? disableTitle : enableTitle;
        const activeClass = isInPartyInventory ? 'active' : '';

        // Find any existing edit control to insert after; fall back to appending into the item row
        const editControl = itemEl.querySelector('[data-action="edit"], .item-control.item-edit');
        if (!editControl) return;

        const btn = document.createElement('a');
        btn.className = `item-control party-inventory-module item-toggle ${activeClass}`;
        btn.title = title;
        btn.innerHTML = '<i class="fas fa-users"></i>';
        btn.addEventListener('click', (e) =>
        {
            e.preventDefault();
            currentItem.setFlag(moduleId, 'inPartyInventory', !isInPartyInventory);
        });
        editControl.insertAdjacentElement('afterend', btn);
    });
}

export function addTogglePartyButton(html, actor)
{
    const enableTitle = game.i18n.localize(`${localizationID}.enable-item-title`);
    const disableTitle = game.i18n.localize(`${localizationID}.disable-item-title`);

    html.find(".inventory ol:not(.currency-list)  .item-control.item-edit").each(function ()
    {
        const currentItemId = this.closest(".item").dataset.itemId;
        const currentItem = actor.items.find(item => item.id === currentItemId);
        const isInPartyInventory = currentItem.getFlag(moduleId, 'inPartyInventory');

        const title = isInPartyInventory ? disableTitle : enableTitle;
        const active = isInPartyInventory ? 'active' : '';

        $(`
            <a class="item-control party-inventory-module item-toggle ${active}" title="${title}">
            <i class="fas fa-users"></i>
            </a>
        `).insertAfter(this);

        $(this.nextElementSibling).on('click', function ()
        {
            currentItem.setFlag(moduleId, 'inPartyInventory', !isInPartyInventory);
        });
    });
}

export function addTogglePartyButtonTidy(html, actor)
{
    const enableTitle = game.i18n.localize(`${localizationID}.enable-item-title`);
    const disableTitle = game.i18n.localize(`${localizationID}.disable-item-title`);

    const title = enableTitle;

    html.find(".inventory .item-control.item-edit").each(function ()
    {
        const currentItemId = this.closest(".item").dataset.itemId;
        const currentItem = actor.items.find(item => item.id === currentItemId);
        const isInPartyInventory = currentItem.getFlag(moduleId, 'inPartyInventory');

        const title = isInPartyInventory ? disableTitle : enableTitle;
        const active = isInPartyInventory ? 'active' : '';

        $(`
            <a class="item-control party-inventory-module" title="${title}">
                <i class="fas fa-users"></i>
                <span class="control-label">${title}</span>
            </a>
        `).insertAfter(this);

        $(this.nextElementSibling).on('click', function ()
        {
            currentItem.setFlag(moduleId, 'inPartyInventory', !isInPartyInventory);
        });
    });
}

export function addGroupInventoryIndicatorTidy(html, actor)
{
    const title = game.i18n.localize(`${localizationID}.is-in-party-inventory`);

    html.find(".inventory .item .item-name").each(function ()
    {
        const currentItemId = this.closest(".item").dataset.itemId;
        const currentItem = actor.items.find(item => item.id === currentItemId);
        const isInPartyInventory = currentItem.getFlag(moduleId, 'inPartyInventory');

        if (isInPartyInventory)
        {
            $(`
                <div class="item-state-icon" title="${title}">
                    <i class="fas fa-users"></i>
                </div>
            `).insertAfter(this);
        }
    });
}
