// Upload Handler com Drag & Drop e WhatsApp Integration
class UploadHandler {
  constructor() {
    this.uploadArea = document.getElementById('uploadArea');
    this.fileInput = document.getElementById('fileInput');
    this.uploadPreview = document.getElementById('uploadPreview');
    this.previewGrid = document.getElementById('previewGrid');
    this.sendButton = document.getElementById('sendToWhatsApp');
    this.selectedFiles = [];
    
    this.init();
  }
  
  init() {
    // Drag & Drop events
    this.uploadArea.addEventListener('dragover', this.handleDragOver.bind(this));
    this.uploadArea.addEventListener('dragleave', this.handleDragLeave.bind(this));
    this.uploadArea.addEventListener('drop', this.handleDrop.bind(this));
    
    // File input change
    this.fileInput.addEventListener('change', this.handleFileSelect.bind(this));
    
    // WhatsApp send button
    this.sendButton.addEventListener('click', this.sendToWhatsApp.bind(this));
  }
  
  handleDragOver(e) {
    e.preventDefault();
    this.uploadArea.classList.add('dragover');
  }
  
  handleDragLeave(e) {
    e.preventDefault();
    this.uploadArea.classList.remove('dragover');
  }
  
  handleDrop(e) {
    e.preventDefault();
    this.uploadArea.classList.remove('dragover');
    
    const files = Array.from(e.dataTransfer.files);
    this.processFiles(files);
  }
  
  handleFileSelect(e) {
    const files = Array.from(e.target.files);
    this.processFiles(files);
  }
  
  processFiles(files) {
    // Filtrar apenas imagens
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length === 0) {
      alert('Por favor, selecione apenas arquivos de imagem (JPG, PNG, etc.)');
      return;
    }
    
    this.selectedFiles = imageFiles;
    this.displayPreview();
    this.showPreviewSection();
  }
  
  displayPreview() {
    this.previewGrid.innerHTML = '';
    
    this.selectedFiles.forEach((file, index) => {
      const previewItem = document.createElement('div');
      previewItem.className = 'preview-item';
      previewItem.dataset.index = index;
      
      if (file.type.startsWith('image/')) {
        const img = document.createElement('img');
        img.src = URL.createObjectURL(file);
        img.alt = file.name;
        previewItem.appendChild(img);
      } else {
        const icon = document.createElement('div');
        icon.className = 'file-icon';
        icon.textContent = '📄';
        previewItem.appendChild(icon);
      }
      
      // Botão de remover
      const removeBtn = document.createElement('button');
      removeBtn.className = 'remove-btn';
      removeBtn.innerHTML = '×';
      removeBtn.title = 'Remover imagem';
      removeBtn.addEventListener('click', () => this.removeFile(index));
      previewItem.appendChild(removeBtn);
      
      this.previewGrid.appendChild(previewItem);
    });
    
    // Esconder preview se não houver arquivos
    if (this.selectedFiles.length === 0) {
      this.uploadPreview.style.display = 'none';
    }
  }
  
  removeFile(index) {
    // Remover arquivo da lista
    this.selectedFiles.splice(index, 1);
    
    // Atualizar preview
    this.displayPreview();
    
    // Limpar input file para permitir re-seleção dos mesmos arquivos
    this.fileInput.value = '';
    
    // Feedback visual
    this.showRemoveMessage();
  }
  
  showRemoveMessage() {
    // Criar notificação temporária
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, #ef4444, #dc2626);
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 10px;
      font-weight: 600;
      z-index: 9999;
      box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3);
      transform: translateX(100%);
      transition: transform 0.3s ease;
    `;
    notification.innerHTML = '🗑️ Imagem removida';
    
    document.body.appendChild(notification);
    
    // Animar entrada
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remover após 2 segundos
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 2000);
  }
  
  showPreviewSection() {
    this.uploadPreview.style.display = 'block';
    this.uploadPreview.scrollIntoView({ behavior: 'smooth' });
  }
  
  getWhatsAppMessage(fileCount) {
    const messages = {
      1: `Olá! Gostaria de solicitar a edição de 1 imagem. Poderia me enviar um orçamento? 📸`,
      2: `Olá! Tenho 2 imagens que precisam de edição profissional. Qual seria o valor? 📸📸`,
      3: `Olá! Preciso editar 3 imagens. Poderia me passar um orçamento detalhado? 📸📸📸`,
      4: `Olá! Tenho 4 imagens para edição. Qual seria o melhor plano para mim? 📸📸📸📸`,
      5: `Olá! Tenho 5 imagens para editar. Gostaria do Pacote Básico (R$ 50). Podemos fechar? 📸📸📸📸📸`,
      10: `Olá! Tenho 10 imagens para editar. Gostaria do Pacote Profissional (R$ 100 + 2 de brinde). Vamos fechar? 📸✨`,
      15: `Olá! Tenho 15 imagens para editar. Gostaria do Pacote Premium (R$ 150 + 3 de brinde). Podemos conversar? 📸✨`,
      'many': `Olá! Tenho ${fileCount} imagens para edição profissional. Poderia me enviar um orçamento especial baseado nos seus pacotes? 📸✨`
    };
    
    // Sugerir pacotes baseados na quantidade
    if (fileCount >= 6 && fileCount <= 9) {
      return `Olá! Tenho ${fileCount} imagens para editar. Qual seria o melhor pacote para essa quantidade? Talvez o Profissional? 📸✨`;
    }
    if (fileCount >= 11 && fileCount <= 14) {
      return `Olá! Tenho ${fileCount} imagens para editar. Estou pensando no Pacote Premium. Podemos conversar sobre o valor? 📸✨`;
    }
    
    return messages[fileCount] || messages['many'];
  }
  
  sendToWhatsApp() {
    if (this.selectedFiles.length === 0) {
      alert('Nenhum arquivo selecionado!');
      return;
    }
    
    const fileCount = this.selectedFiles.length;
    const message = this.getWhatsAppMessage(fileCount);
    const whatsappNumber = '556198574343';
    
    // Criar lista de nomes dos arquivos
    const fileNames = this.selectedFiles.map(file => file.name).join(', ');
    const fullMessage = `${message}\n\nArquivos selecionados: ${fileNames}`;
    
    // Codificar mensagem para URL
    const encodedMessage = encodeURIComponent(fullMessage);
    
    // Abrir WhatsApp
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
    
    // Feedback visual
    this.showSuccessMessage();
  }
  
  showSuccessMessage() {
    const originalText = this.sendButton.innerHTML;
    this.sendButton.innerHTML = '✅ Enviado!';
    this.sendButton.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
    
    setTimeout(() => {
      this.sendButton.innerHTML = originalText;
      this.sendButton.style.background = 'linear-gradient(135deg, #25D366, #128C7E)';
    }, 3000);
  }
}

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
  new UploadHandler();
});
