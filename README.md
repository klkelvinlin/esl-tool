# ESL Tool

A comprehensive web-based English as a Second Language (ESL) learning assistant that helps teachers and students create interactive reading materials with vocabulary support.

## 🌟 Features

### 📖 Article Management
- **Text Input**: Write or paste article content directly into the tool
- **Real-time Preview**: See your article formatted and displayed instantly
- **Persistent Storage**: Your work is automatically saved to local storage

### 🖼️ Image Integration
- **Drag & Drop Upload**: Simply drag images onto the upload area or click to browse
- **Image Display**: Uploaded images appear alongside your article content
- **Supported Formats**: All common image formats (JPG, PNG, GIF, etc.)

### 📚 Vocabulary Builder
- **Custom Vocabulary Lists**: Add words with comprehensive details:
  - English word
  - Chinese translation
  - Part of speech (POS)
  - Pronunciation guide
- **Color-Coded System**: Choose from 5 different colors to categorize vocabulary
- **Automatic Highlighting**: Vocabulary words are automatically highlighted in the article text
- **Visual Organization**: Vocabulary cards are displayed in a clean, organized sidebar

### 🎨 Interactive Features
- **Toggle Sections**: Show/hide image upload and article text areas
- **Preview Mode**: Switch between editing and preview layouts
- **Print Functionality**: Print your materials with proper formatting
- **Reset Option**: Clear all data with confirmation dialog

### 💾 Data Persistence
- **Local Storage**: All your work is automatically saved in your browser
- **Session Recovery**: Return to your work exactly where you left off
- **No Account Required**: Works completely offline with no registration needed

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- No additional software installation required

### Installation
1. Clone or download this repository
2. Open `index.html` in your web browser
3. Start creating your ESL materials!

### Alternative Setup
If you prefer to serve the files locally:
```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (if you have http-server installed)
npx http-server

# Using PHP
php -S localhost:8000
```

Then navigate to `http://localhost:8000` in your browser.

## 📖 Usage Guide

### Creating a New Lesson

1. **Upload an Image** (Optional)
   - Drag and drop an image onto the upload area
   - Or click the upload area to browse for an image
   - The image will appear in the article section

2. **Add Article Text**
   - Type or paste your article content in the text area
   - The formatted article will appear in real-time in the preview section

3. **Add Vocabulary**
   - Fill in the vocabulary form:
     - **Word**: The English vocabulary word
     - **Pronunciation**: How to pronounce the word
     - **Chinese Translation**: Chinese meaning
     - **POS**: Part of speech (noun, verb, adjective, etc.)
     - **Color**: Choose a color to categorize the word
   - Click "Save Vocabulary" to add it to your list

4. **Review and Print**
   - Use the "Preview" button to switch to preview mode
   - Click "Print" to print your materials
   - Use "Reset" to clear all data and start over

### Vocabulary Color System
- **Green**: General vocabulary
- **Blue**: Academic vocabulary
- **Yellow**: Important concepts
- **Red**: Key terms
- **Purple**: Specialized vocabulary

## 🛠️ Technical Details

### Built With
- **HTML5**: Semantic markup and structure
- **CSS3**: Styling with Tailwind CSS framework
- **JavaScript (ES6+)**: Interactive functionality
- **Local Storage API**: Data persistence
- **File API**: Image upload handling

### Browser Compatibility
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

### File Structure
```
esl-tool/
├── index.html          # Main HTML file
├── app.js             # JavaScript functionality
├── style.css          # Custom CSS styles
└── README.md          # This file
```

## 🎯 Use Cases

### For Teachers
- Create reading comprehension exercises
- Build vocabulary lists for specific topics
- Design visual learning materials
- Prepare printable worksheets
- Organize lesson content with images and text

### For Students
- Practice reading with visual aids
- Learn vocabulary in context
- Review materials with color-coded words
- Access learning materials offline

### For Content Creators
- Develop ESL learning materials
- Create bilingual content
- Design educational resources
- Build interactive reading experiences

## 🔧 Customization

### Adding New Colors
To add more vocabulary colors, edit the color selection in `index.html` and add corresponding CSS classes in `style.css`.

### Modifying Styles
The tool uses Tailwind CSS for styling. You can customize the appearance by:
- Modifying the Tailwind classes in the HTML
- Adding custom CSS rules in `style.css`
- Overriding default styles as needed

### Extending Functionality
The modular JavaScript structure makes it easy to add new features:
- New vocabulary fields
- Additional export formats
- Enhanced printing options
- Integration with external APIs

## 🤝 Contributing

Contributions are welcome! Here are some ways you can help:

1. **Report Bugs**: Open an issue for any bugs you find
2. **Feature Requests**: Suggest new features or improvements
3. **Code Contributions**: Submit pull requests for enhancements
4. **Documentation**: Help improve this README or add usage examples

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Built with [Tailwind CSS](https://tailwindcss.com/) for beautiful, responsive design
- Inspired by the needs of ESL teachers and students
- Designed for simplicity and ease of use

## 📞 Support

If you have questions or need help:
1. Check the usage guide above
2. Review the browser console for any error messages
3. Ensure you're using a supported browser
4. Try clearing your browser cache if you experience issues

---

**Happy teaching and learning!** 📚✨