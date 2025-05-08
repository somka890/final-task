document.addEventListener('DOMContentLoaded', function () {
    const notesList = document.getElementById('notes-list');
    const searchInput = document.getElementById('search-input');
    const tagFilter = document.getElementById('tag-filter');
    const addNoteBtn = document.getElementById('add-note-btn');
    const noNotesMessage = document.getElementById('no-notes-message');

    const notePopup = document.getElementById('note-popup');
    const closePopupBtn = document.getElementById('close-popup-btn');
    const noteForm = document.getElementById('note-form');
    const deletePopup = document.getElementById('delete-popup');
    const cancelDeleteBtn = document.getElementById('cancel-delete-btn');
    const confirmDeleteBtn = document.getElementById('confirm-delete-btn');

    let notes = JSON.parse(localStorage.getItem('notes')) || [];
    let noteToDeleteId = null;

    function getTagLabel(tag) {
        const labels = {
            work: '<i class="fa fa-briefcase"></i> Work',
            personal: '<i class="fa fa-user"></i> Personal',
            ideas: '<i class="fa fa-lightbulb"></i> Ideas',
            reminders: '<i class="fa fa-bell"></i> Reminders',
        };
        return labels[tag] || tag;
    }

    function renderNotes(filteredNotes = notes) {
        notesList.innerHTML = '';
        filteredNotes.forEach((note, index) => {
            const card = document.createElement('div');
            card.className = `note-card ${note.tag}`;
            card.innerHTML = `
                <div class="note-header">
                    <h3 class="note-title">${note.title}</h3>
                    <div class="note-actions">
                        <button class="delete-btn" data-id="${index}"><i class="fas fa-trash"></i></button>
                    </div>
                </div>
                <p class="note-text">${note.content}</p>
                <div class="note-footer">
                    <span class="note-tag ${note.tag}">${getTagLabel(note.tag)}</span>
                    <span class="note-date">${formatDate(note.date)}</span>
                </div>
            `;
            notesList.appendChild(card);
        });

        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                noteToDeleteId = parseInt(btn.getAttribute('data-id'));
                deletePopup.classList.add('active');
            });
        });

        noNotesMessage.style.display = filteredNotes.length === 0 ? 'block' : 'none';
    }

    function formatDate(dateStr) {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    function filterNotes() {
        const search = searchInput.value.toLowerCase();
        const tag = tagFilter.value;

        let filtered = notes.filter(note =>
            note.title.toLowerCase().includes(search) ||
            note.content.toLowerCase().includes(search)
        );

        if (tag !== 'all') {
            filtered = filtered.filter(note => note.tag === tag);
        }

        renderNotes(filtered);
    }

    addNoteBtn.addEventListener('click', () => {
        notePopup.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    closePopupBtn.addEventListener('click', () => {
        notePopup.classList.remove('active');
        document.body.style.overflow = 'auto';
        noteForm.reset();
    });

    cancelDeleteBtn.addEventListener('click', () => {
        deletePopup.classList.remove('active');
        noteToDeleteId = null;
    });

    confirmDeleteBtn.addEventListener('click', () => {
        if (noteToDeleteId !== null) {
            notes.splice(noteToDeleteId, 1);
            saveNotes();
            renderNotes();
            updateEmptyState();
            filterNotes();
            deletePopup.classList.remove('active');
            noteToDeleteId = null;
        }
    });

    noteForm.addEventListener('submit', e => {
        e.preventDefault();
        const title = document.getElementById('note-title').value;
        const content = document.getElementById('note-content').value;
        const tag = document.querySelector('input[name="noteTag"]:checked').value;

        const newNote = {
            title,
            content,
            tag,
            date: new Date().toISOString()
        };

        notes.unshift(newNote);
        saveNotes();
        renderNotes();
        noteForm.reset();
        notePopup.classList.remove('active');
        document.body.style.overflow = 'auto';
    });

    function saveNotes() {
        localStorage.setItem('notes', JSON.stringify(notes));
    }

    function updateEmptyState(notesToCheck = notes) {
        noNotesMessage.style.display = notesToCheck.length === 0 ? 'block' : 'none';
    }

    searchInput.addEventListener('input', filterNotes);
    tagFilter.addEventListener('change', filterNotes);

    renderNotes();
});
