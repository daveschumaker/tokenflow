# TokenFlow

A real-time visualization tool for comparing token streaming speeds across different LLM providers and models. TokenFlow helps developers and researchers visualize and compare the token generation performance of various language models in an intuitive and visual way.

## Features

- 🚀 Real-time token streaming visualization
- 🤔 And that's it!

## Installation

```bash
# Clone the repository
git clone https://github.com/daveschumaker/tokenflow.git
cd tokenflow
```

## Running the Project

You can use any simple HTTP server to serve the project. Here are a few options:

### Using Python (Python 3)
```bash
cd src
python -m http.server 8080
```

### Using Node.js's `http-server` (if you have Node.js installed)
```bash
# Install http-server globally (one-time setup)
npm install -g http-server

# Then run
cd src
http-server -p 8080
```

Then open your browser and navigate to either:
- `http://127.0.0.1:8080`
- `http://localhost:8080`

## Usage

1. Start serving index.html using one of the methods above
2. Open your browser and navigate to `http://127.0.0.1:8080`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have questions, please file an issue on the GitHub repository.