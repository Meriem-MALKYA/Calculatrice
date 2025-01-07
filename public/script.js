class Calculator {
  constructor() {
    this.display = document.getElementById('display');
    this.currentValue = '';
    this.operation = null;
    this.plugins = {};

    this.initializeElements();
    this.setupEventListeners();
  }

  initializeElements() {
    this.numberButtons = document.querySelectorAll('.number');
    this.equalButton = document.getElementById('equal');
    this.pluginInput = document.getElementById('plugin-input');
    this.dynamicOperations = document.getElementById('dynamic-operations');
  }

  setupEventListeners() {
    this.setupNumberButtons();
    this.setupEqualButton();
    this.setupPluginInput();
  }

  setupNumberButtons() {
    this.numberButtons.forEach(button => {
      button.addEventListener('click', () => this.handleNumberClick(button));
    });
  }

  handleNumberClick(button) {
    this.currentValue += button.dataset.value;
    this.updateDisplay(this.currentValue);
  }

  setupEqualButton() {
    this.equalButton.addEventListener('click', () => this.calculateResult());
  }

  calculateResult() {
    if (!this.operation || !this.plugins[this.operation]) return;

    try {
      const [a, b] = this.currentValue.split(this.operation).map(Number);
      const result = this.plugins[this.operation].execute(a, b);
      this.currentValue = String(result);
      this.updateDisplay(result);
    } catch (error) {
      this.updateDisplay('Error');
    }
  }

  setupPluginInput() {
    this.pluginInput.addEventListener('change', (event) => this.handlePluginUpload(event));
  }

  async handlePluginUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const fileReader = new FileReader();
    fileReader.onload = () => this.processPluginFile(fileReader.result);
    fileReader.onerror = (error) => this.handleFileError(error);
    fileReader.readAsText(file);
  }

  processPluginFile(scriptContent) {
    const script = document.createElement('script');
    script.textContent = scriptContent;

    try {
      document.body.appendChild(script);
      this.validateAndRegisterPlugin();
    } catch (error) {
      console.error("Error during plugin handling:", error);
      this.updateDisplay('Error Loading Plugin');
    }
  }

  validateAndRegisterPlugin() {
    if (this.isValidPlugin(plugin)) {
      this.registerPlugin(plugin);
      this.createOperationButton(plugin);
    } else {
      console.error('Plugin structure is invalid:', plugin);
      this.updateDisplay('Invalid Plugin Structure');
    }
  }

  isValidPlugin(plugin) {
    return typeof plugin !== 'undefined' &&
           plugin.operation &&
           plugin.execute &&
           typeof plugin.operation === 'string' &&
           typeof plugin.execute === 'function';
  }

  registerPlugin(plugin) {
    this.plugins[plugin.operation] = plugin;
  }

  createOperationButton(plugin) {
    const button = document.createElement('button');
    button.textContent = plugin.operation;
    button.classList.add('btn', 'action');
    button.addEventListener('click', () => this.handleOperationClick(plugin));
    this.dynamicOperations.appendChild(button);
  }

  handleOperationClick(plugin) {
    this.operation = plugin.operation;
    this.currentValue += ` ${plugin.operation} `;
    this.updateDisplay(this.currentValue);
  }

  handleFileError(error) {
    console.error("File read error:", error);
    this.updateDisplay('Error Reading File');
  }

  updateDisplay(value) {
    this.display.textContent = value;
  }
}


document.addEventListener('DOMContentLoaded', () => {
  new Calculator();
});