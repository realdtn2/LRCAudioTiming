(function (w, d) {
    'use strict';

    var LRCTimer = {
        isVisible: false,
        currentLRC: null,
        currentTime: '00:00.000',
        selectedLineIndex: -1, // Track which line is currently selected
        customOffset: -100, // Default offset in milliseconds
        
        init: function() {
            this.createFloatingButton();
            this.createModal();
            this.bindEvents();
        },

        createFloatingButton: function() {
            var button = d.createElement('div');
            button.id = 'lrc-timer-button';
            button.innerHTML = '⏱️';
            button.title = 'LRC Timer';
            button.className = 'lrc-timer-button';
            
            d.body.appendChild(button);
        },

        createModal: function() {
            var modal = d.createElement('div');
            modal.id = 'lrc-timer-modal';
            modal.className = 'lrc-timer-modal';
            modal.style.display = 'none';
            
            modal.innerHTML = `
                <div class="lrc-timer-content">
                    <div class="lrc-timer-header">
                        <h3>LRC Timer</h3>
                        <button class="lrc-timer-close">&times;</button>
                    </div>
                    <div class="lrc-timer-body">
                        <div class="lrc-timer-controls">
                            <input type="file" id="lrc-file-input" accept=".lrc,.txt" style="display: none;">
                            <button id="load-lrc-btn" class="lrc-btn">Load LRC File</button>
                            <button id="export-lrc-btn" class="lrc-btn" disabled>Export Normal</button>
                            <button id="export-starmaker-btn" class="lrc-btn" disabled>Export Starmaker</button>
                            <button id="clear-lrc-btn" class="lrc-btn" disabled>Clear</button>
                        </div>
                        <div class="lrc-timer-offset">
                            <label for="custom-offset">Custom Offset (ms):</label>
                            <input type="number" id="custom-offset" value="-100" min="-10000" max="10000" step="1">
                            <button id="help-btn" class="lrc-help-btn" title="Help">?</button>
                        </div>
                        <div class="lrc-timer-display">
                            <div class="current-time">Current Time: <span id="current-time-display">00:00.000</span></div>
                            <div class="lrc-info" id="lrc-info" style="display: none;">
                                <span id="lrc-stats"></span>
                            </div>
                            <div class="lrc-lines" id="lrc-lines"></div>
                        </div>
                    </div>
                </div>
            `;
            
            d.body.appendChild(modal);
        },

        createHelpModal: function() {
            var helpModal = d.createElement('div');
            helpModal.id = 'lrc-help-modal';
            helpModal.className = 'lrc-help-modal';
            helpModal.style.display = 'none';
            
            helpModal.innerHTML = `
                <div class="lrc-help-content">
                    <div class="lrc-help-header">
                        <h3>LRC Timer Help</h3>
                        <button class="lrc-help-close">&times;</button>
                    </div>
                    <div class="lrc-help-body">
                        <h4>How to Use:</h4>
                        <ol>
                            <li><strong>Load LRC File:</strong> Click to select an untimed LRC file (.lrc or .txt)</li>
                            <li><strong>Select Line:</strong> Click on any lyric line to select it (it will be highlighted)</li>
                            <li><strong>Set Timing:</strong> Use AudioMass controls to navigate to the exact timing position</li>
                            <li><strong>Timestamp:</strong> Press 'T' to timestamp the selected line with current position + offset</li>
                            <li><strong>Auto-advance:</strong> System automatically selects the next line (you can re-time already timed lines)</li>
                        </ol>
                        
                        <h4>Custom Offset:</h4>
                        <p>Adjust the timing offset in milliseconds. The default and recommended value is -100ms to help you automatically time it perfectly for singing. You should time it right when the lyric should start singing (subtracts 100ms from the current time).</p>
                        <ul>
                            <li><strong>Negative values:</strong> Subtract time (e.g., -100ms = 0.1 seconds earlier)</li>
                            <li><strong>Positive values:</strong> Add time (e.g., +100ms = 0.1 seconds later)</li>
                        </ul>
                        
                        <h4>Export Options:</h4>
                        <ul>
                            <li><strong>Export Normal:</strong> Standard LRC format with timestamps</li>
                            <li><strong>Export Starmaker:</strong> Adds +260ms to all lines except the first line, needed due to a quirk of Starmaker</li>
                        </ul>
                        
                        <h4>Keyboard Shortcuts:</h4>
                        <ul>
                            <li><strong>T:</strong> Timestamp the currently selected line</li>
                        </ul>
                    </div>
                </div>
            `;
            
            d.body.appendChild(helpModal);
        },

        bindEvents: function() {
            var self = this;
            
            // Floating button click - toggle functionality
            d.getElementById('lrc-timer-button').addEventListener('click', function() {
                self.toggleModal();
            });
            
            // Close button
            d.querySelector('.lrc-timer-close').addEventListener('click', function() {
                self.hideModal();
            });
            
            // Load LRC button
            d.getElementById('load-lrc-btn').addEventListener('click', function() {
                d.getElementById('lrc-file-input').click();
            });
            
            // File input change
            d.getElementById('lrc-file-input').addEventListener('change', function(e) {
                if (e.target.files.length > 0) {
                    self.loadLRCFile(e.target.files[0]);
                }
            });
            
            // Export Normal button
            d.getElementById('export-lrc-btn').addEventListener('click', function() {
                self.exportTimedLRC('normal');
            });
            
            // Export Starmaker button
            d.getElementById('export-starmaker-btn').addEventListener('click', function() {
                self.exportTimedLRC('starmaker');
            });
            
            // Clear button
            d.getElementById('clear-lrc-btn').addEventListener('click', function() {
                self.clearLRC();
            });
            
            // Help button
            d.getElementById('help-btn').addEventListener('click', function() {
                self.showHelpModal();
            });
            
            // Help modal close button
            d.addEventListener('click', function(e) {
                if (e.target.classList.contains('lrc-help-close')) {
                    self.hideHelpModal();
                }
            });
            
            // Custom offset input
            d.getElementById('custom-offset').addEventListener('input', function(e) {
                self.customOffset = parseInt(e.target.value) || 0;
            });
            
            // Keyboard shortcuts
            d.addEventListener('keydown', function(e) {
                if (self.isVisible && e.key.toLowerCase() === 't') {
                    self.timestampSelectedLine();
                }
            });
            
            // Update current time display
            this.startTimeUpdate();
            
            // Create help modal
            this.createHelpModal();
        },

        toggleModal: function() {
            if (this.isVisible) {
                this.hideModal();
            } else {
                this.showModal();
            }
        },

        showModal: function() {
            this.isVisible = true;
            d.getElementById('lrc-timer-modal').style.display = 'block';
            this.updateTimeDisplay();
        },

        hideModal: function() {
            this.isVisible = false;
            d.getElementById('lrc-timer-modal').style.display = 'none';
            this.selectedLineIndex = -1; // Reset selection
        },

        showHelpModal: function() {
            d.getElementById('lrc-help-modal').style.display = 'block';
        },

        hideHelpModal: function() {
            d.getElementById('lrc-help-modal').style.display = 'none';
        },

        loadLRCFile: function(file) {
            var self = this;
            var reader = new FileReader();
            
            reader.onload = function(e) {
                var content = e.target.result;
                self.parseLRCContent(content);
            };
            
            reader.onerror = function() {
                // Silent error handling
            };
            
            reader.readAsText(file);
        },

        parseLRCContent: function(content) {
            var lines = content.split('\n');
            var lrcLines = [];
            
            lines.forEach(function(line, index) {
                line = line.trim();
                if (line) {
                    // Remove existing timestamps if present
                    var cleanLine = line.replace(/\[\d{2}:\d{2}\.\d{2,3}\]/g, '').trim();
                    if (cleanLine) {
                        lrcLines.push({
                            index: index,
                            text: cleanLine,
                            timestamp: null,
                            original: line
                        });
                    }
                }
            });
            
            if (lrcLines.length === 0) {
                return;
            }
            
            this.currentLRC = lrcLines;
            this.selectedLineIndex = 0; // Auto-select first line
            this.displayLRCLines();
            this.updateStats();
            d.getElementById('export-lrc-btn').disabled = false;
            d.getElementById('export-starmaker-btn').disabled = false;
            d.getElementById('clear-lrc-btn').disabled = false;
            d.getElementById('lrc-info').style.display = 'block';
        },

        displayLRCLines: function() {
            var container = d.getElementById('lrc-lines');
            container.innerHTML = '';
            
            if (!this.currentLRC) return;
            
            console.log('Displaying LRC lines:', this.currentLRC.length);
            
            // Ensure container has proper styling
            container.style.display = 'block';
            container.style.overflowY = 'auto';
            container.style.maxHeight = '300px';
            container.style.position = 'relative';
            
            var self = this;
            this.currentLRC.forEach(function(line, index) {
                var lineElement = d.createElement('div');
                lineElement.className = 'lrc-line';
                
                // Add appropriate classes
                if (line.timestamp) {
                    lineElement.classList.add('lrc-line-timed');
                }
                if (index === self.selectedLineIndex) {
                    lineElement.classList.add('lrc-line-selected');
                }
                
                lineElement.dataset.index = index;
                
                var timestampSpan = d.createElement('span');
                timestampSpan.className = 'lrc-timestamp';
                timestampSpan.textContent = line.timestamp ? '[' + line.timestamp + '] ' : '[--:--.---] ';
                timestampSpan.style.marginRight = '8px';
                
                var textSpan = d.createElement('span');
                textSpan.className = 'lrc-text';
                textSpan.textContent = line.text;
                
                lineElement.appendChild(timestampSpan);
                lineElement.appendChild(textSpan);
                
                // Add click event to select the line
                lineElement.addEventListener('click', function() {
                    self.selectLine(index);
                });
                
                container.appendChild(lineElement);
            });
            
            // Force a reflow to ensure proper rendering
            setTimeout(function() {
                void container.offsetHeight;
                console.log('Container measurements after render:', {
                    scrollHeight: container.scrollHeight,
                    clientHeight: container.clientHeight,
                    offsetHeight: container.offsetHeight
                });
                
                // If a line is selected, scroll to it
                if (self.selectedLineIndex !== -1) {
                    self.autoScrollToLine(self.selectedLineIndex);
                }
            }, 50);
        },

        selectLine: function(index) {
            if (!this.currentLRC || index < 0 || index >= this.currentLRC.length) return;
            
            var line = this.currentLRC[index];
            
            this.selectedLineIndex = index;
            this.displayLRCLines();
            
            // Auto-scroll when halfway down visible area
            this.autoScrollToLine(index);
        },

        autoScrollToLine: function(lineIndex) {
            var container = d.getElementById('lrc-lines');
            if (!container) return;
            
            var lineElement = d.querySelector(`.lrc-line[data-index="${lineIndex}"]`);
            if (!lineElement) {
                console.error('Line element not found for index:', lineIndex);
                return;
            }
            
            console.log('Scrolling to line:', lineIndex, 'Text:', lineElement.textContent);
            
            // First, ensure the container has content and proper dimensions
            container.style.display = 'block';
            container.style.overflowY = 'auto';
            container.style.maxHeight = '300px';
            
            // Force a reflow to ensure proper rendering
            void container.offsetHeight;
            
            // Calculate the scroll position manually
            var lineTop = lineElement.offsetTop;
            var lineHeight = lineElement.offsetHeight;
            var containerHeight = container.clientHeight;
            
            // Calculate target position to center the line
            var targetScrollTop = lineTop - (containerHeight / 2) + (lineHeight / 2);
            
            // Apply boundaries
            targetScrollTop = Math.max(0, Math.min(targetScrollTop, container.scrollHeight - containerHeight));
            
            console.log('Scroll details:', {
                lineTop: lineTop,
                lineHeight: lineHeight,
                containerHeight: containerHeight,
                containerScrollHeight: container.scrollHeight,
                targetScrollTop: targetScrollTop
            });
            
            // Scroll immediately
            container.scrollTop = targetScrollTop;
        },

        updateStats: function() {
            if (!this.currentLRC) return;
            
            var total = this.currentLRC.length;
            var timed = this.currentLRC.filter(function(line) {
                return line.timestamp;
            }).length;
            
            var statsElement = d.getElementById('lrc-stats');
            statsElement.textContent = 'Lines: ' + timed + '/' + total + ' timed';
            statsElement.className = timed === total ? 'lrc-stats-complete' : 'lrc-stats-incomplete';
        },

        timestampSelectedLine: function() {
            if (!this.currentLRC || this.selectedLineIndex === -1) {
                return;
            }
            
            var line = this.currentLRC[this.selectedLineIndex];
            
            // Apply custom offset to the current time
            var adjustedTime = this.applyOffset(this.currentTime);
            line.timestamp = adjustedTime;
            
            // Auto-advance to next line
            this.advanceToNextLine();
        },

        applyOffset: function(timeString) {
            // Convert time string to milliseconds, apply offset, then convert back
            var timeInMs = this.timeStringToMs(timeString);
            var adjustedMs = timeInMs + this.customOffset;
            
            // Ensure we don't go below 0
            if (adjustedMs < 0) adjustedMs = 0;
            
            return this.msToTimeString(adjustedMs);
        },

        timeStringToMs: function(timeString) {
            // Convert [MM:SS.mmm] format to milliseconds
            var match = timeString.match(/(\d{2}):(\d{2})\.(\d{3})/);
            if (match) {
                var minutes = parseInt(match[1]);
                var seconds = parseInt(match[2]);
                var milliseconds = parseInt(match[3]);
                return (minutes * 60 + seconds) * 1000 + milliseconds;
            }
            return 0;
        },

        msToTimeString: function(milliseconds) {
            // Convert milliseconds back to [MM:SS.mmm] format
            var totalSeconds = Math.floor(milliseconds / 1000);
            var minutes = Math.floor(totalSeconds / 60);
            var seconds = totalSeconds % 60;
            var ms = milliseconds % 1000;
            
            return (minutes < 10 ? '0' : '') + minutes + ':' + 
                   (seconds < 10 ? '0' : '') + seconds + '.' + 
                   (ms < 100 ? '0' : '') + (ms < 10 ? '0' : '') + ms;
        },

        advanceToNextLine: function() {
            if (!this.currentLRC) return;
            
            // Find next line (regardless of timing status)
            var nextIndex = -1;
            for (var i = this.selectedLineIndex + 1; i < this.currentLRC.length; i++) {
                nextIndex = i;
                break;
            }
            
            // If no next line, look from the beginning
            if (nextIndex === -1) {
                for (var j = 0; j < this.selectedLineIndex; j++) {
                    nextIndex = j;
                    break;
                }
            }
            
            // Update selection and display
            this.selectedLineIndex = nextIndex;
            this.displayLRCLines();
            this.updateStats();
            
            if (nextIndex !== -1) {
                // Auto-scroll to the new selection
                this.autoScrollToLine(nextIndex);
            } else {
                this.selectedLineIndex = -1;
                this.displayLRCLines();
            }
        },

        updateTimeDisplay: function() {
            if (this.isVisible && window.PKAudioEditor && window.PKAudioEditor.engine) {
                try {
                    var currentTime = window.PKAudioEditor.engine.wavesurfer.getCurrentTime();
                    if (currentTime !== undefined && currentTime >= 0) {
                        this.currentTime = this.formatTimeForLRC(currentTime);
                        d.getElementById('current-time-display').textContent = this.currentTime;
                    }
                } catch (e) {
                    // Audio not loaded yet
                    d.getElementById('current-time-display').textContent = '--:--.---';
                }
            }
        },

        formatTimeForLRC: function(time) {
            var minutes = Math.floor(time / 60);
            var seconds = Math.floor(time % 60);
            var milliseconds = Math.floor((time % 1) * 1000);
            
            return (minutes < 10 ? '0' : '') + minutes + ':' + 
                   (seconds < 10 ? '0' : '') + seconds + '.' + 
                   (milliseconds < 100 ? '0' : '') + (milliseconds < 10 ? '0' : '') + milliseconds;
        },

        startTimeUpdate: function() {
            var self = this;
            setInterval(function() {
                self.updateTimeDisplay();
            }, 100);
        },

        exportTimedLRC: function(type) {
            if (!this.currentLRC) return;
            
            var content = '';
            this.currentLRC.forEach(function(line, index) {
                if (line.timestamp) {
                    var exportTime = line.timestamp;
                    
                    if (type === 'starmaker' && index > 0) {
                        // Add +260ms to all lines except the first
                        var timeInMs = this.timeStringToMs(line.timestamp);
                        var adjustedMs = timeInMs + 260;
                        exportTime = this.msToTimeString(adjustedMs);
                    }
                    
                    content += '[' + exportTime + '] ' + line.text + '\n';
                } else {
                    content += line.text + '\n';
                }
            }.bind(this));
            
            var filename = type === 'starmaker' ? 'timed_lyrics_starmaker.lrc' : 'timed_lyrics.lrc';
            
            var blob = new Blob([content], { type: 'text/plain' });
            var url = URL.createObjectURL(blob);
            var a = d.createElement('a');
            a.href = url;
            a.download = filename;
            d.body.appendChild(a);
            a.click();
            d.body.removeChild(a);
            URL.revokeObjectURL(url);
        },

        clearLRC: function() {
            this.currentLRC = null;
            this.selectedLineIndex = -1; // Reset selection
            this.displayLRCLines();
            this.updateStats();
            d.getElementById('export-lrc-btn').disabled = true;
            d.getElementById('export-starmaker-btn').disabled = true;
            d.getElementById('clear-lrc-btn').disabled = true;
            d.getElementById('lrc-info').style.display = 'none';
        },

        showMessage: function(message, type) {
            // Create a temporary message display
            var msgElement = d.createElement('div');
            msgElement.className = 'lrc-message lrc-message-' + type;
            msgElement.textContent = message;
            msgElement.style.cssText = `
                position: fixed;
                top: 100px;
                right: 20px;
                background: ${type === 'error' ? '#f44336' : type === 'warning' ? '#ff9800' : type === 'success' ? '#4CAF50' : '#2196F3'};
                color: white;
                padding: 10px 20px;
                border-radius: 5px;
                z-index: 10002;
                font-size: 14px;
                box-shadow: 0 4px 8px rgba(0,0,0,0.3);
                animation: slideIn 0.3s ease-out;
            `;
            
            d.body.appendChild(msgElement);
            
            setTimeout(function() {
                msgElement.style.animation = 'slideOut 0.3s ease-in';
                setTimeout(function() {
                    if (msgElement.parentNode) {
                        msgElement.parentNode.removeChild(msgElement);
                    }
                }, 300);
            }, 3000);
        }
    };

    // Add CSS animations
    var style = d.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    d.head.appendChild(style);

    // Initialize when DOM is ready
    if (d.readyState === 'loading') {
        d.addEventListener('DOMContentLoaded', function() {
            LRCTimer.init();
        });
    } else {
        LRCTimer.init();
    }

    // Make it globally accessible
    w.LRCTimer = LRCTimer;

})(window, document);
