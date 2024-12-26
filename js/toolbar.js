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
            layout: 'wideLeft',
            accentColor: 'from-violet-500 via-purple-500 to-fuchsia-500'
        },
        {
            id: 'instructions',
            label: 'Instructions',
            title: 'INSTRUCTIONS FOR THE FUTURE',
            content: 'Follow these steps to join our community and become part of the next generation.',
            color: 'bg-indigo-600',
            layout: 'centered',
            accentColor: 'from-cyan-500 via-blue-500 to-indigo-500'
        },
        {
            id: 'download',
            label: 'Download',
            title: 'GET STARTED NOW',
            content: 'Download our latest release and begin your journey.',
            color: 'bg-indigo-700',
            layout: 'wideRight',
            accentColor: 'from-emerald-500 via-teal-500 to-cyan-500'
        }
    ];

    const tools = sections.map(({ id, label, accentColor }) => ({ id, label, accentColor }));

    const getCurrentSection = () => sections.find(section => section.id === currentTool) || sections[0];

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
                <div className="relative bg-indigo-600 rounded-full px-3 py-2 min-w-[180px]">
                    {/* Container for buttons with proper spacing */}
                    <div className="relative flex items-center justify-between">
                        {tools.map((tool, index) => (
                            <button
                                key={tool.id}
                                onClick={() => scrollToSection(tool.id)}
                                className="relative z-10 w-10 h-10 flex items-center justify-center group"
                            >
                                <span className={`text-xl font-medium transition-colors duration-300 ${
                                    tool.id === currentTool 
                                        ? 'text-indigo-900'
                                        : 'text-white'
                                }`}>
                                    {tool.label[0]}
                                </span>
                                <span className="absolute top-full left-1/2 -translate-x-1/2 mt-2 
                                    text-sm bg-black/80 text-white px-3 py-1 rounded-lg 
                                    opacity-0 group-hover:opacity-100 transition-opacity">
                                    {tool.label}
                                </span>
                            </button>
                        ))}
                        
                        {/* Sliding indicator */}
                        <div 
                            className="absolute top-0 left-0 w-10 h-10 bg-white rounded-full 
                                transition-transform duration-300 ease-in-out"
                            style={{
                                transform: `translateX(${tools.findIndex(t => t.id === currentTool) * 40}px)`
                            }}
                        />
                    </div>
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