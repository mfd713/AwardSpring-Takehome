const courses = [
  {
    id: 1,
    number: "POLI 201",
    title: "Introduction to Comparative Politics",
    professor: "Prof. Elena Rivera",
    rating: 4.7,
    recommendation: 82,
    level: "Introductory",
    description:
      "A fast-paced overview of political systems, institutions, and policy tradeoffs across democracies and authoritarian regimes.",
    fullDescription:
      "This course helps students compare governments, elections, and policy outcomes across countries. It is a strong fit for students who want a broad but analytical foundation in political science.",
    reviews: [
      { name: "Mina", text: "The discussion sections made the theory feel practical." },
      { name: "Ari", text: "Clear lectures and surprisingly manageable readings." },
    ],
    fitScore: 94,
  },
  {
    id: 2,
    number: "ECON 230",
    title: "Economics of Public Policy",
    professor: "Prof. Daniel Brooks",
    rating: 4.2,
    recommendation: 76,
    level: "Intermediate",
    description:
      "Examines how incentives shape policy decisions and how numbers influence civic outcomes.",
    fullDescription:
      "Students use simple models to explore taxation, health care, and education policy. The course is especially useful for students who enjoy connecting economics with public service.",
    reviews: [
      { name: "Jules", text: "Great balance of theory and real-world examples." },
      { name: "Noah", text: "The assignments were practical and not too overwhelming." },
    ],
    fitScore: 87,
  },
  {
    id: 3,
    number: "HIST 245",
    title: "Global Migration and Identity",
    professor: "Prof. Sofia Chen",
    rating: 4.5,
    recommendation: 79,
    level: "Intermediate",
    description:
      "Explores how migration reshapes cities, citizenship, and cultural belonging over time.",
    fullDescription:
      "This seminar blends historical case studies with contemporary debates about belonging, borders, and public memory. It is thoughtful and discussion-heavy.",
    reviews: [
      { name: "Leah", text: "The reading list was rich, but the instructor made it welcoming." },
      { name: "Bri", text: "Very strong class community and thoughtful discussion prompts." },
    ],
    fitScore: 90,
  },
  {
    id: 4,
    number: "MATH 120",
    title: "Quantitative Reasoning for Social Science",
    professor: "Prof. Talia Gomez",
    rating: 4.8,
    recommendation: 84,
    level: "Introductory",
    description:
      "Builds practical data skills for understanding trends, surveys, and policy impact.",
    fullDescription:
      "Students learn how to interpret charts, examine claims, and reason about evidence in everyday civic life. It is friendly for students who want quantitative confidence without a heavy math prerequisite.",
    reviews: [
      { name: "Sam", text: "I felt more prepared for research after this course." },
      { name: "Pia", text: "The weekly labs were the best part." },
    ],
    fitScore: 95,
  },
  {
    id: 5,
    number: "WRIT 220",
    title: "Rhetoric and Public Advocacy",
    professor: "Prof. Marcus Lewis",
    rating: 4.4,
    recommendation: 81,
    level: "Advanced",
    description:
      "Teaches persuasive communication strategies for civic, media, and nonprofit settings.",
    fullDescription:
      "This writing-intensive course helps students craft arguments that can influence decision-makers. It is ideal for students interested in campaigns, advocacy, and speaking with clarity.",
    reviews: [
      { name: "Rosa", text: "The assignments challenged me in useful ways." },
      { name: "Dev", text: "Excellent for building confidence with public speaking." },
    ],
    fitScore: 88,
  },
];

const state = {
  search: "",
  rating: 0,
  level: "all",
  sort: "recommended",
  shortlist: [],
  selected: [],
  activeCourse: null,
};

const searchInput = document.querySelector("#search-input");
const ratingFilter = document.querySelector("#rating-filter");
const levelFilter = document.querySelector("#level-filter");
const sortFilter = document.querySelector("#sort-filter");
const courseList = document.querySelector("#course-list");
const shortlistList = document.querySelector("#shortlist-list");
const selectedCourses = document.querySelector("#selected-courses");
const selectedCount = document.querySelector("#selected-count");
const spotsLeft = document.querySelector("#spots-left");
const shortlistCount = document.querySelector("#shortlist-count");
const modal = document.querySelector("#modal");
const modalContent = document.querySelector("#modal-content");

function getFilteredCourses() {
  return courses
    .filter((course) => {
      const matchesSearch = [
        course.number,
        course.title,
        course.professor,
        course.description,
      ]
        .join(" ")
        .toLowerCase()
        .includes(state.search.toLowerCase());

      const matchesRating = course.rating >= state.rating;
      const matchesLevel = state.level === "all" || course.level === state.level;
      return matchesSearch && matchesRating && matchesLevel;
    })
    .sort((a, b) => {
      if (state.sort === "az") {
        return a.title.localeCompare(b.title);
      }
      if (state.sort === "rating") {
        return b.rating - a.rating;
      }
      return b.fitScore - a.fitScore;
    });
}

function render() {
  renderCourses();
  renderShortlist();
  renderSelected();
  renderSummary();
}

function renderSummary() {
  selectedCount.textContent = `${state.selected.length} / 4`;
  spotsLeft.textContent = `${Math.max(4 - state.selected.length, 0)}`;
  shortlistCount.textContent = `${state.shortlist.length}`;
}

function renderCourses() {
  const filteredCourses = getFilteredCourses();
  if (!filteredCourses.length) {
    courseList.innerHTML = '<div class="empty-state">No courses match those filters yet.</div>';
    return;
  }

  courseList.innerHTML = filteredCourses
    .map((course) => {
      const isShortlisted = state.shortlist.includes(course.id);
      const isSelected = state.selected.includes(course.id);
      return `
        <article class="course-card" draggable="true" data-draggable-id="${course.id}">
          <button class="course-card__main" type="button" data-action="details" data-id="${course.id}">
            <div class="course-card__header">
              <div>
                <h3 class="course-card__title">${course.number} · ${course.title}</h3>
                <p class="course-card__meta">${course.professor} · ${course.level}</p>
              </div>
              <span class="badge">⭐ ${course.rating.toFixed(1)}</span>
            </div>
            <p class="course-card__description">${course.description}</p>
            <div class="course-card__stats">
              <span class="badge badge--accent">${course.recommendation}% recommend</span>
              <span class="badge">Best fit score: ${course.fitScore}</span>
            </div>
          </button>
          <div class="course-card__actions">
            <button class="btn btn--secondary" type="button" data-action="shortlist" data-id="${course.id}">
              ${isShortlisted ? "Remove shortlist" : "Add to shortlist"}
            </button>
            <button class="btn btn--primary" type="button" data-action="select" data-id="${course.id}" ${isSelected || state.selected.length >= 4 ? "disabled" : ""}>
              ${isSelected ? "Selected" : "Add to final selection"}
            </button>
          </div>
        </article>
      `;
    })
    .join("");
}

function renderSelected() {
  if (!state.selected.length) {
    selectedCourses.innerHTML = '<div class="empty-state">No classes selected yet. Start by picking a few favorites.</div>';
    return;
  }

  selectedCourses.innerHTML = state.selected
    .map((courseId) => {
      const course = courses.find((entry) => entry.id === courseId);
      return `
        <div class="selection-chip">
          <strong>${course.number}</strong>
          <span>${course.title}</span>
          <button class="selection-chip__remove" type="button" data-action="remove-selected" data-id="${course.id}" aria-label="Remove ${course.title}">×</button>
        </div>
      `;
    })
    .join("");
}

function renderShortlist() {
  if (!state.shortlist.length) {
    shortlistList.innerHTML = '<div class="empty-state">Shortlist a few classes to compare your options.</div>';
    return;
  }

  shortlistList.innerHTML = state.shortlist
    .map((courseId) => {
      const course = courses.find((entry) => entry.id === courseId);
      const isSelected = state.selected.includes(course.id);
      return `
        <div class="shortlist-item" draggable="true" data-draggable-id="${course.id}">
          <strong>${course.number}</strong>
          <p class="shortlist-item__meta">${course.title}</p>
          <div class="shortlist-item__actions">
            <button class="btn btn--primary" type="button" data-action="select" data-id="${course.id}" ${isSelected ? "disabled" : ""}>Select</button>
            <button class="btn btn--secondary" type="button" data-action="shortlist" data-id="${course.id}" ${isSelected ? "disabled" : ""}>Remove</button>
          </div>
        </div>
      `;
    })
    .join("");
}

function openModal(courseId) {
  const course = courses.find((entry) => entry.id === courseId);
  if (!course) return;

  state.activeCourse = course;
  modalContent.innerHTML = `
    <div class="modal__body">
      <div>
        <p class="eyebrow">Course details</p>
        <h2 id="modal-title">${course.number} · ${course.title}</h2>
        <p class="course-card__meta">${course.professor} · ${course.level}</p>
      </div>
      <p>${course.fullDescription}</p>
      <div class="modal__actions">
        <button class="btn btn--secondary" type="button" data-action="shortlist" data-id="${course.id}">
          ${state.shortlist.includes(course.id) ? "Remove shortlist" : "Add to shortlist"}
        </button>
        <button class="btn btn--primary" type="button" data-action="select" data-id="${course.id}" ${state.selected.includes(course.id) || state.selected.length >= 4 ? "disabled" : ""}>
          ${state.selected.includes(course.id) ? "Selected" : "Add to final selection"}
        </button>
      </div>
      <div>
        <h3>What students said</h3>
        <div class="reviews">
          ${course.reviews
            .map(
              (review) => `
                <div class="review">
                  <strong>${review.name}</strong>
                  <p>${review.text}</p>
                </div>
              `
            )
            .join("")}
        </div>
      </div>
    </div>
  `;
  modal.hidden = false;
}

function closeModal() {
  modal.hidden = true;
  state.activeCourse = null;
}

function toggleShortlist(courseId) {
  if (state.shortlist.includes(courseId)) {
    state.shortlist = state.shortlist.filter((id) => id !== courseId);
  } else {
    state.shortlist = [...state.shortlist, courseId];
  }
  render();
}

function addToShortlist(courseId) {
  if (!state.shortlist.includes(courseId)) {
    state.shortlist = [...state.shortlist, courseId];
    render();
  }
}

function addToSelected(courseId) {
  if (state.selected.includes(courseId)) {
    return;
  }
  if (state.selected.length >= 4) {
    window.alert("You can only select four courses for the quarter.");
    return;
  }
  state.selected = [...state.selected, courseId];
  render();
}

function toggleSelect(courseId) {
  if (state.selected.includes(courseId)) {
    state.selected = state.selected.filter((id) => id !== courseId);
  } else {
    addToSelected(courseId);
    return;
  }
  render();
}

function handleAction(target) {
  const action = target.dataset.action;
  const courseId = Number(target.dataset.id);

  if (!action || !courseId) return;

  if (action === "details") {
    openModal(courseId);
    return;
  }

  if (action === "shortlist") {
    toggleShortlist(courseId);
    return;
  }

  if (action === "select") {
    toggleSelect(courseId);
    return;
  }

  if (action === "remove-selected") {
    toggleSelect(courseId);
  }
}

searchInput.addEventListener("input", (event) => {
  state.search = event.target.value;
  render();
});

[ratingFilter, levelFilter, sortFilter].forEach((element) => {
  element.addEventListener("change", (event) => {
    if (event.target === ratingFilter) {
      state.rating = Number(event.target.value);
    }
    if (event.target === levelFilter) {
      state.level = event.target.value;
    }
    if (event.target === sortFilter) {
      state.sort = event.target.value;
    }
    render();
  });
});

document.addEventListener("click", (event) => {
  const button = event.target.closest("[data-action]");
  if (!button) return;

  if (button.dataset.action === "details" || button.dataset.action === "shortlist" || button.dataset.action === "select" || button.dataset.action === "remove-selected") {
    handleAction(button);
  }
});

document.addEventListener("dragstart", (event) => {
  const draggable = event.target.closest("[data-draggable-id]");
  if (!draggable) return;
  const courseId = draggable.dataset.draggableId;
  event.dataTransfer.setData("text/plain", courseId);
  event.dataTransfer.effectAllowed = "move";
  draggable.classList.add("dragging");
});

document.addEventListener("dragend", (event) => {
  const draggable = event.target.closest("[data-draggable-id]");
  if (draggable) {
    draggable.classList.remove("dragging");
  }
});

[shortlistList, selectedCourses].forEach((dropZone) => {
  dropZone.addEventListener("dragover", (event) => {
    event.preventDefault();
    dropZone.classList.add("drop-target--active");
    event.dataTransfer.dropEffect = "move";
  });

  dropZone.addEventListener("dragleave", () => {
    dropZone.classList.remove("drop-target--active");
  });

  dropZone.addEventListener("drop", (event) => {
    event.preventDefault();
    dropZone.classList.remove("drop-target--active");
    const courseId = Number(event.dataTransfer.getData("text/plain"));
    if (!courseId) return;
    if (dropZone.id === "shortlist-list") {
      addToShortlist(courseId);
    }
    if (dropZone.id === "selected-courses") {
      addToSelected(courseId);
    }
  });
});

document.querySelectorAll("[data-close='modal']").forEach((element) => {
  element.addEventListener("click", closeModal);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeModal();
  }
});

render();
