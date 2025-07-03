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

    // Preview button functionality
    const previewBtn = document.getElementById('previewBtn');
    const formSection = document.querySelector('.lg\\:col-span-1');
    const articleSection = document.querySelector('.lg\\:col-span-2');

    // Print button functionality
    const printBtn = document.getElementById('printBtn');

    // Load saved data on page load
    loadSavedData();
    loadToggleStates();

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
        
        // Generate random hex color
        function getRandomColor() {
            const letters = '0123456789ABCDEF';
            let color = '#';
            for (let i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        }
        
        // Process vocabulary in groups of 4 lines
        for (let i = 0; i < lines.length; i += 4) {
            const word = lines[i].trim();
            const pronunciation = lines[i + 1].trim();
            const pos = lines[i + 2].trim();
            const definition = lines[i + 3].trim();
            
            if (word && pronunciation && pos && definition) {
                // Generate random hex color for each vocabulary item
                const randomColor = getRandomColor();
                
                const vocabItem = {
                    word: word,
                    pronunciation: pronunciation,
                    pos: pos,
                    definition: definition,
                    color: randomColor,
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
            const bgColor = item.color || '#e3f2fd';
            const textColor = getContrastColor(bgColor);
            const colorStyle = `background: ${bgColor}; color: ${textColor}; border-radius: 0.25rem; font-weight: bold; padding: 0.1em 0.6em; margin: 0 0.1em; font-size: 1em; display: inline; line-height: 2;`;
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
            // Use the stored color or default to a light blue
            const bgColor = item.color || '#e3f2fd';
            const textColor = getContrastColor(bgColor);
            const cardStyle = `background: ${bgColor}; border-radius: 0.25rem; padding: 0.75em 1em; margin-bottom: 0.75em;`;
            const wordStyle = `color: ${textColor}; font-weight: bold; font-size: 1.1em;`;
            
            vocabHTML += `
                <div style="${cardStyle}" data-vocab-index="${index}">
                    <div class="flex justify-between items-start">
                        <div class="flex-1">
                            <div><span style="${wordStyle}">${item.word}</span> <span class="vocab-pron">[${item.pronunciation}]</span></div>
                            <div class="mt-1">
                                <span class="vocab-pos">${item.pos}</span>
                                <span class="vocab-definition">${item.definition}</span>
                            </div>
                        </div>
                        <div class="ml-2">
                            <input type="color" class="vocab-color-picker w-8 h-8 border border-gray-300 rounded cursor-pointer" 
                                   data-index="${index}" value="${bgColor}" title="Change color">
                        </div>
                    </div>
                </div>
            `;
        });
        
        vocabContainer.innerHTML = vocabHTML;
        
        // Add event listeners to color pickers
        document.querySelectorAll('.vocab-color-picker').forEach(picker => {
            picker.addEventListener('change', function() {
                const index = parseInt(this.getAttribute('data-index'));
                const newColor = this.value;
                
                // Update vocabulary item color
                let vocabList = JSON.parse(localStorage.getItem('eslTool_vocabList') || '[]');
                if (vocabList[index]) {
                    vocabList[index].color = newColor;
                    localStorage.setItem('eslTool_vocabList', JSON.stringify(vocabList));
                    
                    // Update the card background color
                    const card = this.closest('[data-vocab-index]');
                    card.style.background = newColor;
                    
                    // Update the word color for contrast
                    const wordSpan = card.querySelector('span[style*="font-weight: bold"]');
                    if (wordSpan) {
                        wordSpan.style.color = getContrastColor(newColor);
                    }
                    
                    // Update highlighting in article
                    highlightVocabularyInArticle();
                }
            });
        });
        
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
        
        // Hide color pickers in vocabulary cards when in preview mode
        const colorPickers = document.querySelectorAll('.vocab-color-picker');
        colorPickers.forEach(picker => {
            picker.style.display = 'none';
        });
    }

    if (printBtn) {
        printBtn.addEventListener('click', function() {
            window.print();
        });
    }

    // Color picker functionality removed - using random colors instead
});
