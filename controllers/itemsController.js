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
        page = parseInt(page);
        limit = parseInt(limit);

        if (isNaN(page) || isNaN(limit) || page < 1) {
            return res.status(400).json({ error: 'page и limit должны быть положительными числами' });
        }

        let list = Array.isArray(currentList) && currentList.length > 0 ? currentList : originalList;

        if (search.trim()) {
            const query = search.trim();
            list = list.filter((num) => num.toString().includes(query));
        }

        const total = list.length;
        const totalPages = Math.ceil(total / limit);
        const offset = (page - 1) * limit;
        const result = list.slice(offset, offset + limit);

        res.json({
            items: result,
            total,
            currentPage: page,
            totalPages,
            selected: [...selectedItems],
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export function postSelect(req, res) {
    try {
        const { selected } = req.body;
        if (!Array.isArray(selected) || !selected.every(Number.isInteger)) {
            return res.status(400).json({ error: 'selected должен быть массивом чисел' });
        }
        setSelectedItems(selected);
        res.sendStatus(200);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export function postSort(req, res) {
    try {
        const { sorted } = req.body;
        if (!Array.isArray(sorted) || !sorted.every(Number.isInteger)) {
            return res.status(400).json({ error: 'sorted должен быть массивом чисел' });
        }
        const sortedSet = new Set(sorted);
        const rest = originalList.filter(item => !sortedSet.has(item));
        const newList = [...sorted, ...rest];
        setCurrentList(newList);
        res.sendStatus(200);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
