function ScrambleText({ text, progress }) {
    const [displayText, setDisplayText] = React.useState('');
    const chars = '!@#$%^&*()_+-=[]{}|;:,.<>?/1234567890';
    
    React.useEffect(() => {
        // More aggressive scaling to ensure complete unscrambling
        const adjustedProgress = progress < 0.45 ? 0 : (progress - 0.45) * 2.5;  
        const revealLength = Math.floor(text.length * Math.min(adjustedProgress, 1));
        
        const scrambledText = text
            .split('')
            .map((char, index) => {
                if (index < revealLength || adjustedProgress >= 1) {
                    return char;
                }
                return chars[Math.floor(Math.random() * chars.length)];
            })
            .join('');
        setDisplayText(scrambledText);
    }, [progress, text]);

    return (
        <span className={`inline-block font-mono bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent animate-rainbow`}>
            {displayText || text.replace(/./g, chars[Math.floor(Math.random() * chars.length)])}
        </span>
    );
}

function Section({ id, title, content, color }) {
    const [scrollProgress, setScrollProgress] = React.useState(0);
    const sectionRef = React.useRef(null);

    React.useEffect(() => {
        const calculateProgress = () => {
            if (!sectionRef.current) return;

            const rect = sectionRef.current.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            
            // Calculate the visibility of the section
            const elementTop = rect.top;
            const elementBottom = rect.bottom;
            const elementHeight = rect.height;
            
            // Calculate how much of the section is visible 
            const visibleHeight = Math.min(elementBottom, viewportHeight) - Math.max(elementTop, 0);
            const visibleRatio = visibleHeight / elementHeight;
            
            // Calculate the center alignment 
            const elementCenter = elementTop + (elementHeight / 2);
            const viewportCenter = viewportHeight / 2; 
            const distanceFromCenter = Math.abs(elementCenter - viewportCenter);
            const maxDistance = viewportHeight / 2;
            const centerAlignment = 1 - Math.min(distanceFromCenter / maxDistance, 1);
            
            // Combine visibility and center alignment
            const progress = Math.min(visibleRatio * centerAlignment * 1.5, 1);
            
            setScrollProgress(progress);
        };

        window.addEventListener('scroll', calculateProgress);
        calculateProgress(); // Initial calculation

        return () => window.removeEventListener('scroll', calculateProgress);
    }, []);

    return (
        <section 
            ref={sectionRef}
            id={id} 
            className={`min-h-screen flex items-center justify-center ${color} p-8 transition-colors duration-500`}
        >
            <div className="max-w-4xl mx-auto text-center">
            <h1 className={`text-6xl font-bold mb-8 rainbow-text`}>
    {title}
</h1>
                <p className="text-xl text-white/80 leading-relaxed">
                    <ScrambleText text={content} progress={scrollProgress} />
                </p>
            </div>
        </section>
    );
}

export { Section };