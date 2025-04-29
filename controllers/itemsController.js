import {
    originalList,
    currentList,
    selectedItems,
    setCurrentList,
    setSelectedItems,
} from '../state/state.js';

export function getItems(req, res) {
    try {
        let { search = '', page = 1, limit = 20 } = req.query;
        page  = parseInt(page,  10);
        limit = parseInt(limit, 10);

        if (isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
            return res.status(400).json({ error: 'page и limit должны быть положительными числами' });
        }
        const base =
            Array.isArray(currentList) && currentList.length > 0
                ? currentList
                : [...originalList].sort((a, b) => a - b);
        const list = search.trim()
            ? base
                .filter((n) => n.toString().includes(search.trim()))
                .sort((a, b) => a - b)
            : base;
        const total       = list.length;
        const totalPages  = Math.ceil(total / limit);
        const offset      = (page - 1) * limit;
        const resultSlice = list.slice(offset, offset + limit);

        res.json({
            items: resultSlice,
            total,
            currentPage: page,
            totalPages,
            selected: [...selectedItems],
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}


export function postSelect(req, res) {
    try {
        const { selected } = req.body;
        if (!Array.isArray(selected) || !selected.every(Number.isInteger)) {
            return res
                .status(400)
                .json({ error: 'selected должен быть массивом чисел' });
        }
        setSelectedItems(selected);
        res.sendStatus(200);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export function postSort(req, res) {
    try {
        const { dragged, droppedOn } = req.body;
        if (![dragged, droppedOn].every(Number.isInteger)) {
            return res.status(400).json({ error: '`dragged` и `droppedOn` должны быть числами' });
        }
        const baseList =
            Array.isArray(currentList) && currentList.length > 0
                ? [...currentList]
                : [...originalList];

        const fromIndex = baseList.indexOf(dragged);
        const toIndex   = baseList.indexOf(droppedOn);

        if (fromIndex === -1 || toIndex === -1) {
            return res.status(404).json({ error: 'элемент не найден в списке' });
        }
        baseList.splice(fromIndex, 1);
        baseList.splice(toIndex, 0, dragged);
        setCurrentList(baseList);
        res.sendStatus(200);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

