import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import './App.css';

const BASE_URL = '/api';

function App() {
    const [items, setItems] = useState([]);
    const [selected, setSelected] = useState([]);
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const isFetching = useRef(false);

    useEffect(() => {
        fetchItems(1, search, true);
    }, [search]);

    useEffect(() => {
        const onScroll = () => {
            const bottomReached = window.innerHeight + window.scrollY >= document.body.offsetHeight - 50;
            if (bottomReached && currentPage < totalPages && !isFetching.current) {
                fetchItems(currentPage + 1, search);
            }
        };
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, [currentPage, totalPages, search]);

    const fetchItems = async (page = 1, searchValue = '', reset = false) => {
        isFetching.current = true;

        try {
            const res = await axios.get(`${BASE_URL}/items`, {
                params: {
                    page,
                    limit: 20,
                    search: searchValue,
                },
            });

            setItems(prev => reset ? res.data.items : [...prev, ...res.data.items]);
            setSelected(res.data.selected);
            setCurrentPage(res.data.currentPage);
            setTotalPages(res.data.totalPages);
        } catch (err) {
            console.error(err);
        }

        isFetching.current = false;
    };

    const toggleSelection = async (num) => {
        const updated = selected.includes(num)
            ? selected.filter((n) => n !== num)
            : [...selected, num];

        setSelected(updated);

        try {
            await axios.post(`${BASE_URL}/select`, { selected: updated });
        } catch (err) {
            console.error(err);
        }
    };

    const handleSearchChange = (e) => {
        const value = e.target.value.replace(/\D/g, '');
        setSearch(value);
        setCurrentPage(1);
    };

    const handleDragStart = (e, draggedItem) => {
        const index = items.findIndex((item) => item === draggedItem);
        e.dataTransfer.setData('dragIndex', index);
    };

    const handleDrop = async (e, dropItem) => {
        e.preventDefault();

        const dragIndex = parseInt(e.dataTransfer.getData('dragIndex'));
        const dropIndex = items.findIndex((item) => item === dropItem);

        if (dragIndex === -1 || dropIndex === -1) return;

        const updated = [...items];
        const [movedItem] = updated.splice(dragIndex, 1);
        updated.splice(dropIndex, 0, movedItem);

        setItems(updated);

        try {
            await axios.post(`${BASE_URL}/sort`, { sorted: updated });
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="container">
            <h1>Список чисел</h1>
            <input
                className="input"
                type="text"
                placeholder="Поиск по числам"
                value={search}
                onChange={handleSearchChange}
            />
            <ul>
                {items.map((num) => (
                    <li
                        key={num}
                        draggable
                        onDragStart={(e) => handleDragStart(e, num)}
                        onDrop={(e) => handleDrop(e, num)}
                        onDragOver={(e) => e.preventDefault()}
                    >
                            <input
                                className="checkbox"
                                type="checkbox"
                                checked={selected.includes(num)}
                                onChange={() => toggleSelection(num)}
                            />
                            {num}
                    </li>
                ))}
            </ul>
            {currentPage < totalPages && (
                <p>...</p>
            )}
        </div>
    );
}

export default App;
