function SearchResult({ result, onClick }) {
    return (
        <button
            onClick={onClick}
            className="w-full text-left px-4 py-3 hover:bg-gray-800/50 transition-colors rounded-lg"
        >
            <div className="flex flex-col">
                <span className="text-white font-medium">{result.page}</span>
                <span className="text-white/60 text-sm truncate">{result.preview}</span>
                <span className="text-white/40 text-xs">Line {result.lineNumber}</span>
            </div>
        </button>
    );
}

function SearchBar({ onSearch }) {
    const [isExpanded, setIsExpanded] = React.useState(false);
    const inputRef = React.useRef(null);

    const handleFocus = () => setIsExpanded(true);
    const handleBlur = () => {
        if (!inputRef.current.value) {
            setIsExpanded(false);
        }
    };

    return (
        <div className={`relative transition-all duration-300 ${
            isExpanded ? 'w-full' : 'w-48'
        }`}>
            <div className="field-wrapper">
                <input
                    ref={inputRef}
                    type="text"
                    placeholder="Search content..."
                    onChange={(e) => onSearch(e.target.value)}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    className="field w-full bg-white/10 backdrop-blur-sm text-white 
                        placeholder-white/50 px-4 py-2 rounded-lg border border-white/10 
                        focus:border-white/20 outline-none transition-all"
                />
                <svg 
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50"
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                >
                    <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth="2" 
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                    />
                </svg>
            </div>
        </div>
    );
}

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
    const [searchResults, setSearchResults] = React.useState([]);
    const [searchQuery, setSearchQuery] = React.useState('');

    const searchContent = (query) => {
        if (!query.trim()) {
            setSearchResults([]);
            return;
        }

        // Mock search results
        const results = [
            {
                page: 'Home',
                lineNumber: 12,
                preview: 'Every Keeper is born, endowed with attributes...'
            },
            {
                page: 'Instructions',
                lineNumber: 24,
                preview: 'Follow these steps to join our community...'
            }
        ].filter(result => 
            result.preview.toLowerCase().includes(query.toLowerCase()) ||
            result.page.toLowerCase().includes(query.toLowerCase())
        );

        setSearchResults(results);
        setSearchQuery(query);
    };

    const handleResultClick = (result) => {
        const element = document.getElementById(result.page.toLowerCase());
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className={`fixed top-0 right-0 h-screen w-80 bg-gray-900/95 backdrop-blur-lg 
            transform transition-transform duration-300 ease-in-out z-40 ${
            isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
            <div className="flex flex-col h-full pt-20 px-4 gap-6">
                <SearchBar onSearch={searchContent} />
                
                {searchQuery && (
                    <div className="space-y-4">
                        <div className="text-white/50 text-sm px-4">
                            {searchResults.length} results found
                        </div>
                        <div className="space-y-2">
                            {searchResults.map((result, index) => (
                                <SearchResult 
                                    key={index}
                                    result={result}
                                    onClick={() => handleResultClick(result)}
                                />
                            ))}
                        </div>
                    </div>
                )}

                <div className="mt-4">
                    <button 
                        onClick={() => window.location.href = '../CreditsPage/index.html'}
                        className="w-full text-white text-lg py-3 px-4 rounded-lg 
                            hover:bg-gray-800/50 transition-colors text-left"
                    >
                        Credits
                    </button>
                </div>
            </div>
        </div>
    );
}