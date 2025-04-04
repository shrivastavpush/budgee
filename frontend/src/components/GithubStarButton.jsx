import { useState, useEffect } from 'react';
import { FaGithub } from "react-icons/fa";

const GithubStarButton = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const showTimeout = setTimeout(() => {
            setIsVisible(true);

            const hideTimeout = setTimeout(() => {
                setIsVisible(false);
            }, 20000);

            return () => clearTimeout(hideTimeout);
        }, 1000);

        return () => clearTimeout(showTimeout);
    }, []);

    if (!isVisible) return null;

    return (
        <div className=" fixed z-50 sm:bottom-8 sm:right-8 bottom-4 right-4 bg-gradient-to-r from-teal-500 to-teal-400 text-white sm:px-6 sm:py-3.5 px-4 py-3 rounded-xl shadow-lg shadow-teal-500/20 transform transition-all duration-300 hover:shadow-xl hover:shadow-teal-500/30 cursor-pointer flex items-center sm:gap-3 gap-2 animate-slide-in-up group sm:text-base text-sm border border-teal-400/20 "
            onClick={() => window.open('https://github.com/shrivastavpush/budgee', '_blank')}
        >
            <FaGithub className="sm:text-xl text-lg transition-transform group-hover:rotate-12 duration-300" />
            <span className="font-medium whitespace-nowrap">
                <span className="sm:inline hidden">Liked this project?</span> Star on GitHub!
            </span>
        </div>
    );
};

export default GithubStarButton; 