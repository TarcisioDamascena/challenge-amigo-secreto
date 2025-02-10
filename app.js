class FriendSelector {
    constructor() {
        this.friends = new Set();
        this.selectedFriends = new Set();
        this.bindElements();
        this.attachEventListeners();
    }

    bindElements() {
        this.elements = {
            friendInput: document.getElementById('friendInput'),
            friendsList: document.getElementById('friendsList'),
            drawResult: document.getElementById('drawResult'),
            addButton: document.getElementById('addButton'),
            drawButton: document.getElementById('drawButton')
        };
    }

    attachEventListeners() {
        this.elements.addButton?.addEventListener('click', () => this.addFriend());
        this.elements.drawButton?.addEventListener('click', () => this.drawFriend());
        this.elements.friendInput?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
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

            if (this.friends.has(name.toLowerCase())) {
                throw new Error('Este amigo já foi adicionado.');
            }

            this.friends.add(name.toLowerCase());
            this.updateFriendsList();
            this.elements.friendInput.value = '';
            this.elements.friendInput.focus();

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

        Array.from(this.friends).sort().forEach(friend => {
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
        li.textContent = text.charAt(0).toUpperCase() + text.slice(1);
        return li;
    }

    createDeleteButton(friend) {
        const button = document.createElement('button');
        button.textContent = '×';
        button.className = 'delete-btn';
        button.setAttribute('aria-label', `Remover ${friend}`);
        button.addEventListener('click', () => {
            this.friends.delete(friend);
            this.selectedFriends.delete(friend);
            this.updateFriendsList();
        });
        return button;
    }

    updateResult(friend) {
        if (!this.elements.drawResult) return;

        const resultText = friend.charAt(0).toUpperCase() + friend.slice(1);
        this.elements.drawResult.textContent = resultText;
        this.elements.drawResult.setAttribute('aria-label', `Amigo sorteado: ${resultText}`);
    }

    showError(message) {

        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        errorDiv.setAttribute('role', 'alert');

        const container = this.elements.friendInput.parentElement;
        container.insertBefore(errorDiv, this.elements.friendInput);

        setTimeout(() => errorDiv.remove(), 3000);
    }
}

document.addEventListener('DOMContentLoaded', () => new FriendSelector());