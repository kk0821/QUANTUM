export function useSetInitialSelect(list, id, selectedItem) {
    if (!list || !list.length || !selectedItem) {
        return;
    }
    for (const [index, item] of Object.entries(list)) {
        if ((item.id === id) || (item === id)) {
            selectedItem.value = list[index]
        }
    }
    if ((!selectedItem.value) && (!selectedItem.value.id)) {
        useSetFirstElement(list, selectedItem)
    }
}

export function useSetFirstElement(list, selectedItem) {
    if ((list[0] && list[0].id) || (list)) {
        selectedItem.value = list[0]
    }
}
