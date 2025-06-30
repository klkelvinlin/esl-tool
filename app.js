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
    const vocabWord = document.getElementById('vocabWord');
    const vocabChinese = document.getElementById('vocabChinese');
    const vocabPOS = document.getElementById('vocabPOS');
    const vocabDefinition = document.getElementById('vocabDefinition');
    const saveVocabBtn = document.getElementById('saveVocabBtn');
    const vocabColorInputs = document.querySelectorAll('input[name="vocabColor"]');

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
        const word = vocabWord.value.trim();
        const chinese = vocabChinese.value.trim();
        const pos = vocabPOS.value;
        const pronunciation = vocabDefinition.value.trim();
        const selectedColor = document.querySelector('input[name="vocabColor"]:checked');
        
        if (!word || !chinese || !pos || !pronunciation || !selectedColor) {
            alert('Please fill in all vocabulary fields and select a color.');
            return;
        }

        const vocabItem = {
            word: word,
            chinese: chinese,
            pos: pos,
            definition: pronunciation,
            color: selectedColor.value,
            timestamp: Date.now()
        };

        // Get existing vocabulary list
        let vocabList = JSON.parse(localStorage.getItem('eslTool_vocabList') || '[]');
        vocabList.push(vocabItem);
        
        // Save to local storage
        localStorage.setItem('eslTool_vocabList', JSON.stringify(vocabList));
        
        // Clear form
        vocabWord.value = '';
        vocabChinese.value = '';
        vocabPOS.value = '';
        vocabDefinition.value = '';
        selectedColor.checked = false;
        
        // Clear color selection visual feedback
        document.querySelectorAll('input[name="vocabColor"] + label').forEach(label => {
            label.style.borderColor = 'transparent';
        });
        
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
            vocabWord.value = '';
            vocabChinese.value = '';
            vocabPOS.value = '';
            vocabDefinition.value = '';
            vocabColorInputs.forEach(input => input.checked = false);
            
            // Clear color selection visual feedback
            document.querySelectorAll('input[name="vocabColor"] + label').forEach(label => {
                label.style.borderColor = 'transparent';
            });
            
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
        
        // Color mapping for pastel rainbow palette and matching font colors
        const colorMap = {
            red: { bg: '#87b792', text: '#3a5042' },      // Tailwind red-700
            blue: { bg: '#afcc52', text: '#5f662f' },     // Tailwind blue-600
            green: { bg: '#e3aa42', text: '#7f5f26' },    // Tailwind green-700
            yellow: { bg: '#fd814a', text: '#9b4a2b' },   // Tailwind yellow-700
            purple: { bg: '#ead494', text: '#8c7a55' },   // Tailwind amber-700 (for orange/yellow slot)
        };
        
        // Sort vocabulary by word length (longest first) to avoid partial matches
        const sortedVocab = vocabList.sort((a, b) => b.word.length - a.word.length);
        
        sortedVocab.forEach(item => {
            const regex = new RegExp(`\\b${item.word}\\b`, 'gi');
            const color = colorMap[item.color] || colorMap.blue;
            const colorStyle = `background: ${color.bg}; color: ${color.text}; border-radius: 0.25rem; font-weight: bold; padding: 0.1em 0.6em; margin: 0 0.1em; font-size: 1em; display: inline; line-height: 2;`;
            highlightedText = highlightedText.replace(regex, `<span style=\"${colorStyle}\">${item.word}</span>`);
        });
        
        // Update the article display with highlighted text
        const articleDisplay = document.getElementById('articleDisplay');
        articleDisplay.innerHTML = `<p class=\"text-gray-700 leading-relaxed\">${highlightedText.replace(/\n/g, '</p><p class=\"text-gray-700 leading-relaxed\">')}</p>`;
    }

    // Update vocabulary display
    function updateVocabDisplay() {
        const vocabList = JSON.parse(localStorage.getItem('eslTool_vocabList') || '[]');
        const vocabContainer = document.querySelector('#vocabularyLists .content-placeholder');
        
        if (vocabList.length === 0) {
            vocabContainer.innerHTML = '<p class="text-gray-500 italic">No vocabulary items saved yet.</p>';
            return;
        }
        
        // Color mapping for consistent display
        const colorMap = {
            red: { bg: '#87b792', text: '#3a5042' },
            blue: { bg: '#afcc52', text: '#5f662f' },
            green: { bg: '#e3aa42', text: '#7f5f26' },
            yellow: { bg: '#fd814a', text: '#9b4a2b' },
            purple: { bg: '#ead494', text: '#8c7a55' },
        };
        
        let vocabHTML = '';
        vocabList.forEach((item, index) => {
            const color = colorMap[item.color] || colorMap.blue;
            const cardStyle = `background: ${color.bg}; border-radius: 0.25rem; padding: 0.75em 1em; margin-bottom: 0.75em;`;
            const wordStyle = `color: ${color.text}; font-weight: bold; font-size: 1.1em;`;
            
            vocabHTML += `
                <div style="${cardStyle}">
                    <div><span style="${wordStyle}">${item.word}</span> <span class="vocab-pron">[${item.definition}]</span></div>
                    <div class="mt-1">
                        <span class="vocab-pos">${item.pos}</span>
                        <span class="vocab-chinese">${item.chinese}</span>
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
    }

    if (printBtn) {
        printBtn.addEventListener('click', function() {
            window.print();
        });
    }

    // Add visual feedback for color selection
    vocabColorInputs.forEach(input => {
        input.addEventListener('change', function() {
            // Remove border from all color labels
            document.querySelectorAll('input[name="vocabColor"] + label').forEach(label => {
                label.style.borderColor = 'transparent';
            });
            
            // Add border to selected color label
            if (this.checked) {
                this.nextElementSibling.style.borderColor = '#3b82f6';
                this.nextElementSibling.style.borderWidth = '3px';
            }
        });
    });
});
