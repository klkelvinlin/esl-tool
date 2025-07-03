// ESL Tool JavaScript
console.log('ESL Tool JavaScript loaded successfully!');

// Basic functionality can be added here
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded and parsed');
    
    // Get DOM elements
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const imageDisplay = document.getElementById('imageDisplay');
    const uploadedImage = document.getElementById('uploadedImage');
    const articleText = document.getElementById('articleText');
    const articleDisplay = document.getElementById('articleDisplay');
    const resetBtn = document.getElementById('resetBtn');
    
    // Toggle elements
    const toggleImageLink = document.getElementById('toggleImageLink');
    const toggleArticleLink = document.getElementById('toggleArticleLink');
    const imageUploadForm = document.getElementById('imageUploadForm');
    const articleTextForm = document.getElementById('articleTextForm');
    
    // Vocabulary form elements
    const vocabText = document.getElementById('vocabText');
    const saveVocabBtn = document.getElementById('saveVocabBtn');
    
    // POS color picker elements
    const posColorPickers = {
        'n.': document.getElementById('posNoun'),
        'v.': document.getElementById('posVerb'),
        'adj.': document.getElementById('posAdj'),
        'adv.': document.getElementById('posAdv'),
        'prep.': document.getElementById('posPrep'),
        'conj.': document.getElementById('posConj'),
        'pron.': document.getElementById('posPron'),
        'interj.': document.getElementById('posInterj'),
        'art.': document.getElementById('posArt')
    };
    
    // POS mapping for both full words and abbreviations
    const posMapping = {
        'noun': 'n.',
        'verb': 'v.',
        'adjective': 'adj.',
        'adverb': 'adv.',
        'preposition': 'prep.',
        'conjunction': 'conj.',
        'pronoun': 'pron.',
        'interjection': 'interj.',
        'article': 'art.',
        'n.': 'n.',
        'v.': 'v.',
        'adj.': 'adj.',
        'adv.': 'adv.',
        'prep.': 'prep.',
        'conj.': 'conj.',
        'pron.': 'pron.',
        'interj.': 'interj.',
        'art.': 'art.'
    };

    // Preview button functionality
    const previewBtn = document.getElementById('previewBtn');
    const formSection = document.querySelector('.lg\\:col-span-1');
    const articleSection = document.querySelector('.lg\\:col-span-2');

    // Print button functionality
    const printBtn = document.getElementById('printBtn');

    // Load saved data on page load
    loadSavedData();
    loadToggleStates();
    loadPOSColors();
    updateVocabDisplay();
    
    // Add event listeners to POS color pickers
    Object.values(posColorPickers).forEach(picker => {
        if (picker) {
            picker.addEventListener('change', function() {
                savePOSColors();
                updateVocabDisplay(); // Update vocabulary display when colors change
            });
        }
    });

    // Drag and drop functionality
    dropZone.addEventListener('dragover', function(e) {
        e.preventDefault();
        dropZone.classList.add('border-blue-400', 'bg-blue-50');
    });

    dropZone.addEventListener('dragleave', function(e) {
        e.preventDefault();
        dropZone.classList.remove('border-blue-400', 'bg-blue-50');
    });

    dropZone.addEventListener('drop', function(e) {
        e.preventDefault();
        dropZone.classList.remove('border-blue-400', 'bg-blue-50');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFile(files[0]);
        }
    });

    // Click to browse functionality
    dropZone.addEventListener('click', function() {
        fileInput.click();
    });

    fileInput.addEventListener('change', function(e) {
        if (e.target.files.length > 0) {
            handleFile(e.target.files[0]);
        }
    });

    // Handle file upload
    function handleFile(file) {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                uploadedImage.src = e.target.result;
                imageDisplay.classList.remove('hidden');
                
                // Save image to local storage
                localStorage.setItem('eslTool_image', e.target.result);
                
                // Scroll to article section to show the image
                imageDisplay.scrollIntoView({ behavior: 'smooth', block: 'start' });
            };
            reader.readAsDataURL(file);
        } else {
            alert('Please upload an image file.');
        }
    }

    // Update article display when text changes
    articleText.addEventListener('input', function() {
        const text = articleText.value;
        if (text.trim()) {
            articleDisplay.innerHTML = `<p class="text-gray-700 leading-relaxed">${text.replace(/\n/g, '</p><p class="text-gray-700 leading-relaxed">')}</p>`;
            highlightVocabularyInArticle();
        } else {
            articleDisplay.innerHTML = '<p class="text-gray-500 italic">Article content will appear here...</p>';
        }
        
        // Save article text to local storage
        localStorage.setItem('eslTool_articleText', text);
    });

    // Save vocabulary button
    saveVocabBtn.addEventListener('click', function() {
        const vocabTextContent = vocabText.value.trim();
        
        if (!vocabTextContent) {
            alert('Please enter vocabulary text.');
            return;
        }

        // Parse the vocabulary text
        const lines = vocabTextContent.split('\n').filter(line => line.trim() !== '');
        
        if (lines.length % 4 !== 0) {
            alert('Vocabulary format should be: word\\npronunciation\\npos\\ndefinition\\nword\\n... (groups of 4 lines)');
            return;
        }

        // Reset vocabulary list - start with empty array
        let vocabList = [];
        
        // Process vocabulary in groups of 4 lines
        for (let i = 0; i < lines.length; i += 4) {
            const word = lines[i].trim();
            const pronunciation = lines[i + 1].trim();
            let pos = lines[i + 2].trim();
            const definition = lines[i + 3].trim();
            
            // Normalize POS to abbreviation
            pos = posMapping[pos.toLowerCase()] || pos;
            
            if (word && pronunciation && pos && definition) {
                // Get color based on POS
                const posColor = getPOSColor(pos);
                
                const vocabItem = {
                    word: word,
                    pronunciation: pronunciation,
                    pos: pos, // always abbreviation
                    definition: definition,
                    color: posColor,
                    timestamp: Date.now()
                };
                
                vocabList.push(vocabItem);
            }
        }
        
        // Save to local storage
        localStorage.setItem('eslTool_vocabList', JSON.stringify(vocabList));
        
        // Keep the textarea content (don't clear it)
        // No need to clear color selection since we're using random colors
        
        // Update vocabulary display
        updateVocabDisplay();
        
        alert('Vocabulary saved successfully!');
    });

    // Reset button functionality
    resetBtn.addEventListener('click', function() {
        if (confirm('Are you sure you want to reset all data? This action cannot be undone.')) {
            // Clear local storage
            localStorage.removeItem('eslTool_image');
            localStorage.removeItem('eslTool_articleText');
            localStorage.removeItem('eslTool_vocabList');
            
            // Clear form fields
            imageDisplay.classList.add('hidden');
            uploadedImage.src = '';
            articleText.value = '';
            articleDisplay.innerHTML = '<p class="text-gray-500 italic">Article content will appear here...</p>';
            
            // Clear vocabulary form
            vocabText.value = '';
            
            // Reset POS colors to defaults
            const defaultColors = {
                'n.': '#e3f2fd',
                'v.': '#f3e5f5',
                'adj.': '#e8f5e8',
                'adv.': '#fff3e0',
                'prep.': '#fce4ec',
                'conj.': '#e0f2f1',
                'pron.': '#f1f8e9',
                'interj.': '#fff8e1',
                'art.': '#fafafa'
            };
            
            Object.keys(posColorPickers).forEach(pos => {
                const picker = posColorPickers[pos];
                if (picker) {
                    picker.value = defaultColors[pos];
                }
            });
            savePOSColors();
            
            // Clear vocabulary display
            updateVocabDisplay();
            
            alert('All data has been reset successfully!');
        }
    });

    // Load saved data from local storage
    function loadSavedData() {
        // Load image
        const savedImage = localStorage.getItem('eslTool_image');
        if (savedImage) {
            uploadedImage.src = savedImage;
            imageDisplay.classList.remove('hidden');
        }
        
        // Load article text
        const savedArticleText = localStorage.getItem('eslTool_articleText');
        if (savedArticleText) {
            articleText.value = savedArticleText;
            if (savedArticleText.trim()) {
                articleDisplay.innerHTML = `<p class="text-gray-700 leading-relaxed">${savedArticleText.replace(/\n/g, '</p><p class="text-gray-700 leading-relaxed">')}</p>`;
                highlightVocabularyInArticle();
            }
        }
        
        // Load vocabulary list
        updateVocabDisplay();
    }

    // Function to highlight vocabulary words in the article
    function highlightVocabularyInArticle() {
        const vocabList = JSON.parse(localStorage.getItem('eslTool_vocabList') || '[]');
        const articleText = document.getElementById('articleText').value;
        
        if (!articleText.trim()) {
            return;
        }
        
        let highlightedText = articleText;
        
        // Sort vocabulary by word length (longest first) to avoid partial matches
        const sortedVocab = vocabList.sort((a, b) => b.word.length - a.word.length);
        
        sortedVocab.forEach(item => {
            const regex = new RegExp(`\\b${item.word}\\b`, 'gi');
            // Always use the current POS color for pills
            const bgColor = getPOSColor(item.pos) || '#e3f2fd';
            const wordColor = darkenColor(bgColor, 0.6); // Match card word color
            const colorStyle = `background: ${bgColor}; color: ${wordColor}; border-radius: 0.25rem; font-weight: bold; padding: 0.1em 0.6em; margin: 0 0.1em; font-size: 1em; display: inline; line-height: 2;`;
            highlightedText = highlightedText.replace(regex, `<span style=\"${colorStyle}\">${item.word}</span>`);
        });
        
        // Update the article display with highlighted text
        const articleDisplay = document.getElementById('articleDisplay');
        articleDisplay.innerHTML = `<p class=\"text-gray-700 leading-relaxed\">${highlightedText.replace(/\n/g, '</p><p class=\"text-gray-700 leading-relaxed\">')}</p>`;
    }

    // Function to get contrasting text color based on background
    function getContrastColor(hexColor) {
        // Convert hex to RGB
        const r = parseInt(hexColor.slice(1, 3), 16);
        const g = parseInt(hexColor.slice(3, 5), 16);
        const b = parseInt(hexColor.slice(5, 7), 16);
        
        // Calculate luminance
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        
        // Return black or white based on luminance
        return luminance > 0.5 ? '#000000' : '#ffffff';
    }

    // Update vocabulary display
    function updateVocabDisplay() {
        const vocabList = JSON.parse(localStorage.getItem('eslTool_vocabList') || '[]');
        const vocabContainer = document.querySelector('#vocabularyLists .content-placeholder');
        
        if (vocabList.length === 0) {
            vocabContainer.innerHTML = '<p class="text-gray-500 italic">No vocabulary items saved yet.</p>';
            return;
        }
        
        let vocabHTML = '';
        vocabList.forEach((item, index) => {
            // Always use the current POS color for display
            const bgColor = getPOSColor(item.pos) || '#e3f2fd';
            const wordColor = darkenColor(bgColor, 0.6); // 60% darker than bg
            const textColor = getContrastColor(bgColor);
            const cardStyle = `background: ${bgColor}; border-radius: 0.25rem; padding: 0.75em 1em; margin-bottom: 0.75em;`;
            const wordStyle = `color: ${wordColor}; font-weight: bold; font-size: 1.1em;`;
            
            vocabHTML += `
                <div style="${cardStyle}" data-vocab-index="${index}">
                    <div class="flex-1">
                        <div style=\"max-width:600px;margin:0 auto;\"><span style="${wordStyle}">${item.word}</span> <span class=\"vocab-pron text-gray-400\">[${item.pronunciation}]</span> <span class=\"vocab-pos text-gray-400\">${getPOSAbbreviation(item.pos)}</span></div>
                        <div class="mt-1" style="max-width:800px;margin:0 auto;">
                            <span class=\"vocab-definition text-gray-600\">${item.definition}</span>
                        </div>
                    </div>
                </div>
            `;
        });
        
        vocabContainer.innerHTML = vocabHTML;
        
        // Update highlighting in article after vocabulary changes
        highlightVocabularyInArticle();
    }

    // Make deleteVocabItem function globally available
    window.deleteVocabItem = function(index) {
        if (confirm('Are you sure you want to delete this vocabulary item?')) {
            let vocabList = JSON.parse(localStorage.getItem('eslTool_vocabList') || '[]');
            vocabList.splice(index, 1);
            localStorage.setItem('eslTool_vocabList', JSON.stringify(vocabList));
            updateVocabDisplay();
        }
    };

    // Load toggle states from local storage
    function loadToggleStates() {
        // Load image upload form state
        const imageFormHidden = localStorage.getItem('eslTool_imageFormHidden') === 'true';
        if (imageFormHidden) {
            imageUploadForm.classList.add('hidden');
            toggleImageLink.textContent = 'Show';
        }
        
        // Load article text form state
        const articleFormHidden = localStorage.getItem('eslTool_articleFormHidden') === 'true';
        if (articleFormHidden) {
            articleTextForm.classList.add('hidden');
            toggleArticleLink.textContent = 'Show';
        }
    }

    // Toggle functionality
    toggleImageLink.addEventListener('click', function(e) {
        e.preventDefault();
        const isHidden = imageUploadForm.classList.contains('hidden');
        if (isHidden) {
            imageUploadForm.classList.remove('hidden');
            toggleImageLink.textContent = 'Hide';
        } else {
            imageUploadForm.classList.add('hidden');
            toggleImageLink.textContent = 'Show';
        }
        localStorage.setItem('eslTool_imageFormHidden', !isHidden);
    });

    toggleArticleLink.addEventListener('click', function(e) {
        e.preventDefault();
        const isHidden = articleTextForm.classList.contains('hidden');
        if (isHidden) {
            articleTextForm.classList.remove('hidden');
            toggleArticleLink.textContent = 'Hide';
        } else {
            articleTextForm.classList.add('hidden');
            toggleArticleLink.textContent = 'Show';
        }
        localStorage.setItem('eslTool_articleFormHidden', !isHidden);
    });

    // Preview button functionality
    if (previewBtn) {
        previewBtn.addEventListener('click', function() {
            const url = new URL(window.location.href);
            url.searchParams.set('preview', 'true');
            window.location.href = url.toString();
        });
    }

    // On page load, check for preview mode
    if (window.location.search.includes('preview=true')) {
        if (formSection) formSection.style.display = 'none';
        if (articleSection) {
            articleSection.classList.remove('lg:col-span-2');
            articleSection.classList.add('lg:col-span-3');
        }
        if (printBtn) printBtn.classList.remove('hidden');
        
        // Hide POS color settings when in preview mode
        const posColorSection = document.querySelector('.bg-gray-50.rounded-lg');
        if (posColorSection) {
            posColorSection.style.display = 'none';
        }
    }

    if (printBtn) {
        printBtn.addEventListener('click', function() {
            window.print();
        });
    }

    // POS Color Management Functions
    function loadPOSColors() {
        const savedColors = JSON.parse(localStorage.getItem('eslTool_posColors') || '{}');
        
        // Set default colors if none saved
        const defaultColors = {
            'n.': '#e3f2fd',
            'v.': '#f3e5f5',
            'adj.': '#e8f5e8',
            'adv.': '#fff3e0',
            'prep.': '#fce4ec',
            'conj.': '#e0f2f1',
            'pron.': '#f1f8e9',
            'interj.': '#fff8e1',
            'art.': '#fafafa'
        };
        
        Object.keys(posColorPickers).forEach(pos => {
            const picker = posColorPickers[pos];
            if (picker) {
                const color = savedColors[pos] || defaultColors[pos];
                picker.value = color;
            }
        });
    }
    
    function savePOSColors() {
        const colors = {};
        Object.keys(posColorPickers).forEach(pos => {
            const picker = posColorPickers[pos];
            if (picker) {
                colors[pos] = picker.value;
            }
        });
        localStorage.setItem('eslTool_posColors', JSON.stringify(colors));
    }
    
    function getPOSColor(pos) {
        // Normalize POS to abbreviated form
        const normalizedPos = posMapping[pos.toLowerCase()] || pos;
        const picker = posColorPickers[normalizedPos];
        return picker ? picker.value : '#e3f2fd'; // Default to light blue
    }
    
    function getPOSAbbreviation(pos) {
        return posMapping[pos.toLowerCase()] || pos;
    }

    // Helper to darken a hex color by a percentage
    function darkenColor(hex, percent) {
        // Remove # if present
        hex = hex.replace(/^#/, '');
        let r = parseInt(hex.substring(0,2), 16);
        let g = parseInt(hex.substring(2,4), 16);
        let b = parseInt(hex.substring(4,6), 16);
        r = Math.floor(r * (1 - percent));
        g = Math.floor(g * (1 - percent));
        b = Math.floor(b * (1 - percent));
        return `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`;
    }
});
