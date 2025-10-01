// RAJ Image Studio - Main JavaScript
class ImageGenerator {
    constructor() {
        this.isGenerating = false;
        this.previewTimeout = null;
        this.history = this.loadHistory();
        this.currentEditImage = null;
        
        this.init();
    }
    
    init() {
        this.initTypewriter();
        this.bindEvents();
        this.loadReloadedPrompt();
        this.initAnimations();
    }
    
    initTypewriter() {
        const typed = new Typed('#typed-text', {
            strings: [
                'Create Amazing Images',
                'Generate AI Art',
                'Design with AI',
                'Visualize Your Ideas'
            ],
            typeSpeed: 80,
            backSpeed: 50,
            backDelay: 2000,
            loop: true,
            showCursor: true,
            cursorChar: '|'
        });
    }
    
    initAnimations() {
        // Animate elements on page load
        anime({
            targets: '.hero-bg',
            opacity: [0, 1],
            duration: 1000,
            easing: 'easeOutQuad'
        });
        
        anime({
            targets: '.bg-white',
            opacity: [0, 1],
            translateY: [20, 0],
            duration: 800,
            delay: anime.stagger(100),
            easing: 'easeOutQuad'
        });
    }
    
    bindEvents() {
        // Generate button
        document.getElementById('generateBtn').addEventListener('click', () => this.generateImage());
        
        // Advanced settings toggle
        document.getElementById('advancedToggle').addEventListener('click', () => this.toggleAdvanced());
        
        // Real-time preview
        document.getElementById('prompt').addEventListener('input', () => this.schedulePreview());
        document.getElementById('style').addEventListener('change', () => this.schedulePreview());
        document.getElementById('model').addEventListener('change', () => this.schedulePreview());
        
        // CFG scale slider
        document.getElementById('cfgScale').addEventListener('input', (e) => {
            document.getElementById('cfgValue').textContent = e.target.value;
        });
        
        // Random seed
        document.getElementById('randomSeed').addEventListener('click', () => this.generateRandomSeed());
        
        // Modal events
        document.getElementById('closeModal').addEventListener('click', () => this.closeEditor());
        document.getElementById('editorModal').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) this.closeEditor();
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch(e.key) {
                    case 'Enter':
                        e.preventDefault();
                        this.generateImage();
                        break;
                    case 'z':
                        e.preventDefault();
                        this.undo();
                        break;
                    case 'y':
                        e.preventDefault();
                        this.redo();
                        break;
                }
            }
            if (e.key === 'Escape') {
                this.closeEditor();
            }
        });
    }
    
    loadReloadedPrompt() {
        const reloadData = sessionStorage.getItem('reloadPrompt');
        if (reloadData) {
            try {
                const data = JSON.parse(reloadData);
                this.populateForm(data);
                sessionStorage.removeItem('reloadPrompt');
                this.showToast('Prompt loaded from history', 'success');
            } catch (error) {
                console.error('Error loading reloaded prompt:', error);
            }
        }
    }
    
    populateForm(data) {
        document.getElementById('prompt').value = data.prompt || '';
        document.getElementById('negativePrompt').value = data.negativePrompt || '';
        document.getElementById('style').value = data.style || 'General';
        document.getElementById('model').value = data.model || 'Turbo';
        document.getElementById('cfgScale').value = data.cfgScale || 7;
        document.getElementById('cfgValue').textContent = data.cfgScale || 7;
        document.getElementById('numOutputs').value = data.numOutputs || 1;
        document.getElementById('resolution').value = data.resolution || '512x512';
        document.getElementById('seed').value = data.seed || '';
    }
    
    toggleAdvanced() {
        const settings = document.getElementById('advancedSettings');
        const toggle = document.getElementById('advancedToggle');
        
        if (settings.classList.contains('hidden')) {
            settings.classList.remove('hidden');
            toggle.innerHTML = 'Advanced Settings ▲';
            
            anime({
                targets: settings,
                opacity: [0, 1],
                translateY: [-10, 0],
                duration: 300,
                easing: 'easeOutQuad'
            });
        } else {
            settings.classList.add('hidden');
            toggle.innerHTML = 'Advanced Settings ▼';
        }
    }
    
    schedulePreview() {
        if (this.previewTimeout) {
            clearTimeout(this.previewTimeout);
        }
        
        this.previewTimeout = setTimeout(() => {
            this.updatePreview();
        }, 1000);
    }
    
    async updatePreview() {
        const prompt = document.getElementById('prompt').value.trim();
        if (!prompt) {
            this.clearPreview();
            return;
        }
        
        const container = document.getElementById('previewContainer');
        container.innerHTML = `
            <div class="text-center">
                <div class="loading-spinner mx-auto mb-2"></div>
                <p class="text-sm text-gray-500">Generating preview...</p>
            </div>
        `;
        
        try {
            const previewUrl = await this.generatePreviewUrl(prompt);
            container.innerHTML = `
                <img src="${previewUrl}" alt="Preview" class="max-w-full max-h-full object-contain rounded-lg">
            `;
            
            // Animate preview appearance
            anime({
                targets: container.querySelector('img'),
                opacity: [0, 1],
                scale: [0.9, 1],
                duration: 500,
                easing: 'easeOutQuad'
            });
            
        } catch (error) {
            console.error('Preview generation failed:', error);
            this.clearPreview();
        }
    }
    
    clearPreview() {
        const container = document.getElementById('previewContainer');
        container.innerHTML = `
            <div class="text-center text-gray-500">
                <p>Start typing to see preview</p>
                <p class="text-sm">Uses Photon model for fast preview</p>
            </div>
        `;
    }
    
    async generatePreviewUrl(prompt) {
        // Use Photon model for fast preview
        const params = new URLSearchParams({
            prompt: prompt,
            model: 'photon',
            width: 256,
            height: 256,
            nologo: 'true'
        });
        
        return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?${params.toString()}`;
    }
    
    async generateImage() {
        if (this.isGenerating) return;
        
        const prompt = document.getElementById('prompt').value.trim();
        if (!prompt) {
            this.showToast('Please enter a prompt', 'error');
            return;
        }
        
        this.setGeneratingState(true);
        
        try {
            const params = this.getGenerationParams();
            const images = await this.generateImages(params);
            this.displayResults(images, params);
            this.saveToHistory(params, images);
            this.showToast(`Generated ${images.length} image${images.length > 1 ? 's' : ''}!`, 'success');
            
        } catch (error) {
            console.error('Generation failed:', error);
            this.showToast('Generation failed. Please try again.', 'error');
        } finally {
            this.setGeneratingState(false);
        }
    }
    
    getGenerationParams() {
        return {
            prompt: document.getElementById('prompt').value.trim(),
            negativePrompt: document.getElementById('negativePrompt').value.trim(),
            style: document.getElementById('style').value,
            model: document.getElementById('model').value,
            cfgScale: parseInt(document.getElementById('cfgScale').value),
            numOutputs: parseInt(document.getElementById('numOutputs').value),
            resolution: document.getElementById('resolution').value,
            seed: document.getElementById('seed').value.trim() || 'random'
        };
    }
    
    async generateImages(params) {
        const [width, height] = params.resolution.split('x').map(Number);
        const images = [];
        
        for (let i = 0; i < params.numOutputs; i++) {
            const urlParams = new URLSearchParams({
                prompt: params.prompt,
                model: params.model.toLowerCase(),
                width: width,
                height: height,
                seed: params.seed === 'random' ? Math.floor(Math.random() * 1000000) : params.seed,
                nologo: 'true'
            });
            
            if (params.negativePrompt) {
                urlParams.set('negative', params.negativePrompt);
            }
            
            if (params.style !== 'General') {
                urlParams.set('style', params.style.toLowerCase());
            }
            
            const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(params.prompt)}?${urlParams.toString()}`;
            images.push(url);
        }
        
        return images;
    }
    
    displayResults(images, params) {
        const container = document.getElementById('resultsContainer');
        
        const resultsHTML = `
            <div class="mb-4">
                <div class="flex justify-between items-center">
                    <h4 class="font-semibold">Generated ${images.length} image${images.length > 1 ? 's' : ''}</h4>
                    <div class="flex gap-2">
                        <button onclick="imageGenerator.downloadAll()" class="btn-secondary text-sm">
                            Download All
                        </button>
                        <button onclick="imageGenerator.shareResults()" class="btn-secondary text-sm">
                            Share
                        </button>
                    </div>
                </div>
                <div class="text-sm text-gray-600 mt-1">
                    Model: ${params.model} • Style: ${params.style} • Resolution: ${params.resolution}
                </div>
            </div>
            
            <div class="generated-grid">
                ${images.map((image, index) => `
                    <div class="image-card" onclick="imageGenerator.openEditor('${image}', ${index})">
                        <img src="${image}" alt="Generated image ${index + 1}" class="w-full h-64 object-cover">
                        <div class="p-4">
                            <div class="flex justify-between items-center">
                                <span class="text-sm font-medium">Image ${index + 1}</span>
                                <button onclick="event.stopPropagation(); imageGenerator.downloadImage('${image}', ${index})" class="btn-secondary text-xs">
                                    Download
                                </button>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
        
        container.innerHTML = resultsHTML;
        
        // Animate results appearance
        anime({
            targets: '.image-card',
            opacity: [0, 1],
            translateY: [20, 0],
            duration: 600,
            delay: anime.stagger(100),
            easing: 'easeOutQuad'
        });
    }
    
    openEditor(imageUrl, index) {
        this.currentEditImage = { url: imageUrl, index };
        const modal = document.getElementById('editorModal');
        const content = document.getElementById('editorContent');
        
        content.innerHTML = `
            <div class="text-center">
                <img src="${imageUrl}" alt="Edit image" class="max-w-full max-h-96 object-contain rounded-lg mb-4">
                <div class="flex justify-center gap-4">
                    <button onclick="imageGenerator.downloadImage('${imageUrl}', ${index})" class="btn-primary">
                        Download
                    </button>
                    <button onclick="imageGenerator.closeEditor()" class="btn-secondary">
                        Close
                    </button>
                </div>
            </div>
        `;
        
        modal.classList.remove('hidden');
        
        // Animate modal appearance
        anime({
            targets: '.modal-content',
            opacity: [0, 1],
            scale: [0.9, 1],
            duration: 300,
            easing: 'easeOutQuad'
        });
    }
    
    closeEditor() {
        const modal = document.getElementById('editorModal');
        modal.classList.add('hidden');
        this.currentEditImage = null;
    }
    
    downloadImage(imageUrl, index) {
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = `raj-image-${Date.now()}-${index + 1}.jpg`;
        link.click();
        this.showToast('Image downloaded', 'success');
    }
    
    downloadAll() {
        const imageCards = document.querySelectorAll('.image-card img');
        imageCards.forEach((img, index) => {
            setTimeout(() => {
                this.downloadImage(img.src, index);
            }, index * 500);
        });
        this.showToast('Downloading all images...', 'success');
    }
    
    shareResults() {
        if (navigator.share) {
            navigator.share({
                title: 'RAJ Image Studio - Generated Images',
                text: 'Check out these AI generated images!',
                url: window.location.href
            });
        } else {
            // Fallback - copy URL to clipboard
            navigator.clipboard.writeText(window.location.href);
            this.showToast('Link copied to clipboard', 'success');
        }
    }
    
    saveToHistory(params, images) {
        const historyEntry = {
            id: Date.now().toString(),
            timestamp: Date.now(),
            ...params,
            images: images
        };
        
        this.history.unshift(historyEntry);
        
        // Keep only last 50 entries
        if (this.history.length > 50) {
            this.history = this.history.slice(0, 50);
        }
        
        this.saveHistory();
    }
    
    loadHistory() {
        try {
            const stored = localStorage.getItem('raj-image-history');
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Error loading history:', error);
            return [];
        }
    }
    
    saveHistory() {
        try {
            localStorage.setItem('raj-image-history', JSON.stringify(this.history));
        } catch (error) {
            console.error('Error saving history:', error);
        }
    }
    
    generateRandomSeed() {
        const seed = Math.floor(Math.random() * 1000000);
        document.getElementById('seed').value = seed;
    }
    
    setGeneratingState(generating) {
        this.isGenerating = generating;
        const btn = document.getElementById('generateBtn');
        const text = document.getElementById('generateText');
        const loader = document.getElementById('generateLoader');
        
        if (generating) {
            btn.disabled = true;
            text.textContent = 'Generating...';
            loader.classList.remove('hidden');
        } else {
            btn.disabled = false;
            text.textContent = 'Generate Images';
            loader.classList.add('hidden');
        }
    }
    
    undo() {
        // Placeholder for undo functionality
        this.showToast('Undo not implemented yet', 'error');
    }
    
    redo() {
        // Placeholder for redo functionality
        this.showToast('Redo not implemented yet', 'error');
    }
    
    showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.className = `toast ${type}`;
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
}

// Initialize the application
const imageGenerator = new ImageGenerator();
