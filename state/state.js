export const originalList = Array.from({ length: 1_000_000 }, (_, i) => i + 1);
export let currentList = [...originalList];
export let selectedItems = new Set();

export function setCurrentList(newList) {
    currentList = newList;
}

export function setSelectedItems(newSelected) {
    selectedItems = new Set(newSelected);
}
