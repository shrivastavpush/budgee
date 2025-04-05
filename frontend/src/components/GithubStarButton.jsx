import { useState, useEffect } from 'react';
import { FaGithub } from "react-icons/fa";

const GithubStarButton = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [isExiting, setIsExiting] = useState(false);

    const handleHide = () => {
        setIsExiting(true);
        setTimeout(() => {
            setIsVisible(false);
            setIsExiting(false);
        }, 500);
    };

    const handleClick = () => {
        handleHide();
        window.open('https://github.com/shrivastavpush/budgee', '_blank');
    };

    useEffect(() => {
        const showTimeout = setTimeout(() => {
            setIsVisible(true);

            const hideTimeout = setTimeout(() => {
                handleHide();
            }, 20000);

            return () => clearTimeout(hideTimeout);
        }, 2000);

        return () => clearTimeout(showTimeout);
    }, []);

    if (!isVisible) return null;

    return (
        <div
            className={`fixed z-50 top-4 left-4 bg-gradient-to-r from-teal-500 to-teal-300 text-white px-4 py-3 rounded-xl shadow-lg shadow-teal-500/20 transform transition-all duration-300 hover:shadow-xl hover:shadow-teal-500/30 hover:scale-105 cursor-pointer flex items-center gap-2 ${isExiting ? 'animate-slide-out-up' : 'animate-slide-in-down'} group sm:text-base text-sm border border-teal-400/20`}
            onClick={handleClick}
        >
            <FaGithub className="sm:text-xl text-lg transition-transform group-hover:rotate-12 duration-300" />
            <span className="font-medium whitespace-nowrap">
                <span className="sm:inline hidden">Liked this project?</span> Star on GitHub!
            </span>
        </div>
    );
};

export default GithubStarButton; 