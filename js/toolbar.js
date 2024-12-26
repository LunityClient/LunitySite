function App() {
    const [currentTool, setCurrentTool] = React.useState('home');
    const [prevTool, setPrevTool] = React.useState('home');
    const [isScrolling, setIsScrolling] = React.useState(false);
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const highlightRef = React.useRef(null);
    const observerRef = React.useRef(null);
    const scrollTimeout = React.useRef(null);
    
    const sections = [
        {
            id: 'home',
            label: 'Home',
            title: 'Home',
            content: 'Every Keeper is born, endowed with attributes from a collection of over 400 meticulously hand-painted assets.',
            color: 'bg-indigo-500',
            layout: 'wideLeft'
        },
        {
            id: 'instructions',
            label: 'Instructions',
            title: 'INSTRUCTIONS FOR THE FUTURE',
            content: 'Follow these steps to join our community and become part of the next generation.',
            color: 'bg-indigo-600',
            layout: 'centered'
        },
        {
            id: 'download',
            label: 'Download',
            title: 'GET STARTED NOW',
            content: 'Download our latest release and begin your journey.',
            color: 'bg-indigo-700',
            layout: 'wideRight'
        }
    ];

    const tools = sections.map(({ id, label }) => ({ id, label }));

    React.useEffect(() => {
        const sectionEls = document.querySelectorAll('section[id]');
        
        observerRef.current = new IntersectionObserver((entries) => {
            if (isScrolling) return;
            
            entries.forEach(entry => {
                if (entry.isIntersecting && entry.intersectionRatio > 0.7) {
                    setCurrentTool(entry.target.id);
                }
            });
        }, {
            threshold: [0.7],
            rootMargin: '-20% 0px -20% 0px'
        });

        sectionEls.forEach(section => observerRef.current.observe(section));
        
        return () => {
            if (observerRef.current) {
                sectionEls.forEach(section => observerRef.current.unobserve(section));
            }
        };
    }, [isScrolling]);

    const animateSlider = React.useCallback((fromIndex, toIndex) => {
        if (!highlightRef.current) return;
        const moveIncrement = 4.5;
        const toPos = moveIncrement * toIndex;
        highlightRef.current.style.transform = `translateX(${toPos}em)`;
    }, []);

    React.useEffect(() => {
        if (prevTool !== currentTool) {
            const toolPrevIndex = tools.findIndex(t => t.id === prevTool);
            const toolIndex = tools.findIndex(t => t.id === currentTool);
            animateSlider(toolPrevIndex, toolIndex);
            setPrevTool(currentTool);
        }
    }, [currentTool, tools, animateSlider]);

    const scrollToSection = (id) => {
        setIsScrolling(true);
        const section = document.getElementById(id);
        const offset = document.querySelector('.toolbar-nav').offsetHeight;
        const sectionTop = section.offsetTop - offset;
        
        window.scrollTo({
            top: sectionTop,
            behavior: 'smooth'
        });
        
        setCurrentTool(id);

        if (scrollTimeout.current) {
            clearTimeout(scrollTimeout.current);
        }
        
        scrollTimeout.current = setTimeout(() => {
            setIsScrolling(false);
        }, 1000);
    };

    return (
        <React.Fragment>
            <Timeline />
            <HamburgerMenu isOpen={isMenuOpen} toggleMenu={() => setIsMenuOpen(!isMenuOpen)} />
            <Dropdown isOpen={isMenuOpen} />
            
            <div className="fixed top-0 left-0 right-0 flex justify-center p-4 z-30 toolbar-nav">
                <div className="relative inline-flex items-center rounded-full p-2 bg-gray-900/20 backdrop-blur-sm">
                    {tools.map((tool) => (
                        <button
                            key={tool.id}
                            className={`relative flex items-center justify-center w-16 h-16 rounded-full transition-all duration-300 mx-1
                                ${tool.id === currentTool 
                                    ? 'bg-gray-800/30 shadow-lg shadow-gray-900/30' 
                                    : 'hover:bg-gray-800/20'}`}
                            onClick={() => scrollToSection(tool.id)}
                        >
                            <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/5 to-transparent" />
                            <span className="relative text-white text-xl font-medium">
                                {tool.label[0]}
                            </span>
                            <span className="absolute top-full mt-3 text-sm bg-black/80 text-white px-4 py-2 rounded-lg opacity-0 hover:opacity-100 transition-opacity">
                                {tool.label}
                            </span>
                        </button>
                    ))}
                    <div 
                        ref={highlightRef}
                        className="absolute top-2 left-2 w-16 h-16 bg-white rounded-full mix-blend-difference pointer-events-none transition-transform duration-500 ease-out shadow-xl shadow-white/10"
                    />
                </div>
            </div>
            
            <main className="overflow-hidden">
                {sections.map(section => (
                    <Section key={section.id} {...section} />
                ))}
            </main>
        </React.Fragment>
    );
}


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);