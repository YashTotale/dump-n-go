const notesDiv = document.getElementById("notes");
const dumpArea = document.getElementById("dumpArea");
dumpArea.focus();
const createNoteElement = (note) => {
  const noteItem = document.createElement("div");
  noteItem.innerHTML = note;

  const buttonGroup = document.createElement("div");
  buttonGroup.className = "d-flex flex-row";
  buttonGroup.appendChild(createButton("Copy", () => copyNote(note)));
  buttonGroup.appendChild(createButton("Delete", () => deleteNote(note)));

  const noteDiv = document.createElement("div");
  noteDiv.className =
    "d-flex flex-row align-items-center alert alert-dark justify-content-between";
  noteDiv.appendChild(noteItem);
  noteDiv.appendChild(buttonGroup);
  notesDiv.appendChild(noteDiv);
};
chrome.storage.sync.get("notes", ({ notes = [] }) => {
  notes.forEach((note) => {
    createNoteElement(note);
  });
});

const createButton = (name, onclickFunc) => {
  const btn = document.createElement("button");
  btn.innerHTML = name;
  btn.onclick = onclickFunc;
  btn.className = "btn btn-light mx-2";
  return btn;
};

const copyNote = (note) => {
  console.log(`copying ${note}`);
};

const deleteNote = (note) => {
  console.log(`deleting ${note}`);
};

const saveNote = (e) => {
  const newNote = e.target.value;
  if (!newNote.replace(/\s/g, "").length) {
    return;
  }
  chrome.storage.sync.get("notes", ({ notes }) => {
    const newNotes = notes.concat(newNote);
    chrome.storage.sync.set({ notes: newNotes }, () => {
      createNoteElement(newNote);
      dumpArea.value = "";
    });
  });
};
dumpArea.onblur = saveNote;
dumpArea.onkeypress = (e) => {
  var key = window.event.keyCode;
  // If the user has pressed enter
  if (key === 13 && !e.shiftKey) {
    saveNote(e);
  }
};
