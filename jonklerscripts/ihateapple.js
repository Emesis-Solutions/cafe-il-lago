// Get all stylesheets and their rules
function getAllCSSRules() {
    const rules = [];
    for (const sheet of document.styleSheets) {
        try {
            // Handle cross-origin stylesheets
            const cssRules = sheet.cssRules || sheet.rules;
            for (const rule of cssRules) {
                if (rule.style) {
                    rules.push(rule);
                }
            }
        } catch (e) {
            console.log('Cannot access stylesheet:', e);
        }
    }
    return rules;
}

// Properties that might need webkit prefixes
const webkitProperties = [
    'animation',
    'animation-delay',
    'animation-direction',
    'animation-duration',
    'animation-fill-mode',
    'animation-iteration-count',
    'animation-name',
    'animation-play-state',
    'animation-timing-function',
    'appearance',
    'backdrop-filter',
    'backface-visibility',
    'background-clip',
    'border-radius',
    'box-shadow',
    'box-sizing',
    'filter',
    'flex',
    'flex-basis',
    'flex-direction',
    'flex-flow',
    'flex-grow',
    'flex-shrink',
    'flex-wrap',
    'font-smoothing',
    'transform',
    'transform-origin',
    'transform-style',
    'transition',
    'transition-delay',
    'transition-duration',
    'transition-property',
    'transition-timing-function',
    'user-select'
];

// Add webkit prefixes to elements
function addWebkitPrefixes() {
    const rules = getAllCSSRules();
    const styleSheet = document.createElement('style');
    document.head.appendChild(styleSheet);

    rules.forEach(rule => {
        if (rule.selectorText) {
            const elements = document.querySelectorAll(rule.selectorText);
            elements.forEach(element => {
                const computedStyle = window.getComputedStyle(element);
                webkitProperties.forEach(prop => {
                    const value = computedStyle.getPropertyValue(prop);
                    if (value && value !== '') {
                        // Convert property name to webkit format
                        const webkitProp = `-webkit-${prop}`;
                        
                        // Add rule to the new stylesheet
                        const newRule = `${rule.selectorText} { ${webkitProp}: ${value}; }`;
                        styleSheet.sheet.insertRule(newRule, styleSheet.sheet.cssRules.length);
                        
                        // Also apply directly to element for immediate effect
                        element.style.setProperty(webkitProp, value);
                    }
                });
            });
        }
    });
}

// Function to list all CSS rules
function listCSSRules() {
    const rules = getAllCSSRules();
    console.log('All CSS Rules:');
    rules.forEach(rule => {
        if (rule.selectorText) {
            console.log(`\nSelector: ${rule.selectorText}`);
            console.log('Properties:');
            for (let i = 0; i < rule.style.length; i++) {
                const prop = rule.style[i];
                const value = rule.style.getPropertyValue(prop);
                console.log(`  ${prop}: ${value}`);
            }
        }
    });
}

// Function to detect iOS Safari
function isIOSSafari() {
    const ua = window.navigator.userAgent;
    const iOS = !!ua.match(/iPad/i) || !!ua.match(/iPhone/i);
    const webkit = !!ua.match(/WebKit/i);
    const iOSSafari = iOS && webkit && !ua.match(/CriOS/i) && !ua.match(/FxiOS/i) && !ua.match(/OPiOS/i);
    return iOSSafari;
}

// Only run if it's iOS Safari
if (isIOSSafari()) {
    console.log('iOS Safari detected - Adding webkit prefixes...');
    listCSSRules();
    addWebkitPrefixes();
} else {
    console.log('Not iOS Safari - No webkit prefixes needed');
}