import { moduleId, localizationID } from './const.js';

// dnd5e v4+ ApplicationV2 character sheet — html is a plain HTMLElement
export function addTogglePartyButtonV2(html, actor)
{
    const enableTitle = game.i18n.localize(`${localizationID}.enable-item-title`);
    const disableTitle = game.i18n.localize(`${localizationID}.disable-item-title`);

    const itemEls = html.querySelectorAll('[data-item-id]');

    // Selector covers the primary dnd5e v4/v5 sheet item-control edit button patterns
    itemEls.forEach(itemEl =>
    {
        const currentItemId = itemEl.dataset.itemId;
        const currentItem = actor.items.get(currentItemId);
        if (!currentItem) return;

        const isInPartyInventory = currentItem.getFlag(moduleId, 'inPartyInventory');
        const title = isInPartyInventory ? disableTitle : enableTitle;
        const activeClass = isInPartyInventory ? 'active' : '';

        // If already injected, just sync the active state and title rather than duplicating
        const existing = itemEl.querySelector('.party-inventory-module.item-toggle');
        if (existing)
        {
            existing.title = title;
            existing.classList.toggle('active', !!isInPartyInventory);
            return;
        }

        // Find any existing edit control to insert after
        const editControl = itemEl.querySelector('[data-action="edit"], [data-action="editDocument"], .item-control.item-edit');
        // For Tidy 5e table rows, fall back to the actions cell (match by data attr or class)
        const tidyActionsCell = editControl ? null : itemEl.querySelector('[data-tidy-column-key="actions"], .tidy-table-actions');

        if (!editControl && !tidyActionsCell) return;

        const btn = document.createElement('a');
        btn.title = title;
        btn.innerHTML = '<i class="fas fa-users"></i>';
        // Read fresh flag state at click time to avoid stale closure issues
        btn.addEventListener('click', (e) =>
        {
            e.preventDefault();
            e.stopPropagation();
            const item = actor.items.get(currentItemId);
            if (!item) return;
            const current = item.getFlag(moduleId, 'inPartyInventory');
            item.setFlag(moduleId, 'inPartyInventory', !current).then(() =>
            {
                game.modules.get(moduleId).api.openWindow();
            });
        });

        if (editControl)
        {
            btn.className = `item-control party-inventory-module item-toggle ${activeClass}`;
            editControl.insertAdjacentElement('afterend', btn);
        }
        else
        {
            btn.className = `tidy-table-button party-inventory-module item-toggle ${activeClass}`;
            const contextMenuBtn = tidyActionsCell.querySelector('[data-action="showContextMenu"]');
            if (contextMenuBtn)
                tidyActionsCell.insertBefore(btn, contextMenuBtn);
            else
                tidyActionsCell.appendChild(btn);
        }
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
