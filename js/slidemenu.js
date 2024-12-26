function HamburgerMenu({ isOpen, toggleMenu }) {
    return (
        <button 
            onClick={toggleMenu}
            className="fixed top-4 right-4 w-10 h-10 flex flex-col justify-center items-center z-50 focus:outline-none"
        >
            <span className={`w-6 h-0.5 bg-white rounded-full transition-all duration-300 ${
                isOpen ? 'rotate-45 translate-y-1' : '-translate-y-1'
            }`} />
            <span className={`w-6 h-0.5 bg-white rounded-full transition-all duration-300 ${
                isOpen ? 'opacity-0' : 'opacity-100'
            }`} />
            <span className={`w-6 h-0.5 bg-white rounded-full transition-all duration-300 ${
                isOpen ? '-rotate-45 -translate-y-1' : 'translate-y-1'
            }`} />
        </button>
    );
}

function Dropdown({ isOpen }) {
    const navigate = (path) => {
        window.location.href = path;
    };

    return (
        <div className={`fixed top-0 right-0 h-screen w-64 bg-gray-900/95 backdrop-blur-lg transform transition-transform duration-300 ease-in-out z-40 ${
            isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
            <div className="flex flex-col pt-20 px-4">
                <button 
                    onClick={() => navigate('../CreditsPage/index.html')}
                    className="text-white text-lg py-3 px-4 rounded-lg hover:bg-gray-800/50 transition-colors"
                >
                    Credits
                </button>
                {/* Add more menu items here as needed */}
            </div>
        </div>
    );
}