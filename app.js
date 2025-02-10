class FriendSelector {
    constructor() {
        this.friends = new Set();
        this.bindElements();
        this.attachEventListeners();
    }

    bindElements() {
        this.friendInput = document.getElementById('friendInput');
        this.friendsList = document.getElementById('friendsList');
        this.resultElement = document.getElementById('drawButton');
    }

    attachEventListeners() {
        const addButton = document.getElementById('addButton');
        const drawButton = document.getElementById('drawButton');

        addButton?.addEventListener('click', () => this.addFriend());
        drawButton?.addEventListener('click', () => this.drawFriend());

        // Handle Enter key
        this.friendInput?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addFriend();
        });
    }

    addFriend() {
        try {
            const name = this.friendInput?.value.trim();

            if (!name) {
                throw new Error('Por favor, insira um nome.');
            }

            if (this.friends.has(name)) {
                throw new Error('Este amigo já foi adicionado.');
            }

            this.friends.add(name);
            this.updateFriendsList();
            this.friendInput.value = '';

        } catch (error) {
            this.showError(error.message);
        }
    }

    drawFriend() {
        try {
            if (this.friends.size < 2) {
                throw new Error('Por favor, adicione pelo menos dois amigos.');
            }

            const friendsArray = Array.from(this.friends);
            const selectedFriend = friendsArray[Math.floor(Math.random() * friendsArray.length)];

            this.updateResult(selectedFriend);

        } catch (error) {
            this.showError(error.message);
        }
    }

    updateFriendsList() {
        if (!this.friendsList) return;

        const fragment = document.createDocumentFragment();

        this.friends.forEach(friend => {
            const li = this.createListItem(friend);
            const deleteButton = this.createDeleteButton(friend);

            li.appendChild(deleteButton);
            fragment.appendChild(li);
        });

        this.friendsList.innerHTML = '';
        this.friendsList.appendChild(fragment);
    }

    createListItem(text) {
        const li = document.createElement('li');
        li.textContent = text;
        return li;
    }

    createDeleteButton(friend) {
        const button = document.createElement('button');
        button.textContent = '×';
        button.className = 'delete-btn';
        button.addEventListener('click', () => {
            this.friends.delete(friend);
            this.updateFriendsList();
        });
        return button;
    }

    updateResult(friend) {
        if (!this.resultElement) return;

        const li = this.createListItem(friend);
        this.resultElement.innerHTML = '';
        this.resultElement.appendChild(li);
    }

    showError(message) {
        alert(message);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => new FriendSelector());