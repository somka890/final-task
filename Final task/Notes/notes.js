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
  const editPopup = document.getElementById('edit-popup');
  const cancelEditBtn = document.getElementById('cancel-edit-btn');
  const confirmEditBtn = document.getElementById('confirm-edit-btn');

  // pasiima uzrasus is localStorage
  let notes = JSON.parse(localStorage.getItem('notes')) || [];
  let noteToDeleteId = null;
  let editingNoteId = null;

  // prideda taga
  function getTagLabel(tag) {
    const labels = {
      work: '<i class="fa fa-briefcase"></i> Work',
      personal: '<i class="fa fa-user"></i> Personal',
      ideas: '<i class="fa fa-lightbulb"></i> Ideas',
      reminders: '<i class="fa fa-bell"></i> Reminders',
    };
    return labels[tag] || tag;
  }

  // datos formatas
  function formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // rodo uzrasus
  function renderNotes(filtered = notes) {
    notesList.innerHTML = '';

    filtered.forEach((note, i) => {
      // sukuria kortele
      const card = document.createElement('div');
      card.className = `note-card ${note.tag}`;
      card.innerHTML = `
        <div class="note-header">
          <h3 class="note-title">${note.title}</h3>
          <div class="note-actions">
            <button class="action-btn edit-btn" data-id="${i}"><i class="fas fa-edit"></i></button>
            <button class="action-btn delete-btn" data-id="${i}"><i class="fas fa-trash"></i></button>
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

    // trynimo popup
    notesList.querySelectorAll('.note-actions .delete-btn')
      .forEach(btn => btn.addEventListener('click', () => {
        noteToDeleteId = +btn.dataset.id;
        deletePopup.classList.add('active');
        document.body.style.overflow = 'hidden';
      }));

    // redagavimo popup
    notesList.querySelectorAll('.note-actions .edit-btn')
      .forEach(btn => btn.addEventListener('click', () => {
        editingNoteId = +btn.dataset.id;
        editPopup.classList.add('active');
        document.body.style.overflow = 'hidden';
      }));

    // rodo pranesima jei nera uzrasu
    noNotesMessage.style.display = filtered.length ? 'none' : 'block';
  }

  // filtruoja pagal paieska ir taga
  function filterNotes() {
    const q = searchInput.value.toLowerCase();
    const t = tagFilter.value;
    let result = notes.filter(n =>
      n.title.toLowerCase().includes(q) ||
      n.content.toLowerCase().includes(q)
    );
    if (t !== 'all') result = result.filter(n => n.tag === t);
    renderNotes(result);
  }

  // issaugo i localStorage
  function saveNotes() {
    localStorage.setItem('notes', JSON.stringify(notes));
  }

  // atidaro popup naujam uzrasui
  addNoteBtn.addEventListener('click', () => {
    editingNoteId = null;
    noteForm.reset();
    notePopup.querySelector('.popup-title').textContent = 'New Note';
    notePopup.classList.add('active');
    document.body.style.overflow = 'hidden';
  });

  // uzdaro popup
  closePopupBtn.addEventListener('click', () => {
    notePopup.classList.remove('active');
    document.body.style.overflow = 'auto';
    editingNoteId = null;
  });

  // atsaukia trynima
  cancelDeleteBtn.addEventListener('click', () => {
    deletePopup.classList.remove('active');
    document.body.style.overflow = 'auto';
    noteToDeleteId = null;
  });

  // patvirtina trynima
  confirmDeleteBtn.addEventListener('click', () => {
    if (noteToDeleteId !== null) {
      deletePopup.classList.remove('active');
      notes.splice(noteToDeleteId, 1);
      saveNotes();
      filterNotes();
      noteToDeleteId = null;
      document.body.style.overflow = 'auto';
    }
  });

  // atsaukia redagavima
  cancelEditBtn.addEventListener('click', () => {
    editPopup.classList.remove('active');
    document.body.style.overflow = 'auto';
    editingNoteId = null;
  });

  // atidaro redagavimo langa
  confirmEditBtn.addEventListener('click', () => {
    if (editingNoteId !== null) {
      editPopup.classList.remove('active');
      const n = notes[editingNoteId];
      document.getElementById('note-title').value = n.title;
      document.getElementById('note-content').value = n.content;
      document.querySelector(`input[name="noteTag"][value="${n.tag}"]`).checked = true;
      notePopup.querySelector('.popup-title').textContent = 'Edit Note';
      notePopup.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  });

  // prideda nauja uzrasa arba redaguoja esama
  noteForm.addEventListener('submit', e => {
    e.preventDefault();
    const title = document.getElementById('note-title').value;
    const content = document.getElementById('note-content').value;
    const tag = document.querySelector('input[name="noteTag"]:checked').value;
    const payload = { title, content, tag, date: new Date().toISOString() };

    if (editingNoteId !== null) {
      notes[editingNoteId] = payload;
    } else {
      notes.unshift(payload);
    }

    saveNotes();
    filterNotes();

    notePopup.classList.remove('active');
    document.body.style.overflow = 'auto';
    editingNoteId = null;
    noteForm.reset();
    notePopup.querySelector('.popup-title').textContent = 'New Note';
  });

  // iesko pagal teksta
  searchInput.addEventListener('input', filterNotes);
  // filtruoja pagal taga
  tagFilter.addEventListener('change', filterNotes);


  renderNotes();
});
