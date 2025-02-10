class FriendSelector {
    constructor() {
        this.friends = new Set();
        this.selectedFriends = new Set(); // Track previously selected friends
        this.bindElements();
        this.attachEventListeners();
    }

    bindElements() {
        this.elements = {
            friendInput: document.getElementById('friendInput'),
            friendsList: document.getElementById('friendsList'),
            drawResult: document.getElementById('drawResult'), // Fixed: Changed from drawButton to drawResult
            addButton: document.getElementById('addButton'),
            drawButton: document.getElementById('drawButton')
        };
    }

    attachEventListeners() {
        // Use optional chaining with the elements object
        this.elements.addButton?.addEventListener('click', () => this.addFriend());
        this.elements.drawButton?.addEventListener('click', () => this.drawFriend());
        this.elements.friendInput?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault(); // Prevent form submission
                this.addFriend();
            }
        });
    }

    addFriend() {
        try {
            const name = this.elements.friendInput?.value.trim();

            if (!name) {
                throw new Error('Por favor, insira um nome.');
            }

            if (this.friends.has(name.toLowerCase())) { // Case-insensitive comparison
                throw new Error('Este amigo já foi adicionado.');
            }

            this.friends.add(name.toLowerCase()); // Store lowercase version
            this.updateFriendsList();
            this.elements.friendInput.value = '';
            this.elements.friendInput.focus(); // Improve UX by focusing input after adding

        } catch (error) {
            this.showError(error.message);
        }
    }

    drawFriend() {
        try {
            if (this.friends.size < 2) {
                throw new Error('Por favor, adicione pelo menos dois amigos.');
            }

            const availableFriends = Array.from(this.friends)
                .filter(friend => !this.selectedFriends.has(friend));

            // Reset selections if all friends have been drawn
            if (availableFriends.length === 0) {
                this.selectedFriends.clear();
                availableFriends.push(...this.friends);
            }

            const selectedFriend = availableFriends[Math.floor(Math.random() * availableFriends.length)];
            this.selectedFriends.add(selectedFriend);

            this.updateResult(selectedFriend);

        } catch (error) {
            this.showError(error.message);
        }
    }

    updateFriendsList() {
        if (!this.elements.friendsList) return;

        const fragment = document.createDocumentFragment();

        Array.from(this.friends).sort().forEach(friend => { // Sort names alphabetically
            const li = this.createListItem(friend);
            const deleteButton = this.createDeleteButton(friend);

            li.appendChild(deleteButton);
            fragment.appendChild(li);
        });

        this.elements.friendsList.innerHTML = '';
        this.elements.friendsList.appendChild(fragment);
    }

    createListItem(text) {
        const li = document.createElement('li');
        li.textContent = text.charAt(0).toUpperCase() + text.slice(1); // Capitalize first letter
        return li;
    }

    createDeleteButton(friend) {
        const button = document.createElement('button');
        button.textContent = '×';
        button.className = 'delete-btn';
        button.setAttribute('aria-label', `Remover ${friend}`); // Improve accessibility
        button.addEventListener('click', () => {
            this.friends.delete(friend);
            this.selectedFriends.delete(friend); // Remove from selected friends if present
            this.updateFriendsList();
        });
        return button;
    }

    updateResult(friend) {
        if (!this.elements.drawResult) return;

        const resultText = friend.charAt(0).toUpperCase() + friend.slice(1); // Capitalize first letter
        this.elements.drawResult.textContent = resultText;
        this.elements.drawResult.setAttribute('aria-label', `Amigo sorteado: ${resultText}`);
    }

    showError(message) {
        // Create and show a custom error message element instead of using alert
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        errorDiv.setAttribute('role', 'alert');

        const container = this.elements.friendInput.parentElement;
        container.insertBefore(errorDiv, this.elements.friendInput);

        // Remove error message after 3 seconds
        setTimeout(() => errorDiv.remove(), 3000);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => new FriendSelector());