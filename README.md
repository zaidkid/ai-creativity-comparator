# AI Creativity Comparator

A React-based web application that compares human-written content with AI-generated responses and evaluates creativity using multiple scoring metrics.

---


## Features

* Input your own written response
* Generate AI response using Gemini API
* Compare human vs AI creativity
* Scoring based on:

  * Length
  * Vocabulary richness
  * Expression
  * Originality
* Visual comparison with result
* Strength analysis for both responses
* Clean and interactive user interface

---

## Tech Stack

* Frontend: React.js
* Styling: CSS
* API: Google Gemini API
* Version Control: Git and GitHub

---

## Project Structure

```id="1dhs9f"
ai-creativity-comparator/
└── ai-creativity-app/
    ├── src/
    │   ├── pages/
    │   │   ├── Home.js
    │   │   └── Result.js
    │   ├── App.js
    │   ├── App.css
    │   └── index.js
    ├── public/
    ├── package.json
```

---

## Installation and Setup

1. Clone the repository:

```bash id="9k9z6l"
git clone https://github.com/YOUR_USERNAME/ai-creativity-comparator.git
```

2. Navigate to project folder:

```bash id="ox0x5k"
cd ai-creativity-comparator/ai-creativity-app
```

3. Install dependencies:

```bash id="s0htg2"
npm install
```

4. Run the application:

```bash id="qmqbmt"
npm start
```

---

## Environment Variables

Create a `.env` file inside `ai-creativity-app`:

```id="b8l4s2"
REACT_APP_GEMINI_API_KEY=your_api_key_here
```

Use it in your code:

```js id="zzqv8v"
const GEMINI_KEY = process.env.REACT_APP_GEMINI_API_KEY;
```

---

## Screenshots

<img width="1919" height="1147" alt="Screenshot 2026-04-24 025224" src="https://github.com/user-attachments/assets/12b3e1b5-cb51-4c2b-9b02-3faf3c98ef35" />
<img width="1901" height="1141" alt="image" src="https://github.com/user-attachments/assets/e6f26abf-6949-4164-b382-8e26e315704b" />
<img width="1904" height="1141" alt="image" src="https://github.com/user-attachments/assets/06837431-3473-4b25-a0e8-13304659765c" />



---

## Use Cases

* Comparing human and AI creativity
* Educational purposes
* Understanding AI-generated content
* Writing skill evaluation

---

## Author

Zaid Kidwai
GitHub: https://github.com/zaidkid

---

## Contributing

Contributions are welcome.

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Submit a pull request

---

## License

This project is open-source and available under the MIT License.
