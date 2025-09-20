const teams = [];
let participants = [];
let draftStarted = false;

let draftOrder = [];
let draftIndex = 0;

function createTeam(teamName) {
    if (teamName) {
        teams.push({ name: teamName, members: [] });
        updateTeamList();
        updateStartDraftButton();
    }
}

function addParticipant(participantName) {
    if (participantName) {
        participants.push(participantName);
        updateParticipantList();
        updateStartDraftButton();
    }
}

function startDraft() {
    if (teams.length < 2 || participants.length < 2) {
        alert("At least 2 teams and 2 participants are required to start the draft.");
        return;
    }
    draftStarted = true;

    // Clear previous members
    teams.forEach(team => team.members = []);

    // Shuffle participants for fairness
    draftOrder = shuffleArray(participants.slice());
    draftIndex = 0;

    // Hide editing controls
    disableEditing();

    // Show draft progress UI
    document.getElementById("draftProgress").style.display = "block";
    document.getElementById("nextPickBtn").disabled = false;

    updateDraftBoard();
    updateDraftStatus();
    updateParticipantList();
    updateStartDraftButton();
}

function nextPick() {
    if (draftIndex >= draftOrder.length) return;

    const teamCount = teams.length;
    const teamIdx = draftIndex % teamCount;
    const participant = draftOrder[draftIndex];

    teams[teamIdx].members.push(participant);

    draftIndex++;
    updateDraftBoard();
    updateDraftStatus();
    updateParticipantList();

    if (draftIndex >= draftOrder.length) {
        document.getElementById("nextPickBtn").disabled = true;
        document.getElementById("draftStatus").innerHTML += "<br><strong>Draft complete!</strong>";
    }
}

function updateDraftBoard() {
    const teamList = document.getElementById("teamsList");
    teamList.innerHTML = teams.map((team, idx) =>
        `<li>
            <strong>${team.name}</strong>
            <ul>${team.members.map(member => `<li>${member}</li>`).join("")}</ul>
        </li>`
    ).join("");
}

function updateDraftStatus() {
    if (draftIndex >= draftOrder.length) return;
    const teamCount = teams.length;
    const round = Math.floor(draftIndex / teamCount) + 1;
    const teamTurn = teams[draftIndex % teamCount].name;
    const nextParticipant = draftOrder[draftIndex];

    document.getElementById("draftStatus").innerHTML =
        `<strong>Round:</strong> ${round} &nbsp; 
         <strong>Team's Turn:</strong> ${teamTurn} &nbsp; 
         <strong>Next Pick:</strong> ${nextParticipant}`;
}

function updateParticipantList() {
    // Show only remaining participants during draft, all before draft
    const participantList = document.getElementById("participantsList");
    if (draftStarted) {
        const remaining = draftOrder.slice(draftIndex);
        participantList.innerHTML = remaining.map(participant => `
            <li>
                <span>${participant}</span>
            </li>
        `).join("");
    } else {
        participantList.innerHTML = participants.map((participant, idx) => `
            <li>
                <span class="participant-name" data-index="${idx}">${participant}</span>
                <button class="edit-participant" data-index="${idx}">Edit</button>
                <button class="delete-participant" data-index="${idx}">Delete</button>
            </li>
        `).join("");
        addParticipantListListeners();
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function updateTeamList() {
    const teamList = document.getElementById("teamsList");
    if (!draftStarted) {
        teamList.innerHTML = teams.map((team, idx) => `
            <li>
                <span class="team-name" data-index="${idx}">${team.name}</span>
                <button class="edit-team" data-index="${idx}">Edit</button>
                <button class="delete-team" data-index="${idx}">Delete</button>
            </li>
        `).join("");
        addTeamListListeners();
    } else {
        updateDraftBoard();
    }
}

function addTeamListListeners() {
    document.querySelectorAll('.edit-team').forEach(btn => {
        btn.onclick = function() {
            const idx = +this.dataset.index;
            const newName = prompt("Edit team name:", teams[idx].name);
            if (newName && newName.trim()) {
                teams[idx].name = newName.trim();
                updateTeamList();
                updateStartDraftButton();
            }
        };
    });
    document.querySelectorAll('.delete-team').forEach(btn => {
        btn.onclick = function() {
            const idx = +this.dataset.index;
            if (confirm(`Delete team "${teams[idx].name}"?`)) {
                teams.splice(idx, 1);
                updateTeamList();
                updateStartDraftButton();
            }
        };
    });
}

function addParticipantListListeners() {
    document.querySelectorAll('.edit-participant').forEach(btn => {
        btn.onclick = function() {
            const idx = +this.dataset.index;
            const newName = prompt("Edit participant name:", participants[idx]);
            if (newName && newName.trim()) {
                participants[idx] = newName.trim();
                updateParticipantList();
                updateStartDraftButton();
            }
        };
    });
    document.querySelectorAll('.delete-participant').forEach(btn => {
        btn.onclick = function() {
            const idx = +this.dataset.index;
            if (confirm(`Delete participant "${participants[idx]}"?`)) {
                participants.splice(idx, 1);
                updateParticipantList();
                updateStartDraftButton();
            }
        };
    });
}

function disableEditing() {
    document.getElementById("addTeam").disabled = true;
    document.getElementById("teamName").disabled = true;
    document.getElementById("addParticipant").disabled = true;
    document.getElementById("participantName").disabled = true;
}

function updateStartDraftButton() {
    const btn = document.getElementById("startDraft");
    btn.disabled = (teams.length < 2 || participants.length < 2 || draftStarted);
}

function restartDraft() {
    // Reset all state
    teams.length = 0;
    participants.length = 0;
    draftStarted = false;
    draftOrder = [];
    draftIndex = 0;

    // Hide draft progress UI
    document.getElementById("draftProgress").style.display = "none";

    // Enable editing controls
    document.getElementById("addTeam").disabled = false;
    document.getElementById("teamName").disabled = false;
    document.getElementById("addParticipant").disabled = false;
    document.getElementById("participantName").disabled = false;

    // Clear inputs
    document.getElementById("teamName").value = "";
    document.getElementById("participantName").value = "";

    // Reset lists and status
    updateTeamList();
    updateParticipantList();
    document.getElementById("draftStatus").innerHTML = "";

    updateStartDraftButton();
}

// Event listeners
document.getElementById("addTeam").addEventListener("click", function() {
    const teamName = document.getElementById("teamName").value;
    createTeam(teamName);
    document.getElementById("teamName").value = "";
});

document.getElementById("addParticipant").addEventListener("click", function() {
    const participantName = document.getElementById("participantName").value;
    addParticipant(participantName);
    document.getElementById("participantName").value = "";
});

document.getElementById("startDraft").addEventListener("click", startDraft);
document.getElementById("nextPickBtn").addEventListener("click", nextPick);
document.getElementById("restartDraftBtn").addEventListener("click", restartDraft);

// Initial render
updateTeamList();
updateParticipantList();
updateStartDraftButton();