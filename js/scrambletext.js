function ScrambleText({ text, progress }) {
    const [displayText, setDisplayText] = React.useState('');
    const [dimensions, setDimensions] = React.useState({ width: 0, height: 0 });
    const containerRef = React.useRef(null);
    const chars = '!@#$%^&*()_+-=[]{}|;:,.<>?/1234567890';
    
    // Calculate text dimensions on mount
    React.useEffect(() => {
        const container = containerRef.current;
        if (container) {
            // Create temporary element to measure text
            const temp = document.createElement('div');
            temp.style.position = 'absolute';
            temp.style.visibility = 'hidden';
            temp.style.whiteSpace = 'pre-wrap';
            temp.style.width = container.offsetWidth + 'px';
            temp.style.fontSize = window.getComputedStyle(container).fontSize;
            temp.style.fontFamily = window.getComputedStyle(container).fontFamily;
            temp.style.lineHeight = window.getComputedStyle(container).lineHeight;
            temp.textContent = text;
            document.body.appendChild(temp);
            
            // Store dimensions
            setDimensions({
                width: temp.offsetWidth,
                height: temp.offsetHeight
            });
            
            document.body.removeChild(temp);
        }
    }, [text]);

    // Generate scrambled text while maintaining length
    React.useEffect(() => {
        const adjustedProgress = progress < 0.45 ? 0 : (progress - 0.45) * 2.5;
        const revealLength = Math.floor(text.length * Math.min(adjustedProgress, 1));
        
        // Keep character count consistent
        const scrambledText = text
            .split('')
            .map((char, index) => {
                if (index < revealLength || adjustedProgress >= 1) {
                    return char;
                }
                // Replace spaces with spaces to maintain word breaks
                if (char === ' ') return ' ';
                // Use character with similar width for scrambling
                return chars[Math.floor(Math.random() * chars.length)];
            })
            .join('');
            
        setDisplayText(scrambledText);
    }, [progress, text]);

    return (
        <div 
            ref={containerRef} 
            className="inline-block font-mono"
            style={{
                width: dimensions.width || 'auto',
                height: dimensions.height || 'auto',
                minHeight: dimensions.height || 'auto',
                overflow: 'hidden'
            }}
        >
            <span className="bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent animate-rainbow">
                {displayText || text.replace(/./g, char => 
                    char === ' ' ? ' ' : chars[Math.floor(Math.random() * chars.length)]
                )}
            </span>
        </div>
    );
}

function Section({ id, title, content, color, layout = 'default' }) {
    const [scrollProgress, setScrollProgress] = React.useState(0);
    const [isVisible, setIsVisible] = React.useState(false);
    const sectionRef = React.useRef(null);

    // Layout variations
    const layouts = {
        default: "grid grid-cols-2 gap-8",
        centered: "flex flex-col items-center text-center max-w-2xl mx-auto",
        reversed: "grid grid-cols-2 gap-8 flex-row-reverse",
        stacked: "grid grid-cols-1 gap-8 max-w-2xl mx-auto",
        wideLeft: "grid grid-cols-3 gap-8",
        wideRight: "grid grid-cols-3 gap-8"
    };

    // Content positioning based on layout
    const getContentStyles = () => {
        switch (layout) {
            case 'wideLeft':
                return {
                    title: "col-span-2",
                    content: "col-span-1"
                };
            case 'wideRight':
                return {
                    title: "col-span-1",
                    content: "col-span-2"
                };
            default:
                return {
                    title: "",
                    content: ""
                };
        }
    };
    const contentDimensions = React.useMemo(() => {
        // Estimate based on character count and average character width
        const averageCharWidth = 0.6; // em units
        const lineHeight = 1.75; // matching leading-relaxed
        const fontSize = 1.25; // matching text-xl
        const containerWidth = 30; // em units (approximate container width)
        
        const charactersPerLine = Math.floor(containerWidth / averageCharWidth);
        const lines = Math.ceil(content.length / charactersPerLine);
        const height = lines * lineHeight * fontSize;
        
        return {
            minHeight: `${height + 2}rem` // Adding padding
        };
    }, [content]);
    React.useEffect(() => {
        const calculateProgress = () => {
            if (!sectionRef.current) return;

            const rect = sectionRef.current.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            
            const elementTop = rect.top;
            const elementBottom = rect.bottom;
            const elementHeight = rect.height;
            
            const visibleHeight = Math.min(elementBottom, viewportHeight) - Math.max(elementTop, 0);
            const visibleRatio = visibleHeight / elementHeight;
            
            const elementCenter = elementTop + (elementHeight / 2);
            const viewportCenter = viewportHeight / 2;
            const distanceFromCenter = Math.abs(elementCenter - viewportCenter);
            const maxDistance = viewportHeight / 2;
            const centerAlignment = 1 - Math.min(distanceFromCenter / maxDistance, 1);
            
            const progress = Math.min(visibleRatio * centerAlignment * 1.5, 1);
            
            setScrollProgress(progress);
            setIsVisible(progress > 0.1);
        };

        window.addEventListener('scroll', calculateProgress);
        calculateProgress();

        return () => window.removeEventListener('scroll', calculateProgress);
    }, []);

    const contentStyles = getContentStyles();

    return (
        <section 
            ref={sectionRef}
            id={id} 
            className={`min-h-screen flex items-center justify-center ${color} p-8 transition-colors duration-500 overflow-hidden`}
        >
            <div className="max-w-6xl mx-auto w-full">
                <div className={layouts[layout]}>
                    {/* Title container */}
                    <div className={`transform transition-all duration-1000 ${
                        isVisible ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
                    } ${contentStyles.title}`}>
                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
                            <h1 className="text-6xl font-bold mb-8 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent">
                                {title}
                            </h1>
                        </div>
                    </div>

                    {/* Content container with fixed dimensions */}
                    <div className={`transform transition-all duration-1000 delay-200 ${
                        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
                    } ${contentStyles.content}`}>
                        <div 
                            className="bg-white/10 backdrop-blur-sm rounded-2xl p-8"
                            style={contentDimensions}
                        >
                            <p className="text-xl text-white/80 leading-relaxed">
                                <ScrambleText text={content} progress={scrollProgress} />
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export { Section };