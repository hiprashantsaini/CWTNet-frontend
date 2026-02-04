import { useEffect, useState } from 'react';
import './settings.css';

const Settings = () => {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

    useEffect(() => {
        document.body.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    return (
        <div className='settings-container'>
            <h2>Settings</h2>
            <div className='settings-item'>
                {/* <label>Dark Mode</label> */}
                <button className='theme-toggle-btn' onClick={toggleTheme}>
                    {theme === 'light' ? 'Enable Dark Mode' : 'Disable Dark Mode'}
                </button>
            </div>
        </div>
    );
};

export default Settings;
